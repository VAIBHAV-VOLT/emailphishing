🦅 PhisHawk
⚡ AI-Powered Phishing Email Detection System

Team: PhisBusters | Hackathon: hackAVENSIS










🚨 Problem Statement

Phishing attacks are one of the most dangerous cyber threats today.
Millions of users lose sensitive data due to:

Fake banking emails

Credential harvesting attacks

Spoofed domains

Social engineering tactics

Traditional spam filters fail to detect AI-generated and context-aware phishing emails.

We needed something smarter.

💡 Our Solution — PhisHawk

PhisHawk is an AI-powered phishing detection system that:

Analyzes .eml email files

Uses NLP & Machine Learning

Integrates HuggingFace models

Generates a phishing risk score

Outputs structured phishing assessment in JSON

Detects suspicious patterns, links, and manipulation cues

Think of it as an intelligent cybersecurity assistant 🛡️

🔥 Key Features

✔️ AI-based phishing classification
✔️ HuggingFace NLP model integration
✔️ Phishing risk scoring system
✔️ Structured JSON assessment output
✔️ Modular backend architecture
✔️ Tailwind-powered frontend
✔️ Test & debug scripts included
✔️ Sample email dataset included

🏗️ Architecture Overview
flowchart TD
    A[.eml Email Input] --> B[Email Analyzer Module]
    B --> C[NLP Processing]
    C --> D[HuggingFace Model]
    D --> E[Phishing Risk Scoring Engine]
    E --> F[JSON Phishing Assessment]
    F --> G[Frontend Display (Tailwind UI)]

Architecture Explanation

Email file is parsed

Content extracted and cleaned

NLP model processes semantic patterns

ML model predicts phishing probability

Score backend calculates risk score

Output stored in phishing_assessment.json

Results displayed via frontend

🛠️ Tech Stack
Layer	Technology Used
Backend	Python
ML/NLP	HuggingFace Transformers
Scoring	Custom Phishing Assessment Engine
Frontend	Tailwind CSS + JavaScript
Testing	Python test scripts
Data Input	.eml Email Files
📂 Folder Structure
PhisHawk/
│
├── emailanalyzer/        # Email parsing & NLP processing
├── score_backend/        # Phishing scoring engine
├── main.py               # Main execution file
├── test_analyzer.py      # Testing module
├── test_model_debug.py   # Model debugging
├── phishing_assessment.json
├── sample.eml
├── email2.eml
├── requirements.txt
└── README.md

⚙️ Installation Guide
1️⃣ Clone Repository
git clone https://github.com/VAIBHAV-VOLT/emailphishing.git
cd emailphishing

2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

3️⃣ Install Dependencies
pip install -r requirements.txt

▶️ Usage Guide
Run Main Detection
python main.py

Run Test Analyzer
python test_analyzer.py

📊 Sample Output
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


PhisHawk doesn't just say "Spam" —
It explains why it is dangerous.

🎥 Demo

Add your demo GIF here:

![Demo](demo.gif)


(Upload your hackathon demo recording as demo.gif in repo)

🚀 Why PhisHawk Stands Out (For Judges)

🔹 AI-driven, not rule-based
🔹 Modular architecture (scalable for enterprise use)
🔹 Real-world phishing dataset compatible
🔹 JSON output enables API integration
🔹 Can be deployed as:

Email gateway filter

Browser extension backend

Enterprise mail server plugin

SOC (Security Operations Center) tool

PhisHawk is not just a project —
It’s a cyber defense layer.

🌍 Real-World Impact

Reduces phishing-based financial fraud

Protects user credentials

Helps organizations automate email threat detection

Supports future AI-based cyber intelligence systems

With rising AI-generated scams, PhisHawk becomes even more relevant.

🔮 Future Improvements

Real-time email API integration

Browser extension

Live dashboard analytics

Explainable AI visualization

Threat intelligence database integration

Deployment on cloud (AWS/GCP)

👥 Team PhisBusters

Abhinav Gupta
Vaibhav
Eklavya Rajput
Rahul Nalla
Sumrit Singh

Built with ⚡ passion for cybersecurity & AI innovation.

🏆 hackAVENSIS Submission

PhisHawk represents:

Innovation

Practical security solution

AI-powered automation

Real-world scalability

We believe AI should defend users — not attack them.

🦅 PhisHawk — Hunt Phishing Before It Hunts You.
