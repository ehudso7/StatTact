# backend/main.py
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
import openai

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
football_api_key = os.getenv("FOOTBALL_API_KEY")

# Initialize FastAPI app
app = FastAPI(
    title="StatTact AI API",
    description="Advanced tactical analysis for football teams",
    version="1.0.0"
)

# Allow CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-production-domain.com"],  # More secure than "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for POST endpoint
class TacticsRequest(BaseModel):
    team: str
    opponent: Optional[str] = None

# Root Route
@app.get("/")
async def root():
    return {"message": "Welcome to the StatTact AI Backend!", "status": "operational"}

# POST endpoint for generating tactics
@app.post("/generate-tactics/")
async def generate_tactics_post(request: TacticsRequest):
    try:
        # Generate tactics using the helper function
        result = await generate_tactics(request.team, request.opponent)
        return {"result": result}
    except Exception as e:
        # Maintain the original error handling approach
        raise HTTPException(status_code=500, detail=str(e))

# GET endpoint to match the frontend axios.get request
@app.get("/generate-formation")
async def generate_formation(
    team: str = Query(..., description="Team name"), 
    opponent: Optional[str] = Query(None, description="Opponent team name")
):
    try:
        # If you have a football API, you could fetch real team data here
        if football_api_key:
            # Example of how you might fetch real team data
            team_data = get_team_data(team)
            opponent_data = get_team_data(opponent) if opponent else None
            # You could use this data to enhance the prompt
        
        # Generate tactics using the helper function
        result = await generate_tactics(team, opponent)
        return {"result": result}
    except Exception as e:
        # Maintain the original error handling approach
        raise HTTPException(status_code=500, detail=str(e))

async def generate_tactics(team: str, opponent: str = None):
    """Helper function to generate tactical analysis using OpenAI"""
    # Craft a prompt that instructs the AI to generate soccer formation tactics
    prompt = f"""
    Create a detailed tactical analysis for {team} {"against " + opponent if opponent else ""}.
    
    Include the following sections:
    1. Formation Recommendation (4-3-3, 4-2-3-1, etc.)
    2. Strategic Approach (defensive/offensive balance, pressing strategy)
    3. Key Tactical Considerations (opponent weaknesses to exploit)
    4. Player Roles and Responsibilities 
    5. Set-Piece Strategy
    6. In-Game Adaptability
    
    Format the response with section headers using ** for bold text.
    """
    
    response = openai.chat.completions.create(
        model="gpt-4o",  # Using the newer model
        messages=[
            {"role": "system", "content": "You are an expert football tactics analyst."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
        temperature=0.7
    )
    
    return response.choices[0].message.content

def get_team_data(team_name: str):
    """Fetch real team data from a football API"""
    if not team_name or not football_api_key:
        return None
        
    # This is a placeholder. You'd implement this based on your football API
    url = f"https://api.football-data.org/v4/teams"
    headers = {"X-Auth-Token": football_api_key}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            # Process and find the relevant team
            return data
        else:
            print(f"API error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching team data: {str(e)}")
        return None

# Run the app if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
