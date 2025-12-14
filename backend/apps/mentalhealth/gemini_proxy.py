import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyCLX6UKmmZ3W5VBollXnAX9DH89l9QDVTc')
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

@csrf_exempt
@require_POST
def gemini_chat(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        if not user_message:
            return JsonResponse({'error': 'No message provided'}, status=400)

        payload = {
            "contents": [{
                "parts": [{
                    "text": f"You are a compassionate, supportive friend named 'Kind Friend' helping someone with their mental health concerns. Be empathetic, warm, and encouraging. Keep responses brief (2-3 sentences max), conversational, and supportive. Don't give medical advice - just be a caring listener. Add appropriate emojis occasionally. Never mention you are an AI. Respond naturally like a caring friend would.\n\nUser message: '{user_message}'"
                }]
            }],
            "generationConfig": {
                "temperature": 0.8,
                "maxOutputTokens": 200
            }
        }
        resp = requests.post(GEMINI_URL, json=payload, timeout=15)
        if resp.status_code != 200:
            return JsonResponse({'error': 'Gemini API error', 'status': resp.status_code, 'details': resp.text}, status=500)
        return JsonResponse(resp.json())
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
