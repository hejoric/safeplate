import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta

from database import init_db, get_db, JournalEntry, Settings, AlertSent
from ai_services import analyze_journal_with_gemini, generate_support_message

app = FastAPI(title="SafePlate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

# Log Gemini API key status on startup (does not expose the key)
key = os.getenv("GEMINI_API_KEY")
print(f"[SAFEPLATE] GEMINI_API_KEY: {'loaded' if key else 'MISSING - add to backend/.env'}")


# Pydantic models
class JournalAnalyzeRequest(BaseModel):
    meal: str = ""
    mood: int = 3
    energy: int = 3
    notes: str = ""


class JournalSaveRequest(BaseModel):
    meal: str = ""
    mood: int = 3
    energy: int = 3
    notes: str = ""
    riskData: dict | None = None


class TrustedContactRequest(BaseModel):
    first_name: str = ""
    email: str = ""
    name: str = ""
    alertsEnabled: bool = True


# Journal endpoints
@app.post("/api/journal/analyze")
async def analyze_journal(data: JournalAnalyzeRequest):
    combined_text = f"{data.meal} {data.notes}".strip()
    result = analyze_journal_with_gemini(combined_text)

    ai_available = result.get("ai_available", True)

    support_message = None
    if ai_available and result["riskLevel"] in ("concerning", "critical"):
        support_message = generate_support_message(combined_text, result["riskLevel"])

    return {
        "riskLevel": result["riskLevel"],
        "flags": result.get("detectedFlags", []),
        "explanation": result.get("explanation", ""),
        "supportMessage": support_message,
        "aiAvailable": ai_available,
    }


@app.post("/api/journal/save")
async def save_journal(data: JournalSaveRequest, db: Session = Depends(get_db)):
    risk = data.riskData or {}
    flags = risk.get("detectedFlags") or risk.get("flags") or []
    entry = JournalEntry(
        meal_description=data.meal or None,
        mood_rating=data.mood,
        energy_level=data.energy,
        personal_notes=data.notes or None,
        risk_level=risk.get("riskLevel", "safe"),
        detected_flags=str(flags),
        ai_explanation=risk.get("explanation"),
        support_message=risk.get("supportMessage"),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {
        "id": entry.id,
        "created_at": entry.created_at.isoformat(),
        **{k: getattr(entry, k) for k in ["meal_description", "mood_rating", "energy_level", "personal_notes", "risk_level"]}
    }


@app.get("/api/journal/entries")
async def get_entries(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    entries = db.query(JournalEntry).order_by(JournalEntry.created_at.desc()).offset(offset).limit(limit).all()
    return {
        "entries": [
            {
                "id": e.id,
                "meal_description": e.meal_description,
                "mood_rating": e.mood_rating,
                "energy_level": e.energy_level,
                "personal_notes": e.personal_notes,
                "risk_level": e.risk_level,
                "created_at": e.created_at.isoformat(),
            }
            for e in entries
        ]
    }


@app.get("/api/journal/patterns")
async def get_patterns(db: Session = Depends(get_db)):
    week_ago = datetime.utcnow() - timedelta(days=7)
    entries = db.query(JournalEntry).filter(JournalEntry.created_at >= week_ago).all()
    
    if not entries:
        return {
            "entriesLast7Days": 0,
            "avgMood": 0,
            "avgEnergy": 0,
            "flaggedCount": 0,
            "concerningPatterns": [],
            "shouldAlert": False,
        }
    
    mood_sum = sum(e.mood_rating for e in entries)
    energy_sum = sum(e.energy_level for e in entries)
    flagged = sum(1 for e in entries if e.risk_level in ("concerning", "critical"))
    critical_count = sum(1 for e in entries if e.risk_level == "critical")
    
    patterns = []
    if len(entries) < 3:
        patterns.append("Few entries this week - consider checking in more often")
    if mood_sum / len(entries) < 2.5:
        patterns.append("Mood trending downward")
    if flagged >= 2:
        patterns.append("Multiple entries flagged this week")
    if critical_count >= 1:
        patterns.append("Critical content detected this week")
    
    should_alert = len(patterns) > 0
    
    return {
        "entriesLast7Days": len(entries),
        "avgMood": round(mood_sum / len(entries), 1),
        "avgEnergy": round(energy_sum / len(entries), 1),
        "flaggedCount": flagged,
        "concerningPatterns": patterns,
        "shouldAlert": should_alert,
    }


# Settings endpoints
@app.get("/api/settings")
async def get_settings(db: Session = Depends(get_db)):
    s = db.query(Settings).filter(Settings.user_id == "demo_user").first()
    if not s:
        return {}
    return {
        "first_name": s.first_name,
        "trusted_contact_email": s.trusted_contact_email,
        "trusted_contact_name": s.trusted_contact_name,
        "alerts_enabled": s.alerts_enabled,
    }


@app.post("/api/settings/trusted-contact")
async def save_trusted_contact(data: TrustedContactRequest, db: Session = Depends(get_db)):
    s = db.query(Settings).filter(Settings.user_id == "demo_user").first()
    if not s:
        s = Settings(user_id="demo_user")
        db.add(s)
    s.first_name = data.first_name
    s.trusted_contact_email = data.email
    s.trusted_contact_name = data.name
    s.alerts_enabled = data.alertsEnabled
    db.commit()
    return {"ok": True}


# Alerts endpoint (simplified - logs only, email requires SMTP config)
@app.post("/api/alerts/send")
async def send_alert(db: Session = Depends(get_db)):
    s = db.query(Settings).filter(Settings.user_id == "demo_user").first()
    if not s or not s.alerts_enabled or not s.trusted_contact_email:
        return {"sent": False, "reason": "No trusted contact configured"}
    
    alert = AlertSent(user_id="demo_user", trigger_reason="pattern_detection")
    db.add(alert)
    db.commit()
    
    # TODO: Integrate SendGrid/SMTP for actual email
    return {"sent": True, "timestamp": datetime.utcnow().isoformat()}


# Data endpoints
@app.get("/api/data/export")
async def export_data(db: Session = Depends(get_db)):
    entries = db.query(JournalEntry).order_by(JournalEntry.created_at.desc()).all()
    s = db.query(Settings).filter(Settings.user_id == "demo_user").first()
    return {
        "journal_entries": [
            {
                "meal_description": e.meal_description,
                "mood_rating": e.mood_rating,
                "energy_level": e.energy_level,
                "personal_notes": e.personal_notes,
                "created_at": e.created_at.isoformat(),
            }
            for e in entries
        ],
        "settings": {
            "first_name": s.first_name if s else None,
            "trusted_contact_name": s.trusted_contact_name if s else None,
        } if s else {},
    }


@app.delete("/api/data/delete")
async def delete_data(db: Session = Depends(get_db)):
    db.query(JournalEntry).delete()
    db.query(Settings).delete()
    db.query(AlertSent).delete()
    db.commit()
    return {"ok": True}


@app.get("/")
async def root():
    return {"message": "SafePlate API", "status": "ok"}
