import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from .models import Genotype

# Чтение данных из файла
def read_data(file_path: str) -> pd.DataFrame:
    try:
        data = pd.read_excel(file_path, engine='openpyxl')
        if 'birth_date' in data.columns:
            data['birth_date'] = pd.to_datetime(data['birth_date'], errors='coerce')
            today = datetime.today()
            data['age'] = data['birth_date'].apply(
                lambda x: (today - x).days // 365 if pd.notnull(x) else None
            )
        return data
    except Exception as e:
        print(f"Ошибка при чтении файла: {e}")
        return pd.DataFrame()

#* ФУНКЦИИ ДЛЯ ГЕНОТИПА
def get_mutations(db: Session, cow_id: int) -> list:
    mutations = []
    genotypes = db.query(Genotype).filter(Genotype.id_individual == cow_id).all()
    
    for genotype in genotypes:
        mutations.append({
            'trait': genotype.trait,
            'beta': genotype.beta,
            'alt': genotype.alt,
            'ref': genotype.ref
        })
    return mutations


# Функция для расчета вклада каждой мутации
def calculate_phenotypic_effect(genotype, beta):
    alleles = genotype.split('/')
    if len(alleles) == 2 and alleles[0] == alleles[1]:  # Гомозиготный генотип
        return 2 * beta
    else:  # Гетерозиготный генотип или некорректный формат
        return beta
    
# Переименование колонок
def rename_columns_genotype(data: pd.DataFrame) -> pd.DataFrame:
    column_mapping = {
        'mutation_id': 'mutation_id',
        'chrom': 'chrom',	
        'pos': 'pos',	
        'ref': 'ref',	
        'alt': 'alt',	
        'Признак': 'trait',	
        'beta': 'beta',	
        'Генотип коровы': 'genotype_cow',
        'ID_особи': 'id_individual'
    }

    # Корректно выбираем существующие колонки для переименования
    columns_to_rename = {key: value for key, value in column_mapping.items() if key in data.columns}

    # Переименовываем только подходящие колонки
    data.rename(columns=columns_to_rename, inplace=True)

    return data

#* ФУНКЦИИ ДЛЯ ФЕНОТИПА

# Переименование колонок
def rename_columns_phenotype(data: pd.DataFrame) -> pd.DataFrame:
    column_mapping = {
        'ID_особи': 'id_individual',
        'Пол': 'sex',
        'Порода': 'breed',
        'Дата_Рождения': 'birth_date',
        'Родитель_папа': 'father_id',
        'Родитель_мама': 'mother_id',
        'Удой л/день': 'milk_yield_day',
        'Упитанность': 'body_condition',
        'Коэффициент инбридинга (F)': 'inbreeding_coefficient',
        'Прирост веса кг/день': 'weight_gain_day',
        'Здоровье (1-10)': 'health_score',
        'Фертильность (%)': 'fertility_percentage',
        'Генетическая ценность (баллы)': 'genetic_value'
    }

    # Корректно выбираем существующие колонки для переименования
    columns_to_rename = {key: value for key, value in column_mapping.items() if key in data.columns}

    # Переименовываем только подходящие колонки
    data.rename(columns=columns_to_rename, inplace=True)

    return data

# Подсчет штрафа
def calculate_penalty(value: float, optimal_range: tuple, weight: float):
    if isinstance(optimal_range, tuple):
        lower, upper = optimal_range
        if value < lower:
            return (lower - value) * weight
        elif value > upper:
            return (value - upper) * weight
    elif isinstance(optimal_range, float) or isinstance(optimal_range, int):
        return abs(value - optimal_range) * weight
    return 0

# Оценить корову
def evaluate_cow(cow, common_weights, direction_weights, direction):
    penalty = 0
    penalty += calculate_penalty(cow['inbreeding_coefficient'], (0, 0.24), common_weights['inbreeding_coefficient']) 
    penalty += calculate_penalty(cow['health_score'], (8, 10), common_weights['health_score']) 
    penalty += calculate_penalty(cow['body_condition'], (3, 4), common_weights['body_condition']) 
    penalty += calculate_penalty(cow['fertility_percentage'], 70, common_weights['fertility_percentage']) 
    penalty += calculate_penalty(cow['genetic_value'], (80, 100), common_weights['genetic_value'])

    
    if isinstance(direction, str) and direction in direction_weights:
        dir_weights = direction_weights[direction] 
        penalty += calculate_penalty(cow['milk_yield_day'], 30, dir_weights['milk_yield_day']) # Укажите свои оптимальные значения 
        penalty += calculate_penalty(cow['weight_gain_day'], 0.7, dir_weights['weight_gain_day']) 

    return penalty

# Подсчет совместимости
def calculate_compatibility(cow, my_cow, cow_penalty, my_cow_penalty):
    if cow.sex == my_cow.sex:
        return 0
    return 100 - (abs(cow_penalty - my_cow_penalty) / max(cow_penalty, my_cow_penalty)) * 100