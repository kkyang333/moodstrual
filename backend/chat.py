from google import genai
from backend.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def stream_gemini(prompt: str):
    """
    Streams Gemini response chunk by chunk.
    """
    try:
        stream = client.models.generate_content_stream(
            model="gemini-2.5-flash",   # ✅ fast streaming model
            contents=prompt,
        )
        for event in stream:
            if event.candidates and event.candidates[0].content.parts:
                part = event.candidates[0].content.parts[0]
                if part and part.text:
                    yield part.text + "\n"  # newline helps flush to frontend
    except Exception as e:
        print("Gemini API stream error:", e)
        yield f"⚠️ Error from Gemini API: {str(e)}"
