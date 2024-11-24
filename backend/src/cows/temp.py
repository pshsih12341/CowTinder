import pandas as pd
from sqlalchemy import Float, create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy.ext.declarative import declarative_base
from utils import rename_columns_genotype, rename_columns_phenotype

Base = declarative_base()

class Phenotype(Base):
    __tablename__ = 'phenotypes'
    id = Column(Integer, primary_key=True, index=True)
    id_individual = Column(Integer, unique=True, index=True)
    sex = Column(String)
    breed = Column(String)
    birth_date = Column(String)
    father_id = Column(Integer)
    mother_id = Column(Integer)
    milk_yield_day = Column(Float)
    body_condition = Column(Float)
    inbreeding_coefficient = Column(Float)
    weight_gain_day = Column(Float)
    health_score = Column(Float)
    fertility_percentage = Column(Float)
    genetic_value = Column(Float)
    mutations = relationship("PhenotypeMutation", back_populates="phenotype")

class Genotype(Base):
    __tablename__ = 'genotypes'
    id = Column(Integer, primary_key=True, index=True)
    id_individual = Column(Integer, index=True)
    genotype_cow = Column(String)
    mutation_id = Column(String)
    chrom = Column(String)
    pos = Column(Integer)
    ref = Column(String)
    alt = Column(String)
    trait = Column(String)
    beta = Column(Float)
    mutations = relationship("PhenotypeMutation", back_populates="genotype")

class PhenotypeMutation(Base):
    __tablename__ = 'phenotype_mutations'
    id = Column(Integer, primary_key=True, index=True)
    id_phenotype = Column(Integer, ForeignKey('phenotypes.id'))
    id_genotype = Column(Integer, ForeignKey('genotypes.id'))
    phenotype = relationship("Phenotype", back_populates="mutations")
    genotype = relationship("Genotype", back_populates="mutations")

# Создаем подключение к базе данных
DATABASE_URL = "postgresql://postgres:qazxswC123+@localhost/agro"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Функция для чтения данных из Excel
def read_data(file_path: str) -> pd.DataFrame:
    try:
        return pd.read_excel(file_path, engine='openpyxl')
    except Exception as e:
        print(f"Ошибка при чтении файла: {e}")
        return pd.DataFrame()

# Перенос данных в таблицы PostgreSQL
def transfer_data_to_db(data: pd.DataFrame, model, db):
    for index, row in data.iterrows():
        existing_record = db.query(model).filter_by(id_individual=row['id_individual']).first() 
        if existing_record: 
            continue
        db_record = model(**row.to_dict())
        db.add(db_record)
    db.commit()

# Создание связей между фенотипами и мутациями
def create_phenotype_mutations(phenotype_data, genotype_data, db):
    for _, pheno_row in phenotype_data.iterrows():
        id_individual = pheno_row['id_individual']
        geno_rows = genotype_data[genotype_data['id_individual'] == id_individual]
        for _, geno_row in geno_rows.iterrows():
            phenotype_mutation = PhenotypeMutation(
                id_phenotype=id_individual,
                id_genotype=geno_row['id']
            )
            db.add(phenotype_mutation)
    db.commit()

# Пример вызова функций
if __name__ == "__main__":
    phenotype_data = read_data('./data/Датасет на хакатон.xlsx')
    genotype_data = read_data('./data/Генетические мутации хакатон.xlsx')

    phenotype_data.fillna(0, inplace=True)
    phenotype_data = rename_columns_phenotype(phenotype_data)
    genotype_data = rename_columns_genotype(genotype_data)

    # Создадим таблицы в базе данных
    Base.metadata.create_all(bind=engine)

    if 'id' not in genotype_data.columns:
        # Если столбца 'id' нет, создаем его на основе имеющихся данных
        genotype_data['id'] = range(1, len(genotype_data) + 1)

    # Создадим сессию
    db = SessionLocal()

    # Перенос данных фенотипов
    transfer_data_to_db(phenotype_data, Phenotype, db)

    # Перенос данных генотипов
    transfer_data_to_db(genotype_data, Genotype, db)

    # # Создание связей между фенотипами и мутациями
    create_phenotype_mutations(phenotype_data, genotype_data, db)
