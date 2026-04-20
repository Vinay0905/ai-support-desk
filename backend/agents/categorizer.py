import os 
from langchain_groq import ChatGroq 
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

def categorize_complaint(desc:str):
    llm=ChatGroq(
        temperature=0,
        model_name="llama-3.3-70b-versatile",
        groq_api_key=os.getenv("GROQ_API_KEY")

    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an assistant that categorizes student complaints. "
                   "Categories: ['Network', 'Faculty', 'Facilities', 'Financial', 'General']. "
                   "Respond with only the category name."),
        ("user", "{complaint}")
    ])
    chain = prompt | llm
    
    response = chain.invoke({"complaint": desc})
    return response.content.strip()


if __name__=="__main__":
    test_complaint="The Wifi in the hotel is not working for the last 3 days"

    print(f"Complaint: {test_complaint}")
    print(f"Category: {categorize_complaint(test_complaint)}")

    