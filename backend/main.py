from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agents.categorizer import categorize_complaint
from agents.faq_agent import answer_query
from database import get_db_connection
from agents.conversation import chat_agent
from langchain_core.messages import HumanMessage,AIMessage
from agents.insight_agent import generate_summary, analyze_sentiment

import json
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class LoginRequest(BaseModel):
    username: str
    password: str

class ComplaintRequest(BaseModel):
    
    student_id: int
    description: str


class QueryRequest(BaseModel):
    query: str

class ChatRequest(BaseModel):
    student_id: int
    messages: list[dict] # [{"role": "user", "content": "hi"}]
    mode: str

class ResponseRequest(BaseModel):
    complaint_id: int
    faculty_response: str

@app.post("/login")
def login(request: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username, role FROM users WHERE username = %s AND password = %s", (request.username, request.password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user: return {"status": "success", "user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials")
@app.post("/submit-complaint")
def submit_complaint(request: ComplaintRequest):
    # 1. AI Categorization
    category = categorize_complaint(request.description)
    
    # 2. Save to DB
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO complaints (student_id, description, category) VALUES (%s, %s, %s)",
        (request.student_id, request.description, category)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"status": "success", "category": category}
@app.post("/ask-query")
def ask_query(request: QueryRequest):
    answer = answer_query(request.query)
    return {"answer": answer}




@app.get("/get-complaints")
def get_complaints():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    # Join with users to see who submitted what
    query = """
        SELECT c.id, u.username, c.description, c.category, c.status, c.created_at, c.conversation_log 
        FROM complaints c 
        JOIN users u ON c.student_id = u.id
        ORDER BY c.created_at DESC
    """
    cursor.execute(query)
    complaints = cursor.fetchall()
    cursor.close()
    conn.close()
    return complaints


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    # Convert dict messages to LangChain objects
    history = []
    for m in request.messages:
        if m["role"] == "user": history.append(HumanMessage(content=m["content"]))
        else: history.append(AIMessage(content=m["content"]))
    
    # Run Agent
    inputs = {"messages": history, "mode": request.mode, "student_id": request.student_id}
    result = chat_agent.invoke(inputs)
    
    ai_message = result["messages"][-1].content
    
    # If the AI finished the interview, save to DB
        # If the AI finished the interview, save to DB
    if "THANK_YOU_REPORT_FILED" in ai_message:
        # Extract the full conversation as the final description
        full_desc = "\n".join([m.content for m in history if isinstance(m, HumanMessage)])
        from agents.categorizer import categorize_complaint
        category = categorize_complaint(full_desc)
        
        # 1. Prepare data for the Summary/Sentiment AI
        log_data = []
        full_transcript = ""
        for m in request.messages:
            log_data.append({"role": m["role"], "content": m["content"]})
            full_transcript += f"{m['role']}: {m['content']}\n"
        
        log_data.append({"role": "assistant", "content": ai_message})
        full_transcript += f"assistant: {ai_message}\n"
        logs_json = json.dumps(log_data)

        # 2. RUN AI INSIGHTS
        # This "distills" the conversation into a short summary and detects the mood
        ai_summary = generate_summary(full_transcript)
        ai_sentiment = analyze_sentiment(full_transcript)

        # 3. SAVE EVERYTHING
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO complaints (student_id, description, category, conversation_log, summary, sentiment) VALUES (%s, %s, %s, %s, %s, %s)",
            (request.student_id, full_desc, category, logs_json, ai_summary, ai_sentiment)
        )
        conn.commit()
        cursor.close()
        conn.close()

    return {"response": ai_message}

@app.post("/respond-complaint")
async def respond_complaint(request: ResponseRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE complaints SET faculty_response = %s, status = 'Resolved' WHERE id = %s",
            (request.faculty_response, request.complaint_id)
        )
        conn.commit()
        return {"status": "success", "message": "Response recorded"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)