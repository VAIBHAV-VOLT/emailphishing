"""
Score Calculator for Email Phishing Detection
Combines analysis from analyzer, infrastructure_analysis,
security_check, and url_analyzer to calculate a phishing risk score (0-10).
"""

import json
from datetime import datetime


def calculate_metadata_score(metadata):
    """
    Calculate phishing score based on email metadata.
    
    :param metadata: email metadata dict from analyzer
    :return: score (0-10)
    """
    score = 0
    
    # Check for header mismatches (phishing indicator)
    if metadata.get("reply_to_mismatch"):
        score += 2.5
    
    # Check for missing or suspicious headers
    if not metadata.get("authentication_results"):
        score += 1.5
    
    # Check for unusual mailer or headers
    if metadata.get("x_mailer") and "unknown" in str(metadata.get("x_mailer", "")).lower():
        score += 1
    
    # Domain mismatch between From and Return-Path
    from_domain = metadata.get("from_domain")
    return_path_domain = metadata.get("return_path_domain")
    if from_domain and return_path_domain and from_domain != return_path_domain:
        score += 2
    
    return min(score, 10)


def calculate_ip_score(ip_analysis):
    """
    Calculate phishing score based on IP analysis.
    
    :param ip_analysis: IP analysis dict from infrastructure_analysis
    :return: score (0-10)
    """
    score = 0
    
    ips = ip_analysis.get("ips", [])
    originating_ip = ip_analysis.get("originating_ip")
    
    # Multiple IPs can indicate spoofing
    if len(ips) > 5:
        score += 1.5
    
    # No originating IP found (suspicious)
    if not originating_ip:
        score += 2
    
    return min(score, 10)


def calculate_url_security_score(email_body):
    """
    Calculate phishing score based on ML model for URL authenticity.
    Much faster than DNS-based analysis (DNS queries removed).
    
    :param email_body: email body text from analyzer
    :return: tuple (overall_score, spf_results, dmarc_results, dkim_results)
    """
    if not email_body:
        return 0, [], [], []
    
    from url_analyzer import extract_urls, has_spf, has_dmarc, has_dkim
    from url_ml_analyzer import get_url_security_score_from_ml
    
    urls = extract_urls(email_body)
    if not urls:
        return 0, [], [], []
    
    # Use ML model for fast URL authenticity scoring
    url_score, ml_details = get_url_security_score_from_ml(urls)
    
    # Still check DNS auth records (cached and fast) for reporting
    spf_results = []
    dmarc_results = []
    dkim_results = []
    
    for url in urls:
        from url_analyzer import get_domain
        domain = get_domain(url)
        spf_results.append(has_spf(domain))
        dmarc_results.append(has_dmarc(domain))
        dkim_results.append(has_dkim(domain))
    
    return url_score, spf_results, dmarc_results, dkim_results


def calculate_transformer_score(email_body):
    """
    Calculate phishing score using Hugging Face transformer model.
    
    :param email_body: email body text from analyzer
    :return: score (0-10)
    """
    if not email_body:
        return 0
    
    from huggingface_analyzer import get_transformer_score
    
    score = get_transformer_score(email_body)
    return min(score, 10)


def calculate_url_analyzer_score(email_body):
    """
    Calculate phishing score based on unified URL security analysis.
    Uses the consolidated url_analyzer module.
    
    :param email_body: email body text from analyzer
    :return: score (0-10)
    """
    if not email_body:
        return 0
    
    url_score, _, _, _ = calculate_url_security_score(email_body)
    return min(url_score, 10)


def calculate_phishing_score(email_result, ip_analysis):
    """
    Calculate overall phishing risk score by combining all analyzers.
    
    :param email_result: result from analyze_email()
    :param ip_analysis: result from analyze_received_headers()
    :return: dict with overall score and component scores
    """
    
    metadata = email_result.get("metadata", {})
    body = email_result.get("body", "")
    
    # Calculate individual component scores
    metadata_score = calculate_metadata_score(metadata)
    ip_score = calculate_ip_score(ip_analysis)
    url_score, spf_results, dmarc_results, dkim_results = calculate_url_security_score(body)
    transformer_score = calculate_transformer_score(body)
    
    # Weighted average
    # URL/Security: 30%, Transformer: 25%, Metadata: 25%, IP: 20%
    overall_score = (
        (url_score * 0.30) +
        (transformer_score * 0.25) +
        (metadata_score * 0.25) +
        (ip_score * 0.20)
    )
    
    # Determine if SPF, DMARC, DKIM are present (any True in results means present)
    spf_present = any(spf_results) if spf_results else False
    dmarc_present = any(dmarc_results) if dmarc_results else False
    dkim_present = any(dkim_results) if dkim_results else False
    
    return {
        "overall_score": round(overall_score, 2),
        "risk_level": get_risk_level(overall_score),
        "spf": spf_present,
        "dmarc": dmarc_present,
        "dkim": dkim_present,
        "originating_ip": ip_analysis.get("originating_ip"),
        "component_scores": {
            "url_security_score": url_score,
            "transformer_score": transformer_score,
            "metadata_score": metadata_score,
            "ip_score": ip_score
        },
        "details": {
            "header_mismatch": metadata.get("reply_to_mismatch", False),
            "domain_mismatch": metadata.get("from_domain") != metadata.get("return_path_domain"),
            "total_ips_found": len(ip_analysis.get("ips", [])),
        }
    }


def get_risk_level(score):
    """
    Determine risk level based on score.
    
    :param score: phishing score (0-10)
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
    
    # Load and analyze email
    msg = load_email("email2.eml")
    email_result = analyze_email("email2.eml")
    ip_analysis = analyze_received_headers(msg)
    
    # Calculate phishing score
    phishing_score = calculate_phishing_score(email_result, ip_analysis)
    
    print("=" * 60)
    print("PHISHING RISK ASSESSMENT REPORT")
    print("=" * 60)
    
    print(f"\n📊 OVERALL SCORE: {phishing_score['overall_score']}/10")
    print(f"🚨 RISK LEVEL: {phishing_score['risk_level']}")
    
    print("\n� COMPONENT SCORES:")
    scores = phishing_score['component_scores']
    print(f"  • URL Security Score: {scores['url_security_score']}")
    print(f"  • Transformer (AI Model): {scores['transformer_score']}")
    print(f"  • Metadata Score: {scores['metadata_score']}")
    print(f"  • IP Analysis Score: {scores['ip_score']}")
    
    print("\n�🔐 AUTHENTICATION RECORDS:")
    print(f"  • SPF: {phishing_score['spf']}")
    print(f"  • DMARC: {phishing_score['dmarc']}")
    print(f"  • DKIM: {phishing_score['dkim']}")
    
    print("\n🌐 NETWORK INFORMATION:")
    print(f"  • Originating IP: {phishing_score['originating_ip']}")
    
    print("\n" + "=" * 60)
    
    # Save to JSON file
    json_file = save_to_json(phishing_score)
    print(f"\n✅ Results saved to: {json_file}")
