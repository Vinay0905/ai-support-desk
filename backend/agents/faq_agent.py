import os 
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from database import get_db_connection
from dotenv import load_dotenv

load_dotenv()

def answer_query(user_query:str):
    # 1. Fetch FAQs from Database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT question, answer FROM faqs")
    faqs = cursor.fetchall()
    cursor.close()
    conn.close()
    # 2. Prepare Context for AI
    context = "\n".join([f"Q: {f['question']} A: {f['answer']}" for f in faqs])

    # 3. Ask AI
    llm = ChatGroq(
        temperature=0, 
        model_name="llama-3.3-70b-versatile", 
        groq_api_key=os.getenv("GROQ_API_KEY")
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"You are a helpful college assistant. Answer the student's query using only the provided FAQ context. If the answer isn't in the context, say 'I'm sorry, I don't have information on that. Please contact the office.'\n\nContext:\n{context}"),
        ("user", "{query}")
    ])
    chain = prompt | llm
    response = chain.invoke({"query": user_query})
    return response.content