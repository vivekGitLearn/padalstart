from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from database import SessionLocal, engine
from model import Base, TodoList, Status
from typing import List

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]
# origins = [
#     "http://localhost",
#     "http://localhost:8080",
#     "http://localhost:3000",
#     "https://padalstart.vercel.app",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main():
    return {"message": "Todo"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class StatusCreate(BaseModel):
    done_task: bool

    class Config:
        arbitrary_types_allowed = True


class StatusResponse(BaseModel):
    id: int
    done_task: bool

    class Config:
        from_attributes = True


class StatusUpdateRequest(BaseModel):
    done_task: bool


class TodoListCreate(BaseModel):
    title: str
    description: str
    deadline: datetime


class TodoListResponse(BaseModel):
    id: int
    title: str
    description: str
    deadline: datetime
    status: StatusResponse

    class Config:
        from_attributes = True


class TodoListUpdate(BaseModel):
    title: str
    description: str
    deadline: datetime
    status_id: int


@app.post("/todo_list/", response_model=TodoListResponse)
def create_todo_list(todo: TodoListCreate, db: Session = Depends(get_db)):
    # Create a new status with done_task set to False
    db_status = Status(done_task=False)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)

    db_todo = TodoList(
        title=todo.title,
        description=todo.description,
        deadline=todo.deadline,
        status_id=db_status.id
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.get("/todo_list/", response_model=List[TodoListResponse])
def read_todo_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    todos = db.query(TodoList).offset(skip).limit(limit).all()
    return todos


@app.get("/todo_list/{todo_id}", response_model=TodoListResponse)
def read_todo_list_by_id(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(TodoList).filter(TodoList.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todo_list/{todo_id}", response_model=TodoListResponse)
def update_todo_list(todo_id: int, todo: TodoListUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(TodoList).filter(TodoList.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.title = todo.title
    db_todo.description = todo.description
    db_todo.deadline = todo.deadline
    # db_todo.status_id = todo.status_id
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.put("/status_update/{todo_id}", response_model=StatusResponse)
def update_status(todo_id: int, status_update: bool, db: Session = Depends(get_db)):
    db_status = db.query(Status).filter(Status.id == todo_id).first()
    if db_status is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_status.done_task = status_update
    db.commit()
    db.refresh(db_status)
    return db_status


@app.delete("/todo_list/{todo_id}", response_model=TodoListResponse)
def delete_todo_list(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoList).filter(TodoList.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return db_todo


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
