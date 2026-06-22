from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import json

# Initialize FastAPI
app = FastAPI()

# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini (Replace with your actual key or use env variables)
os.environ["GEMINI_API_KEY"] = "AQ.Ab8RN6KwTz9z6iZF4J-eF9IR8u1l8reIpYrMlk70XqtaTRm18Q"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

class SymptomRequest(BaseModel):
    description: str

@app.post("/api/analyze-symptoms")
async def analyze_symptoms(request: SymptomRequest):
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # We force the AI to return a specific JSON structure
        prompt = f"""
        You are an expert AI emergency medical assistant. 
        Analyze these symptoms: "{request.description}"
        
        Respond STRICTLY in the following JSON format. Do not add markdown formatting or extra text.
        {{
            "severity_level": "Critical" | "High" | "Moderate" | "Low",
            "suspected_condition": "Short string describing possible issue",
            "first_aid_steps": ["Step 1", "Step 2", "Step 3"]
        }}
        """
        
        response = model.generate_content(prompt)
        
        # Clean the response in case Gemini adds markdown code blocks
        clean_json = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_json)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))