#!/usr/bin/env python3
"""
Email Phishing Analyzer - Flask Web Server
Analyzes email files for phishing risk using:
- Hugging Face RoBERTa model (email body analysis)
- Security checks (SPF, DMARC, DKIM)
- URL analysis
- Infrastructure analysis
- Metadata verification
"""

import sys
import os
from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import datetime

# Add score_backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'phishingtool'))

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/analyze_email_route', methods=['POST'])
def analyze_email_route():
    """Analyze uploaded email file."""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.eml'):
            return jsonify({'error': 'Invalid file format. Please upload a .eml file'}), 400
        
        # Save uploaded file temporarily
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        temp_filename = f"temp_{timestamp}_{file.filename}"
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
        file.save(temp_path)
        
        try:
            # Import analyzers
            from analyzer import analyze_email, load_email
            from infrastructure_analysis import analyze_received_headers
            from score_calculator import calculate_comprehensive_phishing_score
            
            # Load and analyze
            msg = load_email(temp_path)
            email_result = analyze_email(temp_path)
            ip_analysis = analyze_received_headers(msg)
            
            # Calculate score (includes Hugging Face RoBERTa model)
            phishing_score = calculate_comprehensive_phishing_score(email_result, ip_analysis)
            
            # Return simplified JSON with only requested attributes
            response = {
                "overall_score": phishing_score.get("overall_score"),
                "risk_level": phishing_score.get("risk_level"),
                "spf": phishing_score.get("spf"),
                "dmarc": phishing_score.get("dmarc"),
                "dkim": phishing_score.get("dkim"),
                "originating_ip": phishing_score.get("originating_ip"),
                "component_scores": phishing_score.get("component_scores")
            }
            
            return jsonify(response), 200
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except:
                    pass
    
    except Exception as e:
        return jsonify({'error': f'Analysis error: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'Email Phishing Analyzer with RoBERTa Model'}), 200


if __name__ == "__main__":
    print("🚀 Starting Email Phishing Analyzer Web Server")
    print("📱 POST email files to: http://localhost:5000/analyze-email")
    print("🤖 Using Hugging Face RoBERTa model for content analysis")
    print("Press CTRL+C to stop the server\n")
    app.run(debug=True, host='localhost', port=5000)
