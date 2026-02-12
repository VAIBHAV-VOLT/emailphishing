🚨 THE PROBLEM

Phishing attacks are evolving rapidly.

Today’s attackers use:

⚠ AI-generated emails

⚠ Social engineering tactics

⚠ Spoofed domains

⚠ Urgency & fear manipulation

Traditional spam filters fail against intelligent phishing attempts.

We needed something smarter.
We built PhisHawk.

💡 THE SOLUTION — PHISHAWK

PhisHawk is an AI-powered phishing detection engine that:

🔍 Parses .eml email files
🧠 Uses NLP & HuggingFace models
📊 Calculates phishing probability
📁 Generates structured JSON assessment
🎯 Identifies suspicious patterns & manipulation cues

It doesn’t just say “Spam” —
It explains why it’s dangerous.

🔥 CORE FEATURES
🛡 AI-Based Detection

Context-aware NLP processing

Semantic analysis of email content

ML-driven phishing probability scoring

📊 Risk Scoring Engine

Custom backend scoring logic

High / Medium / Low risk classification

Suspicious indicator breakdown

🧩 Modular Architecture

Separate email analyzer module

Dedicated scoring backend

Testing & debugging scripts included

🎨 Clean Frontend

Tailwind CSS powered UI

Structured result display

JSON-ready for API integration

🏗 SYSTEM ARCHITECTURE
flowchart TD
    A[📥 .eml Email Input] --> B[🔎 Email Analyzer]
    B --> C[🧠 NLP Processing]
    C --> D[🤖 HuggingFace Model]
    D --> E[📊 Phishing Risk Engine]
    E --> F[📁 JSON Assessment Output]
    F --> G[🖥 Frontend Display]

🔍 Architecture Breakdown

Email file is parsed

Content cleaned & tokenized

NLP model extracts semantic patterns

ML predicts phishing probability

Backend assigns risk score

Output saved in phishing_assessment.json

Frontend displays structured insights

🛠 TECH STACK
Layer	Technology
🐍 Backend	Python
🤖 ML/NLP	HuggingFace Transformers
📊 Scoring	Custom Risk Engine
🎨 Frontend	Tailwind CSS + JavaScript
🧪 Testing	Python Scripts
📂 Input	.eml Email Files
📂 PROJECT STRUCTURE
PhisHawk/
│
├── emailanalyzer/         
├── score_backend/         
├── main.py                
├── test_analyzer.py       
├── test_model_debug.py    
├── phishing_assessment.json
├── sample.eml
├── email2.eml
├── requirements.txt
└── README.md

⚙ INSTALLATION
1️⃣ Clone Repository
git clone https://github.com/VAIBHAV-VOLT/emailphishing.git
cd emailphishing

2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate
# Windows:
venv\Scripts\activate

3️⃣ Install Dependencies
pip install -r requirements.txt

▶️ RUN PHISHAWK
🔹 Run Detection
python main.py

🔹 Run Analyzer Tests
python test_analyzer.py

📊 SAMPLE OUTPUT
{
  "email_subject": "Urgent: Verify Your Bank Account",
  "phishing_probability": 0.87,
  "risk_level": "High",
  "suspicious_indicators": [
    "Urgent language",
    "Suspicious link domain",
    "Credential request"
  ]
}


✔ Transparent
✔ Structured
✔ Enterprise-ready

🏆 WHY PHISHAWK STANDS OUT (For Judges)

✅ AI-driven — not rule-based
✅ Scalable modular architecture
✅ JSON output for API integration
✅ Real-world phishing compatibility
✅ Enterprise deployable

PhisHawk can evolve into:

📧 Email gateway filter

🌐 Browser extension backend

🏢 Enterprise mail server plugin

🛡 SOC automation tool

This is not just a hackathon project.
This is a cyber defense layer.

🌍 REAL-WORLD IMPACT

Prevents financial fraud

Protects user credentials

Automates phishing threat detection

Supports AI-based cyber intelligence

In an era of AI-powered scams,
PhisHawk becomes more relevant than ever.

🔮 FUTURE IMPROVEMENTS

🌐 Real-time Email API integration

📊 Live dashboard analytics

🧠 Explainable AI visualization

☁ Cloud deployment (AWS / GCP)

🔐 Threat intelligence database

👥 TEAM PHISBUSTERS

Abhinav Gupta
Vaibhav
Rahul Nalla
Sumrit Singh
Eklavya Rajput

Built with ⚡ passion for AI & Cybersecurity.
