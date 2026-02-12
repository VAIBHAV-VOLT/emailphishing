#!/usr/bin/env python3
"""
Email Phishing Analyzer - Flask Web Server
Analyzes email files for phishing risk using phishingtool engine
"""

import sys
import os
from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import datetime

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
            # 🔥 IMPORT YOUR ENGINE
            from phishingtool.main import main as run_analysis

            # 🔥 RUN ANALYSIS
            result = run_analysis(temp_path)

            # Return result JSON
            return jsonify(result), 200

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
    print("📱 POST email files to: http://localhost:5000/analyze_email_route")
    print("Press CTRL+C to stop the server\n")
    app.run(debug=True, host='localhost', port=5000)
