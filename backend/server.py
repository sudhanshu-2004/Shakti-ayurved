from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Consultation Form Models
class ConsultationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)

class ConsultationResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    phone: str
    created_at: str
    status: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Ayurved Life API - Pure Ayurveda. Powerful Results."}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Consultation endpoints
@api_router.post("/consultation", response_model=ConsultationResponse)
async def create_consultation(input: ConsultationCreate):
    """Create a new consultation request"""
    consultation_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "id": consultation_id,
        "name": input.name,
        "phone": input.phone,
        "created_at": created_at,
        "status": "pending"
    }
    
    await db.consultations.insert_one(doc)
    
    return ConsultationResponse(
        id=consultation_id,
        name=input.name,
        phone=input.phone,
        created_at=created_at,
        status="pending"
    )


@api_router.get("/consultations", response_model=List[ConsultationResponse])
async def get_consultations():
    """Get all consultation requests"""
    consultations = await db.consultations.find({}, {"_id": 0}).to_list(1000)
    return consultations


# Products endpoint (static data)
@api_router.get("/products")
async def get_products():
    """Get all Ayurved Life products"""
    products = [
        {
            "id": 1,
            "name": "Pathri Mukti",
            "nameHindi": "पथरी मुक्ति",
            "benefits": [
                "पथरी को घोलकर बाहर निकाले",
                "दर्द और जलन में आराम दे",
                "किडनी की सेहत का ख्याल रखे",
            ],
            "price": 4999,
            "image": "/images/PATHRI MUKTI.jpg",
            "description": "100% आयुर्वेदिक फॉर्मूला - पथरी की समस्या से छुटकारा",
        },
        {
            "id": 2,
            "name": "Hair Growth",
            "nameHindi": "हेयर ग्रोथ",
            "benefits": [
                "Reduces Hair Fall",
                "Strengthens Hair Roots",
                "Promotes Hair Regrowth",
            ],
            "price": 4999,
            "image": "/images/HAIR GROWTH.jpg",
            "description": "100% Herbal - Ayurvedic Formula for healthy hair",
        },
        {
            "id": 3,
            "name": "BP Mukti",
            "nameHindi": "बीपी मुक्ति",
            "benefits": [
                "Supports Healthy Blood Pressure",
                "Reduces Stress & Anxiety",
                "Improves Heart Health",
            ],
            "price": 4999,
            "image": "/images/BP MUKTI.jpg",
            "description": "Veggie Capsules - Supports healthy blood pressure levels",
        },
        {
            "id": 4,
            "name": "Sugar Control",
            "nameHindi": "शुगर कंट्रोल",
            "benefits": [
                "Supports Healthy Blood Sugar",
                "Improves Energy Levels",
                "Reduces Sugar Cravings",
            ],
            "price": 4999,
            "original_price": 7999,
            "image": "/images/SUGAR CONTROL.jpg",
            "description": "60 Vegetarian Capsules - Natural sugar management",
        },
        {
            "id": 5,
            "name": "Liver Care",
            "nameHindi": "लिवर केयर",
            "benefits": [
                "Supports Liver Health",
                "Detoxification Support",
                "Improves Digestion",
            ],
            "price": 3999,
            "image": "/images/LIVER CARE.jpg",
            "description": "60 Vegetarian Capsules - Complete liver care",
        },
        {
            "id": 6,
            "name": "Weight Loss",
            "nameHindi": "वेट लॉस",
            "benefits": [
                "Boosts Metabolism",
                "Suppresses Appetite",
                "Burns Fat Naturally",
            ],
            "price": 6999,
            "image": "/images/WEIGHT LOSS.jpg",
            "description": "100% Herbal - Promotes healthy weight naturally",
        },
        {
            "id": 7,
            "name": "Joint Pain",
            "nameHindi": "जोड़ों का दर्द",
            "benefits": [
                "Reduces Joint Pain",
                "Supports Joint Flexibility",
                "Soothes Inflammation",
            ],
            "price": 2999,
            "image": "/images/Joint Pain.jpg",
            "description": "100% Herbal - Natural joint care formula",
        },
        {
            "id": 8,
            "name": "Digestive Care",
            "nameHindi": "डाइजेस्टिव केयर",
            "benefits": [
                "Supports Healthy Digestion",
                "Relieves Gas & Bloating",
                "Improves Gut Health",
            ],
            "price": 3599,
            "image": "/images/Digestive Care.jpg",
            "description": "100% Herbal - Complete digestive wellness",
        },
        {
            "id": 9,
            "name": "Skin Glow",
            "nameHindi": "स्किन ग्लो",
            "benefits": [
                "Improves Skin Clarity",
                "Promotes Natural Glow",
                "Reduces Acne & Pimples",
            ],
            "price": 4599,
            "image": "/images/Skin Glow.jpg",
            "description": "100% Herbal - Beauty from within",
        },
        {
            "id": 10,
            "name": "Immunity Booster",
            "nameHindi": "इम्यूनिटी बूस्टर",
            "benefits": [
                "Strengthens Immune Defense",
                "Protects Against Infections",
                "Improves Stamina",
            ],
            "price": 4999,
            "image": "/images/Immunity Booster.jpg",
            "description": "100% Herbal - Daily immunity support with powerful herbs",
        },
    ]

    # Ensure every product has an `original_price`.
    # We'll add 2000 for odd ids and 3000 for even ids to represent the pre-discount price.
    for p in products:
        if "original_price" not in p:
            delta = 2000 if p.get("id", 0) % 2 == 1 else 3000
            p["original_price"] = p["price"] + delta

    return products


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)