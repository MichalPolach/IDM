"""
This module contains ORM models and functions that interact with the application database.
These classes and functions are used in the main application to interact with the database using SQLAlchemy ORM.
"""

from sqlalchemy import create_engine, Column, Integer, String, desc, func, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_login import UserMixin
from flask_bcrypt import Bcrypt
import pymysql

Base = declarative_base()

class User(Base, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(20), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    active_user = Column(Integer, default=1)

class Data(Base):
    __tablename__ = 'data'

    rec = Column(Integer, primary_key=True)
    id = Column(Integer, nullable=False)
    sn = Column(String(50), unique=True, nullable=False)
    pn = Column(String(50))
    manufacturer = Column(String(100))
    description = Column(String(255))
    date_created = Column(String(20))
    active_user = Column(String(20))
    reoccurence = Column(Integer, default=0)

class HistoryData(Base):
    __tablename__ = 'history_data'

    id = Column(Integer, primary_key=True)
    data_id = Column(Integer, nullable=True)
    sn = Column(String(50))
    pn = Column(String(50))
    manufacturer = Column(String(100))
    description = Column(String(255))
    location = Column(String(20))
    next_location = Column(String(20))
    position = Column(String(20))
    shelf = Column(String(10))
    comment = Column(String(255))
    result = Column(String(6))
    employee = Column(String(20))
    timestamp = Column(String(20))
    date_created = Column(String(20))

    # data = relationship("Data", back_populates="history")

# Data.history = relationship("HistoryData", order_by=HistoryData.timestamp, back_populates="data")

class DatabaseManager:
    def __init__(self, db_user, db_pass, db_name):
        self.db_user = db_user
        self.db_pass = db_pass
        self.db_name = db_name
        self.engine = create_engine(f'mysql+pymysql://{db_user}:{db_pass}@localhost/')
        self.Session = sessionmaker(bind=self.engine)
        self.User = User
        self.Data = Data
        self.HistoryData = HistoryData
        self.bcrypt = Bcrypt()


    def create_database(self):
        with pymysql.connect(user=self.db_user, password=self.db_pass) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.db_name}")
            conn.commit()


    def create_default_admin(self):
        with self.Session() as session:
            if not session.query(self.User).filter_by(username='admin').first():
                hashed_password = self.bcrypt.generate_password_hash('admin').decode('utf-8')
                admin = self.User(username='admin', password=hashed_password, role='admin')
                session.add(admin)
                session.commit()


    def initialize_database(self):
        self.create_database()
        # Update the engine to use the specific database
        self.engine = create_engine(f'mysql+pymysql://{self.db_user}:{self.db_pass}@localhost/{self.db_name}')
        Base.metadata.create_all(self.engine)
        # Re-create the session with the updated engine
        self.Session = sessionmaker(bind=self.engine)
        self.create_default_admin()
        

    def query_db(self, model, filter_col=None, filter_val=None, order=None, **kwargs):
        with self.Session() as session:
            query = session.query(model)
            if filter_col and filter_val:
                query = query.filter(getattr(model, filter_col).like(f"%{filter_val}%"))
            if kwargs:
                query = query.filter_by(**kwargs)
            if order == 'DESC':
                if model.timestamp:
                    query = query.order_by(desc(model.timestamp))
            return query.all()
        

    def add_user(self, username, password, role):
        with self.Session() as session:
            new_user = User(username=username, password=password, role=role)
            session.add(new_user)
            session.commit()


    def change_password(self, username, new_password):
        with self.Session() as session:
            user = session.query(User).filter_by(username=username).first()
            if user:
                user.password = new_password
                session.commit()


    def check_if_exists(self, model, **kwargs):
        with self.Session() as session:
            return session.query(model).filter_by(**kwargs).first() is not None


    def get_records_fifo(self):
        with self.Session() as session:
            # Subquery to get the latest timestamp for each data_id in HistoryData
            latest_history = session.query(
                HistoryData.sn,
                func.max(HistoryData.timestamp).label('max_timestamp')
            ).group_by(HistoryData.sn).subquery('latest_history')

            # Main query
            query = session.query(Data, HistoryData).\
                select_from(Data).\
                join(latest_history, Data.sn == latest_history.c.sn).\
                join(HistoryData, and_(
                    HistoryData.sn == latest_history.c.sn,
                    HistoryData.timestamp == latest_history.c.max_timestamp
                )).\
                filter(Data.id.isnot(None)).\
                filter(Data.id != '').\
                order_by(Data.date_created)

            return query.all()


    def write_to_db(self, uid, sn, pn, manufacturer, description, position, shelf, employee, timestamp):
        with self.Session() as session:
            new_data = Data(id=uid, sn=sn, pn=pn, manufacturer=manufacturer, description=description, date_created=timestamp, active_user='unassigned')
            new_history = HistoryData(
                data_id=uid, sn=sn, pn=pn, manufacturer=manufacturer, description=description,
                location="Received", next_location="Visual Inspection",
                position=position, shelf=shelf, comment="Received", result="N/A",
                employee=employee, timestamp=timestamp, date_created=timestamp
            )
            session.add(new_data)
            session.add(new_history)
            session.commit()


    def add_history(self, **kwargs):
        with self.Session() as session:
            new_history = HistoryData(**kwargs)
            session.add(new_history)
            session.commit()


    def update_col(self, model, identifier, identifier_val, **kwargs):
        with self.Session() as session:
            session.query(model).filter(getattr(model, identifier) == identifier_val).update(kwargs)
            session.commit()


    def remove_record(self, model, **kwargs):
        with self.Session() as session:
            session.query(model).filter_by(**kwargs).delete()
            session.commit()