import os 
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from database import get_db_connection
from dotenv import load_dotenv
load_dotenv()

class AgentState(TypedDict):
    messages:Annotated[list,add_messages]
    mode:str
    student_id:int

llm= ChatGroq(
    temperature=0.3,
    model_name="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)


def teacher_node(state:AgentState):
    messages= state["messages"]
    mode=state["mode"]
    
    context = ""
    if mode == "query":
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT question, answer FROM faqs")
        faqs = cursor.fetchall()
        context = "\n".join([f"Q: {f['question']} A: {f['answer']}" for f in faqs])
        cursor.close()
        conn.close()

    system_prompt = f"""
    You are a professional Head Faculty Member at a college. 
    Your goal is to assist students with their queries or complaints.
    
    MODE: {mode.upper()}
    
    INSTRUCTIONS:
    1. If MODE is 'query': Use the FAQ context below to answer. Keep it brief.
       FAQ Context: {context}
       
    2. If MODE is 'complaint': Interview the student. 
       - Ask ONLY ONE OR TWO questions at a time. Do not overwhelm them.
       - Ensure you collect: specific issue, location (Room/Block), faculty names (if any).
       - ONLY when you have FULL context, end with: "THANK_YOU_REPORT_FILED".
    
    TONE: Professional, concise, acting as a faculty member.
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("placeholder", "{messages}")
    ])
    chain=prompt|llm
    
    response=chain.invoke({"messages":messages})
    return {"messages":[response]}

workflow = StateGraph(AgentState)
workflow.add_node("teacher", teacher_node)
workflow.set_entry_point("teacher")
workflow.add_edge("teacher", END)
# Compile
chat_agent = workflow.compile()