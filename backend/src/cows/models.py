from sqlalchemy import Column, Integer, ForeignKey, String, Float
from sqlalchemy.orm import relationship
from database import Base

class PhenotypeWithPenalties(Base):
    __tablename__ = "phenotype_with_penalties"

    id = Column(Integer, primary_key=True, index=True)
    id_individual = Column(Integer, index=True, nullable=False)
    breed = Column(String, nullable=False)
    sex = Column(String, nullable=False)
    penalty_milk = Column(Float, nullable=False)
    penalty_meat = Column(Float, nullable=False)
    penalty_combined = Column(Float, nullable=False)
    compatibility = Column(Float, nullable=True)

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
