import pandas as pd
from datetime import datetime
import networkx as nx
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os

def read_data(file_path):
    try:
        data = pd.read_excel(file_path, engine='openpyxl')

        if 'Дата_Рождения' in data.columns:
            data['Дата_Рождения'] = pd.to_datetime(data['Дата_Рождения'], errors='coerce')

            today = datetime.today()
            data['Возраст'] = data['Дата_Рождения'].apply(
                lambda x: (today - x).days // 365 if pd.notnull(x) else None
            )               

        return data
    except Exception as e:
        print(f"Ошибка при чтении файла: {e}")
        return None
    
fenotype_data = read_data('./data/Датасет на хакатон.xlsx')
fenotype_data.fillna(0, inplace=True)

genotype_data = read_data('./data/Генетические мутации хакатон.xlsx')

merged_data = pd.merge(genotype_data, fenotype_data, on='ID_особи')

def check_mutation(genotype, ref, alt):
    if genotype == f"{alt}/{alt}":
        return 1
    elif genotype == f"{ref}/{ref}":
        return 0
    elif genotype == f"{ref}/{alt}" or genotype == f"{alt}/{ref}":
        return 0.5
    else:
        return -1
    
merged_data['is_mutation'] = merged_data.apply(lambda row: check_mutation(row['Генотип коровы'], row['ref'], row['alt']), axis = 1)

merged_data = pd.merge(merged_data, genotype_data[['ID_особи', 'Генотип коровы']].rename(columns={'ID_особи': 'Родитель_папа', 'Генотип коровы': 'Генотип_папа'}), left_on='Родитель_папа', right_on='Родитель_папа', how='left') 
merged_data = pd.merge(merged_data, genotype_data[['ID_особи', 'Генотип коровы']].rename(columns={'ID_особи': 'Родитель_мама', 'Генотип коровы': 'Генотип_мама'}), left_on='Родитель_мама', right_on='Родитель_мама', how='left')


def determine_mutation_type(genotype):
    if pd.isna(genotype):
        return None
    ref, alt = genotype.split('/')
    if ref == alt:
        return 'Гомозигота'
    else:
        return 'Гетерозигота'
    
merged_data['mutation_type_dad'] = merged_data['Генотип_папа'].apply(determine_mutation_type)
merged_data['mutation_type_mom'] = merged_data['Генотип_мама'].apply(determine_mutation_type)


def mendelian_probability(dad, mom):
    if dad == 'Гомозигота' and mom == 'Гомозигота':
        return {'Гомозигота': 1.0, 'Гетерозигота': 0.0}
    elif dad == 'Гетерозигота' and mom == 'Гетерозигота':
        return {'Гомозигота': 0.25, 'Гетерозигота': 0.5, 'Гомозигота (рецессивная)': 0.25}
    elif (dad == 'Гомозигота' and mom == 'Гетерозигота') or (dad == 'Гетерозигота' and mom == 'Гомозигота'):
        return {'Гомозигота': 0.5, 'Гетерозигота': 0.5}
    else:
        return {'Гомозигота': 0.0, 'Гетерозигота': 0.0, 'Гомозигота (рецессивная)': 1.0}
    
merged_data['mutation_probabilities'] = merged_data.apply(
    lambda row: mendelian_probability(row['mutation_type_dad'], row['mutation_type_mom']), axis = 1
)

def calculate_final_trait(row):
    base_value = row[row['Признак']]
    return base_value + row['beta'] * row['is_mutation']

merged_data['Итоговое значение признака'] = merged_data.apply(calculate_final_trait, axis = 1)

def calculate_penalty(value, optimal_range, weight):
    if isinstance(optimal_range, tuple):
        lower, upper = optimal_range
        if value < lower:
            return (lower - value) * weight
        elif value > upper:
            return (value - upper) * weight
    elif isinstance(optimal_range, float) or isinstance(optimal_range, int):
        return abs(value - optimal_range) * weight
    return 0

def evaluate_cow(cow, common_weights, direction_weights, direction):
    penalty = 0
    penalty += calculate_penalty(cow['Коэффициент инбридинга (F)'], (0, 0.24), common_weights['Коэффициент инбридинга (F)']) 
    penalty += calculate_penalty(cow['Здоровье (1-10)'], (8, 10), common_weights['Здоровье (1-10)']) 
    penalty += calculate_penalty(cow['Упитанность'], (3, 4), common_weights['Упитанность']) 
    penalty += calculate_penalty(cow['Фертильность (%)'], 70, common_weights['Фертильность (%)']) 
    penalty += calculate_penalty(cow['Генетическая ценность (баллы)'], (80, 100), common_weights['Генетическая ценность (баллы)'])

    if direction in direction_weights: 
        dir_weights = direction_weights[direction] 
        penalty += calculate_penalty(cow['Удой л/день'], 30, dir_weights['Удой л/день']) # Укажите свои оптимальные значения 
        penalty += calculate_penalty(cow['Прирост веса кг/день'], 0.7, dir_weights['Прирост веса кг/день']) 
    return penalty

my_cow = {
    'ID_особи': 2,
    'Пол': 'Самка',	
    'Порода': 'Айрширская',
    'Дата_Рождения': '2021-10-19',	
    'Родитель_папа': 3532,
    'Родитель_мама': 6271,
    'Удой л/день': 20,
    'Упитанность': 4,
    'Коэффициент инбридинга (F)': 0.02,	
    'Прирост веса кг/день': 1.22,	    
    'Здоровье (1-10)': 5,	
    'Фертильность (%)': 85,	
    'Генетическая ценность (баллы)': 70,
    'Возраст': 3,
}

common_weights = {
    "Коэффициент инбридинга (F)": 2.0,
    "Здоровье (1-10)": 1.5,
    "Упитанность": 1.2,
    "Возраст": 1.0,
    "Фертильность (%)": 1.7,
    "Генетическая ценность (баллы)": 1.4
}

direction_weights = {
    'молочное': {
        'Удой л/день': 2.0,
        'Прирост веса кг/день': 1.0
    },
    'мясное': {
        'Удой л/день': 1.0,
        'Прирост веса кг/день': 2.0
    },
    'комбинированное': {
        'Удой л/день': 1.5,
        'Прирост веса кг/день': 1.5
    },

}


direction = 'молочное'
fenotype_data['Penalty'] = fenotype_data.apply(
    lambda row: evaluate_cow(row, common_weights, direction_weights, direction),
    axis = 1
)

my_cow_penalty = evaluate_cow(pd.Series(my_cow), common_weights, direction_weights, direction)
print(my_cow_penalty)

def calculate_compatibility(cow, my_cow, cow_penalty, my_cow_penalty):
    if cow['Пол'] == my_cow['Пол']:
        return 0
    return 100 - abs(cow_penalty - my_cow_penalty)

fenotype_data['Compatibility'] = fenotype_data.apply( 
    lambda row: calculate_compatibility(row, pd.Series(my_cow), row['Penalty'], my_cow_penalty), 
    axis = 1
)

filtered_data = fenotype_data[(fenotype_data['Порода'] == my_cow['Порода'])]

sorted_data = filtered_data.sort_values(by='Compatibility', ascending=False)
print(sorted_data.head(10))