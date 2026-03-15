import random
from fastapi import APIRouter
from prompts import DOCTOR_QUOTES

router = APIRouter()

@router.get("/api/quote")
async def quote():
    q = random.choice(DOCTOR_QUOTES)
    return {"quote": q["quote"], "doctor": q["doctor"]}
