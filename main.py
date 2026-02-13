#!/usr/bin/env python3
"""
Email Phishing Analyzer - Flask Web Server
Comprehensive phishing detection using ML models + rule-based analysis
Integrated with score_calculator (combines ALL phishingtool modules)
"""

import sys
import os
from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import datetime
from waitress import serve

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/analyze_email_route', methods=['POST'])
def analyze_email_route():
    """Analyze uploaded email file using comprehensive score_calculator."""
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
            # Import comprehensive score_calculator from phishingtool
            from phishingtool.score_calculator import (
                calculate_comprehensive_phishing_score,
                save_to_json
            )

            # Calculate comprehensive phishing score (includes ALL 12 modules)
            result = calculate_comprehensive_phishing_score(temp_path)

            if result:
                # Return result JSON with all component scores
                response = {
                    'status': 'success',
                    'data': {
                        'overall_score': result['overall_score'],
                        'risk_level': result['risk_level'],
                        'from_address': result.get('from_address'),
                        'to_address': result.get('to_address'),
                        'spf': result['spf'],
                        'dmarc': result['dmarc'],
                        'dkim': result['dkim'],
                        'originating_ip': result['originating_ip'],
                        'component_scores': result.get('component_scores', {}),
                        'details': result.get('details', {})
                    }
                }

                return jsonify(response), 200
            else:
                return jsonify({'error': 'Failed to calculate phishing score'}), 500

        except Exception as analysis_error:
            return jsonify({'error': f'Score calculation error: {str(analysis_error)}'}), 500

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
    return jsonify({
        'status': 'healthy',
        'service': 'Email Phishing Analyzer - Comprehensive Scoring',
        'modules': [
            'Attachments', 'Authentication', 'Headers', 'Domain',
            'URLs', 'Infrastructure', 'MIME', 'Timing',
            'Metadata', 'IP Analysis', 'URL Security', 'Transformer'
        ]
    }), 200


if __name__ == "__main__":
    print("🚀 Starting Email Phishing Analyzer Web Server")
    print("📊 Features: Comprehensive scoring from ALL 12 phishing analysis modules")
    print("📱 POST email files to: http://localhost:5000/analyze_email_route")
    print("💚 GET health check: http://localhost:5000/health")
    print("Press CTRL+C to stop the server\n")
    serve(app, host='0.0.0.0', port=5000)