import pandas as pd
from datetime import datetime
from fastapi import HTTPException, status
from .utils import rename_columns, evaluate_cow, calculate_compatibility
from .config import common_weights, direction_weights
from .schemas import Cow, TypeCross, Direction
import os


def read_data(file_path: str) -> pd.DataFrame:
    """
    Чтение файла
    """
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

def calculate(cow: Cow, direction: Direction, type: TypeCross) -> pd.DataFrame:
    phenotype_path = '../../data/Датасет на хакатон.xlsx'

    if not os.path.exists(phenotype_path): 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Файлы данных не найдены!')
    
    phenotype_data = read_data(phenotype_path)
    phenotype_data.fillna(0, inplace=True)
    phenotype_data = rename_columns(phenotype_data)

    # merged_data = pd.merge(genotype_path, phenotype_data, on='ID_особи')
    # merged_data.fillna()

    phenotype_data = phenotype_data[(phenotype_data['id_individual'] != cow['id_individual']) &
                                    (phenotype_data['sex'] != cow['sex'])]

    if type.value == 'purebred':
        phenotype_data['penalty'] = phenotype_data.apply(
            lambda row: evaluate_cow(row, common_weights, direction_weights, direction),
            axis = 1
        )

        cow_penalty = evaluate_cow(pd.Series(cow), common_weights, direction_weights, direction)

        phenotype_data['compatibility'] = phenotype_data.apply( 
            lambda row: calculate_compatibility(row, pd.Series(cow), row['penalty'], cow_penalty), 
            axis = 1
        )

        filtered_data = phenotype_data[(phenotype_data['breed'] == cow['breed'])]
        sorted_data = filtered_data.sort_values(by='compatibility', ascending=False)

    return sorted_data.head(10)