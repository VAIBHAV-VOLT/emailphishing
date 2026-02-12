from flask import Flask, request, jsonify
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.environ.get("API_KEY")
if not api_key:
    raise ValueError("API_KEY not found in environment variables. Please check your .env file.")

# Initialize the client with API key
client = genai.Client(api_key=api_key)



def analyze(data):
    ip = data.get('ips','')
    original = data.get('originating_ip','')



    model = "gemini-2.0-flash"
    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=f"Please tell me if the following ip address is related to phishing through emails.\nip:\n{original}\n\nAnswer only in yes or no in lower case")]), 
        ]

    generate_content_config = types.GenerateContentConfig()


    response_text = ""
    try:
        for chunk in client.models.generate_content_stream(
            model=model, contents=contents, config=generate_content_config
        ):
            response_text += chunk.text
    except Exception as e:
        return {"error": str(e)}
    
    if(response_text.lower()=='yes'):
        res = True
    else:
        res = False

    return {
        "originating_ip": original,
        'phishing': res
    }
