
from fastapi import APIRouter
from .service import calculate
from .schemas import Cow, TypeCross, Direction

router = APIRouter()

@router.post('/calculate_offspring')
def calculate_offspring(cow: Cow, direction: Direction, type: TypeCross):
    """
    Вычисление совместимости по фенотипу и нахождение мутация по генотипу
    """
    result = calculate(cow.model_dump(), direction, type)
    return result.to_dict(orient='records')

    