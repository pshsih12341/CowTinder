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
def calculate_mutation_probabilities(individual, partner, db: Session):
    probabilities = {}

    all_mutations = individual['mutations'] + partner['mutations']

    for mutation in all_mutations:
        trait = mutation['trait']
        beta = mutation['beta']

        individual_genotypes = db.query(Genotype).filter(Genotype.id_individual == individual['id_individual']).all()
        partner_genotypes = db.query(Genotype).filter(Genotype.id_individual == partner['id_individual']).all()

        probability = 0.0
        effect = 0.0

        # Перебор всех комбинаций генотипов партнёров
        for individual_genotype, partner_genotype in zip(individual_genotypes, partner_genotypes):
            individual_alleles = individual_genotype.genotype_cow.split('/')
            partner_alleles = partner_genotype.genotype_cow.split('/')

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

def apply_effects_to_cow(base_cow: dict, partner_cow: dict, effects: dict) -> dict: 
    updated_values = {} 
    for trait, data in effects.items(): 
        base_value = base_cow.get(trait, 0) 
        partner_value = partner_cow.get(trait, 0) 
        
        if trait == 'Удой л/день':
            if base_cow.get('sex') == 'Самка' and partner_cow.get('sex') == 'Самка':
                updated_value = (base_value + partner_value) / 2 + data['effect']
            elif base_cow.get('sex') == 'Самка':
                updated_value = base_value + data['effect']
            elif partner_cow.get('sex') == 'Самка':
                updated_value = partner_value + data['effect']
            else:
                continue 
        else:
            updated_value = (base_value + partner_value) / 2 + data['effect']
        
        # Проверка и корректировка значений в соответствии с ограничениями
        if trait == 'Упитанность': 
            updated_value = min(max(updated_value, 1), 5) 
        elif trait == 'Здоровье (1-10)': 
            updated_value = min(max(updated_value, 1), 10) 
        elif trait == 'Генетическая ценность (баллы)': 
            updated_value = min(updated_value, 100) 
        if data['effect'] < 0: 
            updated_value = max(updated_value, 0)
        if trait in ['Упитанность', 'Здоровье (1-10)', 'Генетическая ценность (баллы)']:
            updated_value = round(updated_value)
            
        updated_values[trait] = {
            'updated_value': updated_value,
            'probability': data['probability']
        } 
    return updated_values

def calculate_inbreeding_coefficient(cow: Cow) -> float:
    if cow.father_id == cow.mother_id:
        return 0.25
    return 0

def calculate(cow_data: dict, direction: Direction, type: TypeCross, db: Session) -> pd.DataFrame:  
    cow = Cow(**cow_data)
    phenotype_data = db.query(Phenotype).filter(Phenotype.id_individual != cow.id_individual, Phenotype.sex != cow.sex).all()

    cow_mutations = get_mutations(db, cow.id_individual) 
    phenotype_mutations = {phenotype.id_individual: get_mutations(db, phenotype.id_individual) for phenotype in phenotype_data}
    
    cow_inbreeding_coefficient = calculate_inbreeding_coefficient(cow)

    updated_cows = []

    if type.value == 'purebred':
        phenotype_data = [p for p in phenotype_data if p.breed == cow.breed]

        for partner_cow in phenotype_data:
            partner_penalty = get_penalty_for_cow(db, partner_cow.id_individual, direction.value)
            cow_penalty = get_penalty_for_cow(db, cow.id_individual, direction.value)

            if not cow_penalty:
                cow_penalty = evaluate_cow(cow, common_weights, direction_weights, direction.value)

            compatibility = calculate_compatibility(partner_cow, cow, partner_penalty, cow_penalty)

            partner_gcv = get_penalty_for_cow(db, partner_cow.id_individual, direction.value) 
            partner_inbreeding_coefficient = calculate_inbreeding_coefficient(partner_cow)
            if partner_inbreeding_coefficient + cow_inbreeding_coefficient > 0.25: 
                continue 
            if partner_gcv < 50: 
                continue

            partner_mutations = phenotype_mutations[partner_cow.id_individual]

            effects = calculate_mutation_probabilities({'id_individual': cow.id_individual, 'mutations': cow_mutations}, {'id_individual': partner_cow.id_individual, 'mutations': partner_mutations}, db)
            updated_values = apply_effects_to_cow(cow.dict(), partner_cow.__dict__, effects)
            if partner_cow.sex == 'Самец': 
                if 'Удой л/день' in updated_values: 
                    del updated_values['Удой л/день']
            updated_cows.append({**partner_cow.__dict__, 'compatibility': compatibility, 'mutations_child': updated_values})

    return sorted(updated_cows, key=lambda x: x['compatibility'], reverse=True)[:10]
