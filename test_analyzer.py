#!/usr/bin/env python3
"""
Quick test script for phishing analyzer
"""

import sys
import os

# Add score_backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'phishingtool'))

print("=" * 60)
print("PHISHING RISK ASSESSMENT REPORT")
print("=" * 60)

try:
    print("\n[1/4] Loading email...")
    from analyzer import load_email, analyze_email
    msg = load_email("email2.eml")
    
    print("[2/4] Analyzing email content...")
    email_result = analyze_email("email2.eml")
    
    print("[3/4] Analyzing infrastructure...")
    from infrastructure_analysis import analyze_received_headers
    ip_analysis = analyze_received_headers(msg)
    
    print("[4/4] Calculating phishing score...")
    from score_calculator import calculate_phishing_score
    phishing_score = calculate_phishing_score(email_result, ip_analysis)
    
    # Display results
    print(f"\n📊 OVERALL SCORE: {phishing_score['overall_score']}/10")
    print(f"🚨 RISK LEVEL: {phishing_score['risk_level']}")
    
    print("\n🔐 AUTHENTICATION RECORDS:")
    print(f"  • SPF: {phishing_score['spf']}")
    print(f"  • DMARC: {phishing_score['dmarc']}")
    print(f"  • DKIM: {phishing_score['dkim']}")
    
    print("\n🌐 NETWORK INFORMATION:")
    print(f"  • Originating IP: {phishing_score['originating_ip']}")
    
    print("\n" + "=" * 60)
    print("✅ Analysis Complete!")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
