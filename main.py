#!/usr/bin/env python3
"""
Email Phishing Analyzer - Main Entry Point
Analyzes email files for phishing risk using multiple analyzers
"""

import sys
import os
from pathlib import Path

# Add score_backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'score_backend'))


def analyze_email_file(email_file):
    """
    Analyze a single email file and generate a comprehensive phishing assessment.
    
    :param email_file: path to the .eml file to analyze
    :return: phishing assessment dict
    """
    # Import here to avoid circular imports
    from analyzer import analyze_email, load_email
    from infrastructure_analysis import analyze_received_headers
    from score_calculator import calculate_phishing_score, save_to_json
    
    print(f"\n📧 Analyzing email file: {email_file}")
    print("-" * 60)
    
    # Load and analyze email (only once)
    msg = load_email(email_file)
    email_result = analyze_email(email_file)
    ip_analysis = analyze_received_headers(msg)
    
    # Calculate phishing score
    phishing_score = calculate_phishing_score(email_result, ip_analysis)
    
    return phishing_score, save_to_json


def main():
    """
    Main entry point for the email phishing analyzer.
    """
    # Get email file from command line argument or use default
    if len(sys.argv) > 1:
        email_file = sys.argv[1]
    else:
        email_file = "email2.eml"
    
    # Check if file exists
    if not os.path.exists(email_file):
        print(f"❌ Error: File '{email_file}' not found.")
        print(f"\nUsage: python main.py <path_to_email.eml>")
        sys.exit(1)
    
    try:
        # Analyze the email file
        phishing_score, save_to_json = analyze_email_file(email_file)
        
        # Print the assessment report
        print("\n" + "=" * 60)
        print("PHISHING RISK ASSESSMENT REPORT")
        print("=" * 60)
        
        print(f"\n📊 OVERALL RISK SCORE: {phishing_score['overall_score']}/10")
        print(f"🚨 RISK LEVEL: {phishing_score['risk_level']}")
        
        print("\n📈 COMPONENT SCORES:")
        scores = phishing_score['component_scores']
        print(f"  • Security Check Score: {scores['security_check_score']}")
        print(f"  • URL Analyzer Score: {scores['url_analyzer_score']}")
        print(f"  • Metadata Score: {scores['metadata_score']}")
        print(f"  • IP Analysis Score: {scores['ip_score']}")
        print(f"  • URL Analysis Score: {scores['url_score']}")
        
        print("\n🔍 KEY DETAILS:")
        details = phishing_score['details']
        print(f"  • Header Mismatch: {details['header_mismatch']}")
        print(f"  • Domain Mismatch: {details['domain_mismatch']}")
        print(f"  • Originating IP: {details['originating_ip']}")
        print(f"  • Total IPs Found: {details['total_ips_found']}")
        print(f"  • URLs Found: {details['urls_found']}")
        
        print("\n" + "=" * 60)
        
        # Save to JSON file
        json_file = save_to_json(phishing_score)
        print(f"\n✅ Results saved to: {json_file}\n")
        
        return 0
        
    except FileNotFoundError as e:
        print(f"❌ Error: File not found - {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error analyzing email: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    sys.exit(main())
