
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

class Cow(BaseModel):
    id_individual: int
    sex: str
    breed: str
    birth_date: datetime = Field(..., description="Date in format YYYY-MM-DD")
    father_id: int
    mother_id: int
    milk_yield_day: float
    body_condition: int
    inbreeding_coefficient: float
    weight_gain_day: float
    health_score: int
    fertility_percentage: int 
    genetic_value: int

class TypeCross(str, Enum):
    purebred = 'purebred'
    interspecific = 'interspecific' 

class Direction(str, Enum):
    milk = 'milk'
    meat = 'meat'
    combined = 'combined'