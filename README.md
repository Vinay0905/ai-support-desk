# Institutional AI Support Desk 🏫🤖💎

A state-of-the-art, conversational AI query and complaint management system for modern educational institutions. This platform replaces static forms with an interactive AI interviewer that builds context-rich reports for faculty review.

---

## 🚀 **Quick Start**

### **1. Backend (FastAPI + Groq AI)**
The "Brain" of the system.
- **Path**: `/backend`
- **Dependencies**: `fastapi`, `langgraph`, `langchain-groq`, `mysql-connector-python`, `python-dotenv`.
- **Run Command**:
  ```bash
  python main.py
  ```
- **Environment Setup**: Create a `.env` file in the `/backend` folder:
  ```env
  GROQ_API_KEY="your_groq_api_key_here"
  DB_HOST="localhost"
  DB_USER="root"
  DB_PASSWORD="your_mysql_password"
  DB_NAME="ai_support_desk"
  ```

### **2. Frontend (Next.js + Tailwind)**
The "Body" of the system.
- **Path**: `/frontend`
- **Dependencies**: React, Next.js, Framer Motion, Lucide Icons.
- **Run Command**:
  ```bash
  npm run dev
  ```
- **URL**: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ **Features**

- **🎯 Interactive Interviewer**: Uses `LangGraph` and `Llama 3.3` to act as a digital secretary, interviewing students about their concerns before filing a report.
- **🧠 AI Insights (Phase 10)**: 
  - **Executive Summaries**: AI condenses long chats into 1-sentence recaps.
  - **Sentiment Mapping**: Detects student mood (**Urgent, Moderate, Low**) for prioritization.
- **🖥️ Premium Faculty Dashboard**:
  - **Student-First Navigation**: Drill down from a student list to specific reports.
  - **Transcript Decryption**: Access the full raw logs of AI-student interviews.
- **🛡️ Secure Login**: Role-based access for Students and Faculty.

---

## 🗄️ **Database Schema (MySQL)**

The system uses two primary tables within the `ai_support_desk` database:

### **1. `users` Table**
Manages authorization.
- `username`: Unique ID for login.
- `role`: (`student` | `faculty`).

**To add a new student:**
```sql
INSERT INTO users (username, email, password, role) VALUES ('student1', 'student1@edu.com', 'pass', 'student');
```

### **2. `complaints` Table**
Stores the "Intelligence Reports".
- `conversation_log`: Full JSON history of the chat.
- `summary`: AI-generated 1-sentence recap.
- `sentiment`: AI-detected urgency level.
- `category`: Automatically assigned (Network, Facilities, etc.).

---

## 📁 **Project Structure**

```text
├── backend/
│   ├── agents/          # AI logic (Conversation, Insight, Categorizer)
│   ├── main.py          # FastAPI routes & App logic
│   └── database.py      # MySQL connection utility
├── frontend/
│   ├── app/             # Next.js App Router (Dashboard, Login)
│   └── components/      # UI Blocks
└── README.md            # You are here!
```

---

## 👨‍💻 **Tutor Notes**
This project was developed as a case study in building "Human-in-the-loop" AI systems. It demonstrates how AI can empower administrators (Faculty) rather than just automating away the human touch.

**Happy Coding!** 🚀🏢🥂
