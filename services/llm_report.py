import google.generativeai as genai
import os

def chat_with_data(message: str, context: dict):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API Key not configured."
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash-lite')
    
    # Construct prompt with context
    prompt = f"""
    You are a data analysis assistant. Here is the context of the data:
    {context}
    
    User Question: {message}
    
    Answer:
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating response: {str(e)}"
