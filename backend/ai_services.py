import os
import json
import time

# ---------------------------------------------------------------------------
# Gemini client  – initialised once at module level
# Uses the NEW google-genai SDK (the old google-generativeai is deprecated)
# ---------------------------------------------------------------------------
from google import genai
from google.genai import types

_api_key = os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_api_key) if _api_key else None

MODEL = "gemini-2.0-flash"
MAX_RETRIES = 2
RETRY_DELAY = 6  # seconds – Gemini 429 responses suggest ~5-6s


def _call_gemini(prompt: str, *, temperature: float = 0.3, json_output: bool = False) -> str | None:
    """Low-level wrapper: call Gemini with retries for transient 429 errors.

    Returns the response text on success, or None on failure.
    """
    if _client is None:
        print("[SAFEPLATE] ERROR: GEMINI_API_KEY not set – skipping AI call")
        return None

    config = {"temperature": temperature}
    if json_output:
        config["response_mime_type"] = "application/json"

    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = _client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=config,
            )
            return response.text
        except Exception as e:
            last_err = e
            err_str = str(e)
            print(f"[SAFEPLATE] Gemini attempt {attempt}/{MAX_RETRIES} error: {err_str}")

            # Retry only on rate-limit (429) errors
            if "429" in err_str or "quota" in err_str.lower():
                if attempt < MAX_RETRIES:
                    print(f"[SAFEPLATE] Rate limited – retrying in {RETRY_DELAY}s …")
                    time.sleep(RETRY_DELAY)
                    continue
            # Non-retryable error – bail immediately
            break

    print(f"[SAFEPLATE] Gemini call failed after {MAX_RETRIES} attempts: {last_err}")
    return None


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def analyze_journal_with_gemini(text: str) -> dict:
    """Analyse journal text for ED red flags via Gemini.

    Returns a dict with keys: riskLevel, detectedFlags, explanation, ai_available.
    ai_available=False means the AI could not run (quota / config / network).
    """
    prompt = f"""You are a mental health safety analyzer for an eating disorder recovery app.

Analyze this journal entry for eating disorder red flags:

Entry Text:
{text or "(empty)"}

Detect these specific concerns:
- Pro-ED terminology: thinspo, meanspo, SW (starting weight), UGW (ultimate goal weight), CW (current weight), GW (goal weight), pro-mia, body check, etc.
- Purging behaviors: mentions of vomiting, laxatives, diuretics, "getting rid of food"
- Extreme restriction: calorie counts below 800/day, fasting, liquid diets
- Self-harm language: "I hate my body", "disgusting", extreme negative self-talk
- Competitive language: comparing to others, "thinner than", weight loss competitions

Return ONLY valid JSON in this exact format:
{{"riskLevel": "safe | concerning | critical", "detectedFlags": ["array of specific concerning phrases"], "explanation": "One sentence explaining the assessment"}}

Risk level definitions:
- safe: No red flags detected, supportive of recovery
- concerning: Contains mild red flags, negative patterns, or concerning language
- critical: Contains explicit pro-ED content, purging mentions, or severe restriction

Be sensitive but err on the side of caution. It's better to flag something borderline than miss a genuine risk."""

    raw = _call_gemini(prompt, temperature=0.3, json_output=True)

    if raw is None:
        return {
            "riskLevel": "unknown",
            "detectedFlags": [],
            "explanation": "AI analysis unavailable – entry saved without AI check.",
            "ai_available": False,
        }

    try:
        result = json.loads(raw)
        result["ai_available"] = True
        return result
    except json.JSONDecodeError as e:
        print(f"[SAFEPLATE] Gemini returned invalid JSON: {e}\nRaw: {raw[:500]}")
        return {
            "riskLevel": "unknown",
            "detectedFlags": [],
            "explanation": "AI returned unparseable response – entry saved without AI check.",
            "ai_available": False,
        }


def generate_support_message(flagged_content: str, risk_level: str) -> str:
    """Generate a compassionate support message via Gemini (with fallback)."""
    fallback_messages = {
        "concerning": (
            "We noticed some difficult thoughts. You deserve care and support. "
            "Recovery isn't linear, and you're not alone. "
            "Would you like to connect with resources?"
        ),
        "critical": (
            "We're here for you. What you're going through is hard, and you don't "
            "have to face it alone. Please reach out to someone who can help – "
            "the resources on our Resources page are available 24/7."
        ),
    }

    prompt = f"""Generate a brief, supportive message for someone in eating disorder recovery.
Context: Their journal entry was flagged as {risk_level} because it contained concerning content.
Requirements:
- Keep under 50 words
- Warm, non-judgmental tone
- Acknowledge their struggle
- Offer hope and remind them resources are available
- DO NOT lecture or shame
- DO NOT mention specific behaviors they should change
Return only the message text, no preamble."""

    raw = _call_gemini(prompt, temperature=0.7, json_output=False)
    if raw:
        return raw.strip()

    return fallback_messages.get(risk_level, fallback_messages["concerning"])
