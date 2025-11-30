from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, chat
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Data Analysis SaaS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Data Analysis SaaS API"}
