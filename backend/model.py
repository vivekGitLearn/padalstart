

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from datetime import datetime
from database import Base, engine


class Status(Base):
    __tablename__ = 'status'
    id = Column(Integer, primary_key=True, index=True)
    done_task = Column(Boolean, default=False)


class TodoList(Base):
    __tablename__ = 'todo_list'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    deadline = Column(DateTime)
    status_id = Column(Integer, ForeignKey('status.id'))

    status = relationship("Status")


# Create the tables in the database
# Base.metadata.create_all(bind=engine)
