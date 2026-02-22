### **VERTIXA - Institutional Invoice Authentication System**

## **Live Application URLs**

- **Frontend Dashboard**: http://localhost:7575/dashboard
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (FastAPI auto-generated)

---

## **What This Is**

A **production-ready, institutional-grade AI authentication platform** that automatically:
- Authenticates vendor signals and signatures
- Verifies institutional trust scores against global databases
- Detects sophisticated fraud using cryptographic document forensics
- Calculates kinetic risk scores based on CFO-led governance rules
- Makes autonomous verification decisions (Block / Appoint / Approve)
- Provides a forensic audit trail for every automated transaction

---

## **Project Structure**

```
c:/Users/kisho/sly/
├── app/                         # Next.js 16 frontend (Institutional Theme)
│   ├── dashboard/              # Main dashboard pages
│   │   ├── page.tsx           # Command Center overview
│   │   ├── process/           # Neural Signal Processor
│   │   ├── fraud/             # Forensic Monitor
│   │   ├── vendors/           # Institutional Directory
│   │   ├── logs/              # Neural Audit Logs
│   │   └── vision/            # Forensic Vision Hub
│   ├── layout.tsx
│   └── globals.css            # Institutional Blue UI System
├── components/
│   ├── landing/               # VERTIXA Hero V3 + Tactical Bento Pages
│   └── dashboard/             # Specialized HUD components
├── backend/
│   ├── main.py                # FastAPI entry point (Institutional Guard)
│   ├── app/                   # Core Logic
│   └── schema.sql             # Relational Trust Schema
└── README.md                  # This file
```

---

## **How to Run**

### **1. Start the Backend (FastAPI)**
```bash
cd c:/Users/kisho/sly
.venv\\Scripts\\python.exe -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will start at: http://localhost:8000

### **2. Start the Frontend (Next.js)**
```bash
npm run dev
```
Frontend will start at: http://localhost:7575

---

## **Key Features (All Implemented)**

✅ **Institutional Branding**: Rebranded from XYLO to VERTIXA for B2B authority  
✅ **Bento HUD Architecture**: High-density tactical dashboard for CFO oversight  
✅ **Neural Agent Swarm**: Specialized agents for forensics, matching, and decisions  
✅ **Forensic Vision**: YOLOv8-powered auditing for physical document verification  
✅ **Audit Integrity**: Every decision is immutably logged for institutional compliance  
✅ **Production Ready**: Verified build, CORS secured, and Render-optimized  

---

## **Technologies Used**

### **Frontend**
- Next.js 16 (App Router / Turbopack)
- Tailwind CSS + Framer Motion (Kinetic Physics)
- Lucide Iconic Set (Institutional Guard Theme)
- Specialized Bento Grid Layout System

### **Backend**
- FastAPI (Institutional Python 3.11+)
- Pydantic v2 (Trust Logic Validation)
- CrewAI & AutoGen (Agent Orchestration)
- In-Memory Persistence (Scalable to PostgreSQL)

---

## 📚 Project Documentation

Detailed guides and reports are available in the `docs/` folder:
- [Pitching Document](./docs/PITCH_DOCUMENT.md) - **Institutional Pitch Deck**
- [MVP Delivery Package](./docs/MVP_DELIVERY.md) - VERTIXA System Overview
- [STATUS Report](./docs/STATUS.md) - Current Deployment Readiness

---

## 🚀 Deployment (Render/GitHub)

1. **GitHub**:
   ```bash
   git remote add origin YOUR_REPO_URL
   git push -u origin master
   ```
2. **Render**:
   - Connect your GitHub repo to Render.
   - Use the **Blueprint** feature via `render.yaml`.
   - Update `NEXT_PUBLIC_API_URL` to point to the live VERTIXA backend.

---

## **Credits**
Built with institutional precision using:
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [Framer Motion](https://www.framer.com/motion/)

---

**VERTIXA: The Infrastructure of Trust.**
