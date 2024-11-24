import pandas as pd
from fastapi import HTTPException, status
from .utils import rename_columns_phenotype, rename_columns_genotype, evaluate_cow, calculate_compatibility, get_mutations, calculate_phenotypic_effect, read_data
from .config import common_weights, direction_weights
from .schemas import Cow, TypeCross, Direction
import os

# Подсчет вероятности проявления мутации для каждого признака    
def calculate_mutation_probabilities(individual, partner, genotype_data):
    probabilities = {}

    all_mutations = individual['mutations'] + partner['mutations']

    for mutation in all_mutations:
        trait = mutation['trait']
        beta = mutation['beta']

        individual_genotypes = genotype_data[
            (genotype_data['id_individual'] == individual['id_individual'])
        ]['genotype_cow'].values

        partner_genotypes = genotype_data[
            (genotype_data['id_individual'] == partner['id_individual'])
        ]['genotype_cow'].values

        probability = 0.0
        effect = 0.0

        # Перебор всех комбинаций генотипов партнёров
        for individual_genotype, partner_genotype in zip(individual_genotypes, partner_genotypes):
            individual_alleles = individual_genotype.split('/')
            partner_alleles = partner_genotype.split('/')

            combined_genotypes = [
                f"{individual_alleles[0]}/{partner_alleles[0]}",
                f"{individual_alleles[1]}/{partner_alleles[1]}"
            ] 
            
            for combined_genotype in combined_genotypes:
                effect += calculate_phenotypic_effect(combined_genotype, beta)
            
                if combined_genotype == f"{mutation['alt']}/{mutation['alt']}":
                    probability += 1.0
                elif f"{mutation['alt']}/{mutation['ref']}" in combined_genotype or f"{mutation['ref']}/{mutation['alt']}" in combined_genotype:
                    probability += 0.5

        # Нормализуем вероятность и эффект, если было несколько генотипов у партнёров
        if len(individual_genotypes) * len(partner_genotypes) > 0:
            probability /= (len(individual_genotypes) * len(partner_genotypes))
            effect /= (len(individual_genotypes) * len(partner_genotypes))

        if trait in probabilities:
            probabilities[trait]['probability'] = max(probabilities[trait]['probability'], probability)
            probabilities[trait]['effect'] += effect
        else:
            probabilities[trait] = {'probability': probability, 'effect': effect}

    return probabilities

def apply_effects_to_cow(base_cow, partner_cow, effects): 
    updated_values = {} 
    for trait, data in effects.items(): 
        base_value = base_cow.get(trait, 0) 
        partner_value = partner_cow.get(trait, 0) 
        updated_value = (base_value + partner_value) / 2 + data['effect'] 
        if data['effect'] < 0: 
            updated_value = max(updated_value, 0)
        if trait in ['Упитанность', 'Здоровье (1-10)', 'Генетическая ценность (баллы)']:
            updated_value = round(updated_value)
        updated_values[trait] = {
            'updated_value': updated_value,
            'probability': data['probability']
        } 
    return updated_values

def calculate(cow: Cow, direction: Direction, type: TypeCross) -> pd.DataFrame:
    phenotype_path = '../../data/Датасет на хакатон.xlsx'
    genotype_path = '../../data/Генетические мутации хакатон.xlsx'

    if not os.path.exists(phenotype_path) and not os.path.exists(genotype_path): 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Файлы данных не найдены!')
    
    phenotype_data = read_data(phenotype_path)
    phenotype_data.fillna(0, inplace=True)
    phenotype_data = rename_columns_phenotype(phenotype_data)

    genotype_data = read_data(genotype_path)
    genotype_data = rename_columns_genotype(genotype_data)
    phenotype_data['mutations'] = phenotype_data['id_individual'].apply(lambda x: get_mutations(genotype_data, x))

    cow['mutations'] = get_mutations(genotype_data, cow['id_individual'])

    updated_cows = []

    if type.value == 'purebred':
        phenotype_data = phenotype_data[(phenotype_data['id_individual'] != cow['id_individual']) &
                                    (phenotype_data['sex'] != cow['sex'])]
        
        phenotype_data['penalty'] = phenotype_data.apply(
            lambda row: evaluate_cow(row, common_weights, direction_weights, direction),
            axis = 1
        )

        cow_penalty = evaluate_cow(pd.Series(cow), common_weights, direction_weights, direction)

        phenotype_data['compatibility'] = phenotype_data.apply( 
            lambda row: calculate_compatibility(row, pd.Series(cow), row['penalty'], cow_penalty), 
            axis = 1
        )

        # Отфильтровали и отсортировали лучших коров по совместимости по фенотипу
        filtered_data = phenotype_data[(phenotype_data['breed'] == cow['breed'])]
        sorted_data = filtered_data.sort_values(by='compatibility', ascending=False)

        # Нахождение вероятности появления признака мутации и насколько измениться признак 
        for _, partner_cow in sorted_data[:10].iterrows():
            if partner_cow['id_individual'] != cow['id_individual'] and partner_cow['sex'] != cow['sex']:
                effects = calculate_mutation_probabilities(cow, partner_cow, genotype_data)
                updated_values = apply_effects_to_cow(cow, partner_cow, effects)
                updated_cows.append({**partner_cow.to_dict(), 'mutations_child': updated_values})

    return pd.DataFrame(updated_cows)