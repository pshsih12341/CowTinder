
from fastapi import APIRouter, Depends, HTTPException, status
from .service import calculate
from .schemas import Cow, TypeCross, Direction
from database import get_session
from .crud import save_penalties_to_db, fetch_penalties
from .utils import read_data, rename_columns_genotype, evaluate_cow, rename_columns_phenotype
from .config import common_weights, direction_weights
from sqlalchemy.orm import Session
import os

router = APIRouter()

@router.post('/calculate_offspring')
def calculate_offspring(cow: Cow, direction: Direction, type: TypeCross, db: Session = Depends(get_session)):
    """
    Вычисление совместимости по фенотипу и нахождение мутация по генотипу
    """
    result = calculate(cow.model_dump(), direction, type, db)
    return [item for item in result]

@router.post("/preprocess")
def preprocess_penalties(
    db: Session = Depends(get_session),
):
    phenotype_path = './../../data/Датасет на хакатон.xlsx'

    if not os.path.exists(phenotype_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Файл данных не найден!')

    # Загрузка данных
    phenotype_data = read_data(phenotype_path)
    phenotype_data.fillna(0, inplace=True)
    phenotype_data = rename_columns_phenotype(phenotype_data)

    # Рассчитываем штрафы для каждого направления
    directions = ['milk', 'meat', 'combined']
    for direction in directions:
        column_name = f'penalty_{direction}'
        phenotype_data[column_name] = phenotype_data.apply(
            lambda row: evaluate_cow(row, common_weights, direction_weights, direction=direction),
            axis=1
        )

    # Сохранение в базу данных
    save_penalties_to_db(phenotype_data, db)
    return {"message": "Penalties preprocessed and saved successfully"}

    