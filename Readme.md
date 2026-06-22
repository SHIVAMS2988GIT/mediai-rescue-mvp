# MediAI Rescue - Technical Documentation & MVP

**Team Name:** MediAI Innovators  
**Event:** Bharat Academix CodeQuest 2026 - Round 2 (Prototype Development)

## 📌 Project Overview
MediAI Rescue is an AI-powered emergency medical assistant designed to bridge the critical time gap between the onset of a medical emergency and the arrival of professional help. This Minimum Viable Product (MVP) demonstrates the core "Golden Path": symptom analysis, risk prediction, first-aid protocol generation, and location-based hospital routing.

## 🏗️ System Architecture
The MVP follows a decoupled client-server architecture to ensure high performance and scalability:
1. **Client Interface (Next.js):** Captures user symptoms and browser geolocation.
2. **REST API Engine (FastAPI):** Acts as the orchestrator, receiving client payloads and structuring LLM prompts.
3. **Medical Knowledge Engine (Gemini 2.5 Flash):** Processes symptoms through structured prompt engineering to guarantee consistent JSON outputs.
4. **Routing Module (Geolocation API + Google Maps):** Dynamically constructs routing URLs based on raw lat/lng coordinates.

## 🛠️ Technology Stack
* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** FastAPI, Python, Pydantic
* **AI Integration:** Google Gemini Generative AI API
* **Location Services:** HTML5 Geolocation API, Google Maps URL Scheme

---

## 🚀 Local Setup & Installation

### Prerequisites
* Python 3.9+
* Node.js 18+
* Google Gemini API Key

### 1. Backend Setup (FastAPI Engine)
Navigate to the backend directory and start the server:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn google-generativeai pydantic

# Add your Gemini API key in main.py
uvicorn main:app --reload