from sqlalchemy.orm import Session
from .models import PhenotypeWithPenalties

def save_penalties_to_db(phenotype_data, db: Session):
    """
    Сохраняет DataFrame с предрасчитанными данными в таблицу PostgreSQL.
    """
    records = [
        PhenotypeWithPenalties(
            id_individual=row['id_individual'],
            breed=row['breed'],
            sex=row['sex'],
            penalty_milk=row['penalty_milk'],
            penalty_meat=row['penalty_meat'],
            penalty_combined=row['penalty_combined']
        )
        for _, row in phenotype_data.iterrows()
    ]

    db.add_all(records)
    db.commit()


def fetch_penalties(db: Session):
    """
    Получение всех записей из таблицы.
    """
    return db.query(PhenotypeWithPenalties).all()
