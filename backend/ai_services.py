import os
import json

# Gemini integration
def analyze_journal_with_gemini(text: str) -> dict:
    """Use Gemini 2.0 Flash to analyze journal for ED red flags."""
    try:
        import google.generativeai as genai
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",  # Stable model - use gemini-2.0-flash if preferred
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            }
        )
        
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
{{
  "riskLevel": "safe" | "concerning" | "critical",
  "detectedFlags": ["array of specific concerning phrases"],
  "explanation": "One sentence explaining the assessment"
}}

Risk level definitions:
- safe: No red flags detected, supportive of recovery
- concerning: Contains mild red flags, negative patterns, or concerning language
- critical: Contains explicit pro-ED content, purging mentions, or severe restriction

Be sensitive but err on the side of caution. It's better to flag something borderline than miss a genuine risk."""

        response = model.generate_content(prompt)
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"[SAFEPLATE] Gemini analyze error: {e}")
        return {
            "riskLevel": "safe",
            "detectedFlags": [],
            "explanation": "Analysis unavailable - entry saved without AI check."
        }


def generate_support_message(flagged_content: str, risk_level: str) -> str:
    """Use Gemini to generate compassionate support response."""
    fallback_messages = {
        "concerning": "We noticed some difficult thoughts. You deserve care and support. Recovery isn't linear, and you're not alone. Would you like to connect with resources?",
        "critical": "We're here for you. What you're going through is hard, and you don't have to face it alone. Please reach out to someone who can help - the resources on our Resources page are available 24/7."
    }
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"temperature": 0.7}
        )
        
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

        response = model.generate_content(prompt)
        if response.text:
            return response.text.strip()
    except Exception as e:
        print(f"Gemini support message error: {e}")
    
    return fallback_messages.get(risk_level, fallback_messages["concerning"])
