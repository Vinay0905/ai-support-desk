from langchain_groq import ChatGroq 
import os 
from dotenv import load_dotenv 
load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    groq_api_key=os.getenv("GROQ_API_KEY")
)
def generate_summary(conversation_text: str) -> str:
    """Generates a 1-sentence executive summary of the conversation."""
    prompt = f"""
    Analyze the following conversation between a student and an AI assistant.
    Provide a concise, 1-sentence executive summary of the core complaint or query.
    Focus on: What is the issue? Where is it? Who is involved?
    
    Conversation:
    {conversation_text}
    
    Summary:"""
    
    response = llm.invoke(prompt)
    return response.content.strip()
def analyze_sentiment(conversation_text: str) -> str:
    """Analyzes the emotional tone and urgency of the student."""
    prompt = f"""
    Analyze the emotional tone and urgency of the student in this conversation.
    Classify it into exactly one of these labels: 'Urgent', 'Moderate', 'Low'.
    - 'Urgent': High frustration, critical system failure, or physical safety issues.
    - 'Moderate': Clear concern, but student is polite or the issue is non-critical.
    - 'Low': Simple query or very calm tone.
    
    Conversation:
    {conversation_text}
    
    Classification:"""
    
    response = llm.invoke(prompt)
    # Extract just the label
    content = response.content.strip().title()
    if 'Urgent' in content: return 'Urgent'
    if 'Moderate' in content: return 'Moderate'
    return 'Low'