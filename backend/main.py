from fastapi import FastAPI

app = FastAPI(
    title="Prepzo API",
    description="Deadline-Aware Exam Preparation Engine MVP",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Prepzo API"}
