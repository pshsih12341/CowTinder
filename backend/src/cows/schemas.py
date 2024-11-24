
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Cow(BaseModel):
    id_individual: int
    sex: str 
    breed: Optional[str] = Field(default='')
    birth_date: Optional[datetime] = Field(..., description="Date in format YYYY-MM-DD")
    father_id: Optional[int] = Field(default=-1)
    mother_id: Optional[int] = Field(default=-1)
    milk_yield_day: Optional[float] = Field(default=0)
    body_condition: Optional[int] = Field(default=0)
    inbreeding_coefficient: Optional[float] = Field(default=0)
    weight_gain_day: Optional[float] = Field(default=0)
    health_score: Optional[int] = Field(default=0)
    fertility_percentage: Optional[int] = Field(default=0)
    genetic_value: Optional[int] = Field(default=0)

class TypeCross(str, Enum):
    purebred = 'purebred'
    interspecific = 'interspecific' 

class Direction(str, Enum):
    milk = 'milk'
    meat = 'meat'
    combined = 'combined'