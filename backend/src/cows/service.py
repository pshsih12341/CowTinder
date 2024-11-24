import pandas as pd
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from database import get_session
from .utils import evaluate_cow, calculate_compatibility, get_mutations, calculate_phenotypic_effect
from .config import common_weights, direction_weights
from .schemas import Cow, TypeCross, Direction
from .models import Phenotype, Genotype, PhenotypeWithPenalties

def get_penalty_for_cow(db: Session, cow_id: int, direction: str) -> float:
    penalty_column = None
    if direction == 'milk':
        penalty_column = 'penalty_milk'
    elif direction == 'meat':
        penalty_column = 'penalty_meat'
    elif direction == 'combined':
        penalty_column = 'penalty_combined'

    if penalty_column is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid direction value!')

    penalty = db.query(PhenotypeWithPenalties).filter(PhenotypeWithPenalties.id_individual == cow_id).first() 
    if penalty: 
        return getattr(penalty, penalty_column) 
    else: 
        return None

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

def calculate(cow_data: dict, direction: Direction, type: TypeCross, db: Session) -> pd.DataFrame:  
    cow = Cow(**cow_data)
    phenotype_data = db.query(Phenotype).filter(Phenotype.id_individual != cow.id_individual, Phenotype.sex != cow.sex).all()
    genotype_data = db.query(Genotype).all()

    # for phenotype in phenotype_data: phenotype.mutations = get_mutations(genotype_data, phenotype.id_individual) 
    # cow.mutations = get_mutations(genotype_data, cow.id_individual) 
    updated_cows = []

    if type.value == 'purebred':
        phenotype_data = [p for p in phenotype_data if p.breed == cow.breed]

        for partner_cow in phenotype_data:
            partner_penalty = get_penalty_for_cow(db, partner_cow.id_individual, direction.value)
            cow_penalty = get_penalty_for_cow(db, cow.id_individual, direction.value)

            if not cow_penalty:
                cow_penalty = evaluate_cow(cow, common_weights, direction_weights, direction.value)

            compatibility = calculate_compatibility(partner_cow, cow, partner_penalty, cow_penalty)

            # effects = calculate_mutation_probabilities(cow, partner_cow, genotype_data)
            # updated_values = apply_effects_to_cow(cow, partner_cow, effects) 
            updated_cows.append({**partner_cow.__dict__, 'compatibility': compatibility})

    return sorted(updated_cows, key=lambda x: x['compatibility'], reverse=True)[:10]
