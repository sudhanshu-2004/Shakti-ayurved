from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
import requests as http_requests
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

load_dotenv()

# CRM webhook config (fires lead creation in CRM as a safety fallback)
CRM_WEBHOOK_URL    = os.environ.get('CRM_WEBHOOK_URL', '/crm-api/webhook')
CRM_WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET', '')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fire_crm_webhook(path: str, payload: dict):
    """Fire-and-forget POST to CRM webhook — never blocks response."""
    if not CRM_WEBHOOK_SECRET or CRM_WEBHOOK_SECRET == 'change_this_webhook_secret':
        logger.debug('[crm-webhook] WEBHOOK_SECRET not set — skipping')
        return
    try:
        host = os.environ.get('VERCEL_URL', 'localhost:3000')
        base = f'https://{host}/crm-api'
        resp = http_requests.post(
            f'{base}/{path}',
            json=payload,
            headers={'X-Webhook-Secret': CRM_WEBHOOK_SECRET},
            timeout=5,
        )
        logger.info(f'[crm-webhook] POST /{path} → {resp.status_code}')
    except Exception as exc:
        logger.warning(f'[crm-webhook] Failed: {exc}')

app = FastAPI(title="Shakti Ayurved API")
api_router = APIRouter(prefix="/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ────────────────────────────────────────────────────────────────────
class StatusCheckCreate(BaseModel):
    client_name: str

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

# ── Routes ────────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Ayurved Life API - Pure Ayurveda. Powerful Results."}

@api_router.post("/consultation", response_model=ConsultationResponse)
async def create_consultation(input: ConsultationCreate, background_tasks: BackgroundTasks):
    """Create a new consultation request"""
    consultation_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    # Note: MongoDB removed for Vercel serverless compatibility.
    # Supabase trigger (002_website_integration.sql) handles DB write via the frontend.

    # Fallback webhook to CRM
    background_tasks.add_task(
        fire_crm_webhook,
        'consultation',
        {'name': input.name, 'phone': input.phone},
    )

    return ConsultationResponse(
        id=consultation_id,
        name=input.name,
        phone=input.phone,
        created_at=created_at,
        status="pending"
    )

@api_router.get("/products")
async def get_products():
    """Get all Ayurved Life products"""
    products = [
        {"id": 1, "name": "Pathri Mukti", "nameHindi": "पथरी मुक्ति",
         "benefits": ["पथरी को घोलकर बाहर निकाले", "दर्द और जलन में आराम दे", "किडनी की सेहत का ख्याल रखे"],
         "price": 4999, "image": "/images/PATHRI MUKTI.jpg", "description": "100% आयुर्वेदिक फॉर्मूला"},
        {"id": 2, "name": "Hair Growth", "nameHindi": "हेयर ग्रोथ",
         "benefits": ["Reduces Hair Fall", "Strengthens Hair Roots", "Promotes Hair Regrowth"],
         "price": 4999, "image": "/images/HAIR GROWTH.jpg", "description": "100% Herbal"},
        {"id": 3, "name": "BP Mukti", "nameHindi": "बीपी मुक्ति",
         "benefits": ["Supports Healthy Blood Pressure", "Reduces Stress & Anxiety", "Improves Heart Health"],
         "price": 4999, "image": "/images/BP MUKTI.jpg", "description": "Veggie Capsules"},
        {"id": 4, "name": "Sugar Control", "nameHindi": "शुगर कंट्रोल",
         "benefits": ["Supports Healthy Blood Sugar", "Improves Energy Levels", "Reduces Sugar Cravings"],
         "price": 4999, "original_price": 7999, "image": "/images/SUGAR CONTROL.jpg", "description": "60 Vegetarian Capsules"},
        {"id": 5, "name": "Liver Care", "nameHindi": "लिवर केयर",
         "benefits": ["Supports Liver Health", "Detoxification Support", "Improves Digestion"],
         "price": 3999, "image": "/images/LIVER CARE.jpg", "description": "60 Vegetarian Capsules"},
        {"id": 6, "name": "Weight Loss", "nameHindi": "वेट लॉस",
         "benefits": ["Boosts Metabolism", "Suppresses Appetite", "Burns Fat Naturally"],
         "price": 6999, "image": "/images/WEIGHT LOSS.jpg", "description": "100% Herbal"},
        {"id": 7, "name": "Joint Pain", "nameHindi": "जोड़ों का दर्द",
         "benefits": ["Reduces Joint Pain", "Supports Joint Flexibility", "Soothes Inflammation"],
         "price": 2999, "image": "/images/Joint Pain.jpg", "description": "100% Herbal"},
        {"id": 8, "name": "Digestive Care", "nameHindi": "डाइजेस्टिव केयर",
         "benefits": ["Supports Healthy Digestion", "Relieves Gas & Bloating", "Improves Gut Health"],
         "price": 3599, "image": "/images/Digestive Care.jpg", "description": "100% Herbal"},
        {"id": 9, "name": "Skin Glow", "nameHindi": "स्किन ग्लो",
         "benefits": ["Improves Skin Clarity", "Promotes Natural Glow", "Reduces Acne & Pimples"],
         "price": 4599, "image": "/images/Skin Glow.jpg", "description": "100% Herbal"},
        {"id": 10, "name": "Immunity Booster", "nameHindi": "इम्यूनिटी बूस्टर",
         "benefits": ["Strengthens Immune Defense", "Protects Against Infections", "Improves Stamina"],
         "price": 4999, "image": "/images/Immunity Booster.jpg", "description": "100% Herbal"},
    ]
    for p in products:
        if "original_price" not in p:
            delta = 2000 if p.get("id", 0) % 2 == 1 else 3000
            p["original_price"] = p["price"] + delta
    return products

app.include_router(api_router)
