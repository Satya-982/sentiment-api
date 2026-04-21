from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

app = FastAPI()

# Fix: Add CORS middleware so React frontend can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use specific origin in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = pipeline("sentiment-analysis")

@app.get("/")
def home():
    return {"message": "Sentiment API running"}

@app.get("/analyze")
def analyze(text: str):
    if not text.strip():
        return {"error": "Text cannot be empty"}
    result = classifier(text)
    return {"text": text, "result": result}