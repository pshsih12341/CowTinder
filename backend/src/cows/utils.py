import pandas as pd

#* ФУНКЦИИ ДЛЯ ГЕНОТИПА

# Проверка на мутацию
def check_mutation(genotype: str, ref: str, alt: str) -> float:   
    if genotype == f"{alt}/{alt}":
        return 1
    elif genotype == f"{ref}/{ref}":
        return 0
    elif genotype == f"{ref}/{alt}" or genotype == f"{alt}/{ref}":
        return 0.5
    else:
        return -1

# Определение типа мутации
def determine_mutation_type(genotype: str) -> str:
    if pd.isna(genotype):
        return None
    ref, alt = genotype.split('/')
    if ref == alt:
        return 'Гомозигота'
    else:
        return 'Гетерозигота'

# Закон менделя вероятность
def mendelian_probability(dad: str, mom: str) -> dict:
    if dad == 'Гомозигота' and mom == 'Гомозигота':
        return {'Гомозигота': 1.0, 'Гетерозигота': 0.0}
    elif dad == 'Гетерозигота' and mom == 'Гетерозигота':
        return {'Гомозигота': 0.25, 'Гетерозигота': 0.5, 'Гомозигота (рецессивная)': 0.25}
    elif (dad == 'Гомозигота' and mom == 'Гетерозигота') or (dad == 'Гетерозигота' and mom == 'Гомозигота'):
        return {'Гомозигота': 0.5, 'Гетерозигота': 0.5}
    else:
        return {'Гомозигота': 0.0, 'Гетерозигота': 0.0, 'Гомозигота (рецессивная)': 1.0}

# Подсчет финального значения признака, после мутации
def calculate_final_trait(row: pd.Series) -> float:
    base_value = row[row['Признак']]
    return base_value + row['beta'] * row['is_mutation']



#* ФУНКЦИИ ДЛЯ ФЕНОТИПА

# Переименование колонок
def rename_columns(data: pd.DataFrame) -> pd.DataFrame:
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

    
    if direction.value in direction_weights: 
        dir_weights = direction_weights[direction.value] 
        penalty += calculate_penalty(cow['milk_yield_day'], 30, dir_weights['milk_yield_day']) # Укажите свои оптимальные значения 
        penalty += calculate_penalty(cow['weight_gain_day'], 0.7, dir_weights['weight_gain_day']) 
    else:
        print('Не зашел')
    return penalty

# Подсчет совместимости
def calculate_compatibility(cow, my_cow, cow_penalty, my_cow_penalty):
    if cow['sex'] == my_cow['sex']:
        return 0
    return 100 - (abs(cow_penalty - my_cow_penalty) / max(cow_penalty, my_cow_penalty)) * 100