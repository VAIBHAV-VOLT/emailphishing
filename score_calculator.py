"""
Score Calculator for Email Phishing Detection
Combines analysis from analyzer, infrastructure_analysis, and original_ip_analysis
to calculate a phishing risk score (0-100).
"""

import json
from datetime import datetime


def calculate_metadata_score(metadata):
    """
    Calculate phishing score based on email metadata.
    
    :param metadata: email metadata dict from analyzer
    :return: score (0-100)
    """
    score = 0
    
    # Check for header mismatches (phishing indicator)
    if metadata.get("reply_to_mismatch"):
        score += 25
    
    # Check for missing or suspicious headers
    if not metadata.get("authentication_results"):
        score += 15
    
    # Check for unusual mailer or headers
    if metadata.get("x_mailer") and "unknown" in str(metadata.get("x_mailer", "")).lower():
        score += 10
    
    # Domain mismatch between From and Return-Path
    from_domain = metadata.get("from_domain")
    return_path_domain = metadata.get("return_path_domain")
    if from_domain and return_path_domain and from_domain != return_path_domain:
        score += 20
    
    return min(score, 100)


def calculate_url_score(urls):
    """
    Calculate phishing score based on URLs in email body.
    
    :param urls: list of URLs from analyzer
    :return: score (0-100)
    """
    score = 0
    
    if not urls:
        return 0
    
    # Multiple URLs can indicate phishing
    if len(urls) > 3:
        score += 15
    
    # Check for suspicious domains
    suspicious_keywords = ['secure', 'verify', 'confirm', 'update', 'validate', 'account']
    for url in urls:
        domain = url.get("domain", "").lower()
        for keyword in suspicious_keywords:
            if keyword in domain:
                score += 10
                break
    
    # Check for mismatched URLs (display text vs actual URL)
    for url in urls:
        if url.get("scheme") == "http":  # Non-HTTPS
            score += 5
    
    return min(score, 100)


def calculate_ip_score(ip_analysis):
    """
    Calculate phishing score based on IP analysis.
    
    :param ip_analysis: IP analysis dict from infrastructure_analysis
    :return: score (0-100)
    """
    score = 0
    
    ips = ip_analysis.get("ips", [])
    originating_ip = ip_analysis.get("originating_ip")
    
    # Multiple IPs can indicate spoofing
    if len(ips) > 5:
        score += 15
    
    # No originating IP found (suspicious)
    if not originating_ip:
        score += 20
    
    return min(score, 100)


def calculate_ai_score(ai_result):
    """
    Calculate phishing score based on AI analysis.
    
    :param ai_result: AI analysis result from original_ip_analysis
    :return: score (0-100)
    """
    score = 0
    
    # If AI determined phishing is related
    if ai_result.get("phishing"):
        score = 50  # High score if AI flagged it
    
    return score


def calculate_phishing_score(email_result, ip_analysis, ai_result):
    """
    Calculate overall phishing risk score by combining all analyzers.
    
    :param email_result: result from analyze_email()
    :param ip_analysis: result from analyze_received_headers()
    :param ai_result: result from analyze_with_ai()
    :return: dict with overall score and component scores
    """
    
    metadata = email_result.get("metadata", {})
    urls = email_result.get("urls", [])
    
    # Calculate individual component scores
    metadata_score = calculate_metadata_score(metadata)
    url_score = calculate_url_score(urls)
    ip_score = calculate_ip_score(ip_analysis)
    ai_score = calculate_ai_score(ai_result)
    
    # Weighted average
    # AI analysis: 40%, Metadata: 30%, IP: 20%, URLs: 10%
    overall_score = (
        (ai_score * 0.40) +
        (metadata_score * 0.30) +
        (ip_score * 0.20) +
        (url_score * 0.10)
    )
    
    return {
        "overall_score": round(overall_score, 2),
        "risk_level": get_risk_level(overall_score),
        "component_scores": {
            "metadata_score": metadata_score,
            "url_score": url_score,
            "ip_score": ip_score,
            "ai_score": ai_score
        },
        "details": {
            "ai_detected_phishing": ai_result.get("phishing", False),
            "header_mismatch": metadata.get("reply_to_mismatch", False),
            "domain_mismatch": metadata.get("from_domain") != metadata.get("return_path_domain"),
            "originating_ip": ip_analysis.get("originating_ip"),
            "total_ips_found": len(ip_analysis.get("ips", [])),
            "urls_found": len(urls)
        }
    }


def get_risk_level(score):
    """
    Determine risk level based on score.
    
    :param score: phishing score (0-100)
    :return: risk level string
    """
    if score >= 8:
        return "CRITICAL"
    elif score >= 6:
        return "HIGH"
    elif score >= 4:
        return "MEDIUM"
    elif score >= 2:
        return "LOW"
    else:
        return "MINIMAL"


def save_to_json(phishing_score, filename="phishing_assessment.json"):
    """
    Save phishing assessment results to JSON file.
    
    :param phishing_score: dict with phishing assessment results
    :param filename: output JSON filename
    :return: filename of saved JSON file
    """
    output_data = {
        "timestamp": datetime.now().isoformat(),
        "assessment": phishing_score
    }
    
    with open(filename, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    return filename


# Main execution
if __name__ == "__main__":
    # Import here to avoid circular imports
    from analyzer import analyze_email, load_email
    from infrastructure_analysis import analyze_received_headers
    from original_ip_analysis import analyze_with_ai
    
    # Load and analyze email
    msg = load_email("email2.eml")
    email_result = analyze_email("email2.eml")
    ip_analysis = analyze_received_headers(msg)
    ai_result = analyze_with_ai(ip_analysis['originating_ip']) if ip_analysis['originating_ip'] else {"phishing": False, "originating_ip": None, "ai_response": "No IP to analyze"}
    
    # Calculate phishing score
    phishing_score = calculate_phishing_score(email_result, ip_analysis, ai_result)
    
    print("=" * 60)
    print("PHISHING RISK ASSESSMENT REPORT")
    print("=" * 60)
    
    print(f"\n📊 OVERALL RISK SCORE: {phishing_score['overall_score']}/10")
    print(f"🚨 RISK LEVEL: {phishing_score['risk_level']}")
    
    print("\n📈 COMPONENT SCORES:")
    #print(f"  • AI Analysis Score: {phishing_score['component_scores']['ai_score']}")
    print(f"  • Metadata Score: {phishing_score['component_scores']['metadata_score']}")
    print(f"  • IP Analysis Score: {phishing_score['component_scores']['ip_score']}")
    print(f"  • URL Analysis Score: {phishing_score['component_scores']['url_score']}")
    
    print("\n🔍 KEY DETAILS:")
    details = phishing_score['details']
    #print(f"  • AI Detected Phishing: {details['ai_detected_phishing']}")
    print(f"  • Header Mismatch: {details['header_mismatch']}")
    print(f"  • Domain Mismatch: {details['domain_mismatch']}")
    print(f"  • Originating IP: {details['originating_ip']}")
    print(f"  • Total IPs Found: {details['total_ips_found']}")
    print(f"  • URLs Found: {details['urls_found']}")
    
    print("\n" + "=" * 60)
    
    # Save to JSON file
    json_file = save_to_json(phishing_score)
    print(f"\n✅ Results saved to: {json_file}")
