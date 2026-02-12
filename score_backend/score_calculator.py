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


def calculate_url_score(urls):
    """
    Calculate phishing score based on URLs in email body.
    
    :param urls: list of URLs from analyzer
    :return: score (0-10)
    """
    score = 0
    
    if not urls:
        return 0
    
    # Multiple URLs can indicate phishing
    if len(urls) > 3:
        score += 1.5
    
    # Check for suspicious domains
    suspicious_keywords = ['secure', 'verify', 'confirm', 'update', 'validate', 'account']
    for url in urls:
        domain = url.get("domain", "").lower()
        for keyword in suspicious_keywords:
            if keyword in domain:
                score += 1
                break
    
    # Check for mismatched URLs (display text vs actual URL)
    for url in urls:
        if url.get("scheme") == "http":  # Non-HTTPS
            score += 0.5
    
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


def calculate_security_check_score(urls):
    """
    Calculate phishing score based on security checks (SPF, DMARC, DKIM, domain reputation).
    
    :param urls: list of URLs from analyzer
    :return: tuple (score, spf_results, dmarc_results, dkim_results)
    """
    if not urls:
        return 0, [], [], []
    
    from security_check import analyze_domain, get_domain
    
    score = 0
    total_domains = len(urls)
    risky_domains = 0
    spf_results = []
    dmarc_results = []
    dkim_results = []
    
    for url_data in urls:
        url = url_data.get("full_url", "")
        domain = get_domain(url)
        
        domain_score, verdict, spf, dmarc, dkim, suspicious, unknown = analyze_domain(domain)
        
        spf_results.append(spf)
        dmarc_results.append(dmarc)
        dkim_results.append(dkim)
        
        # Map domain score to risk contribution
        if verdict == "Phishing":
            risky_domains += 1
        elif verdict == "Suspicious":
            risky_domains += 0.5
    
    # Calculate percentage of risky domains
    if total_domains > 0:
        score = min((risky_domains / total_domains) * 10, 10)
    
    return score, spf_results, dmarc_results, dkim_results


def calculate_url_analyzer_score(email_body):
    """
    Calculate phishing score based on advanced URL analysis.
    
    :param email_body: email body text from analyzer
    :return: score (0-10)
    """
    if not email_body:
        return 0
    
    from url_analyzer import analyze_email_urls
    
    url_result = analyze_email_urls(email_body)
    total_urls = url_result.get("total_urls", 0)
    suspicious_urls = url_result.get("suspicious_count", 0)
    
    if total_urls == 0:
        return 0
    
    # Calculate percentage of suspicious URLs
    score = min((suspicious_urls / total_urls) * 10, 10)
    
    return score


def calculate_phishing_score(email_result, ip_analysis):
    """
    Calculate overall phishing risk score by combining all analyzers.
    
    :param email_result: result from analyze_email()
    :param ip_analysis: result from analyze_received_headers()
    :return: dict with overall score and component scores
    """
    
    metadata = email_result.get("metadata", {})
    urls = email_result.get("urls", [])
    body = email_result.get("body", "")
    
    # Calculate individual component scores
    metadata_score = calculate_metadata_score(metadata)
    url_score = calculate_url_score(urls)
    ip_score = calculate_ip_score(ip_analysis)
    security_check_score, spf_results, dmarc_results, dkim_results = calculate_security_check_score(urls)
    url_analyzer_score = calculate_url_analyzer_score(body)
    
    # Weighted average
    # Security Check: 28%, URL Analyzer: 28%, Metadata: 28%, IP: 16%
    overall_score = (
        (security_check_score * 0.28) +
        (url_analyzer_score * 0.28) +
        (metadata_score * 0.28) +
        (ip_score * 0.16)
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
            "security_check_score": security_check_score,
            "url_analyzer_score": url_analyzer_score,
            "metadata_score": metadata_score,
            "ip_score": ip_score,
            "url_score": url_score
        },
        "details": {
            "header_mismatch": metadata.get("reply_to_mismatch", False),
            "domain_mismatch": metadata.get("from_domain") != metadata.get("return_path_domain"),
            "total_ips_found": len(ip_analysis.get("ips", [])),
            "urls_found": len(urls)
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
    
    print("\n🔐 AUTHENTICATION RECORDS:")
    print(f"  • SPF: {phishing_score['spf']}")
    print(f"  • DMARC: {phishing_score['dmarc']}")
    print(f"  • DKIM: {phishing_score['dkim']}")
    
    print("\n🌐 NETWORK INFORMATION:")
    print(f"  • Originating IP: {phishing_score['originating_ip']}")
    
    print("\n" + "=" * 60)
    
    # Save to JSON file
    json_file = save_to_json(phishing_score)
    print(f"\n✅ Results saved to: {json_file}")
