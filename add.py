"""
Simple phishing risk checker.

Features checked:
- SPF fail       → +1 point
- DMARC fail     → +2 points
- Suspicious domain → +2 points
- Unknown IP     → +1 point

Outputs:
- Risk score
- Verdict: Safe / Suspicious / Phishing
"""

import socket
from urllib.parse import urlparse

try:
    import dns.resolver  # from dnspython
except ImportError:
    dns = None
    print("Warning: 'dnspython' is not installed. SPF/DMARC checks will be skipped.")
    print("Install it with: pip install dnspython\n")
else:
    dns = dns.resolver


# -------------------------------
# Helper: extract domain from URL
# -------------------------------
def extract_domain(input_str: str) -> str:
    """
    Accepts a URL or domain and returns just the domain part.
    Examples:
      'https://example.com/login' -> 'example.com'
      'example.com'               -> 'example.com'
    """
    # If it looks like a URL, parse it
    if "://" in input_str:
        parsed = urlparse(input_str)
        return parsed.netloc.lower()
    # Otherwise, treat it as a domain directly
    return input_str.strip().lower()


# -------------------------------
# DNS-based checks (SPF / DMARC)
# -------------------------------
def has_valid_spf(domain: str) -> bool | None:
    """
    Returns:
      True  → SPF record exists (pass)
      False → SPF record definitely missing/invalid (fail)
      None  → Could not check (e.g., dns library missing or network error)
    """
    if dns is None:
        return None

    try:
        answers = dns.resolve(domain, "TXT")
    except Exception:
        # Could not resolve TXT records (network or DNS failure)
        return None

    for rdata in answers:
        txt = "".join(rdata.strings).lower()
        if "v=spf1" in txt:
            return True

    # No SPF record found
    return False


def has_valid_dmarc(domain: str) -> bool | None:
    """
    Returns:
      True  → DMARC record exists (pass)
      False → DMARC record definitely missing/invalid (fail)
      None  → Could not check
    """
    if dns is None:
        return None

    dmarc_domain = f"_dmarc.{domain}"
    try:
        answers = dns.resolve(dmarc_domain, "TXT")
    except Exception:
        return None

    for rdata in answers:
        txt = "".join(rdata.strings).lower()
        if "v=dmarc1" in txt:
            return True

    return False


# -------------------------------
# Heuristic: suspicious domain
# -------------------------------
def is_suspicious_domain(domain: str) -> bool:
    """
    Very simple heuristic for suspicious domains.
    You can tune these rules as you like.
    """
    # 1. Very long domain name
    if len(domain) > 25:
        return True

    # 2. Contains punycode (IDN)
    if "xn--" in domain:
        return True

    # 3. Too many digits
    digits = sum(c.isdigit() for c in domain)
    if digits >= 5:
        return True

    # 4. Many hyphens
    if domain.count("-") >= 3:
        return True

    # 5. Suspicious TLDs (example list; feel free to change)
    suspicious_tlds = {".xyz", ".top", ".click", ".gq", ".ml", ".tk", ".zip"}
    for tld in suspicious_tlds:
        if domain.endswith(tld):
            return True

    return False


# -------------------------------
# Unknown IP check
# -------------------------------
def is_unknown_ip(domain: str) -> tuple[bool, str | None]:
    """
    Resolves the domain to an IP and decides if it is "unknown".

    Very simple rule:
      - If IP is in a small known-good whitelist → known (False)
      - Otherwise → unknown (True)

    Returns (is_unknown, ip_or_none).
    """
    # Example whitelist – add your own known trusted IPs here.
    known_good_ips = {
        "142.250.72.14",   # example: google.com (this may change over time)
        "151.101.1.69",    # example: stackoverflow.com (may change)
    }

    try:
        ip = socket.gethostbyname(domain)
    except Exception:
        # Could not resolve – treat as unknown
        return True, None

    if ip in known_good_ips:
        return False, ip

    # Everything not explicitly whitelisted is treated as unknown
    return True, ip


# -------------------------------
# Risk score + verdict
# -------------------------------
def calculate_risk(domain_or_url: str) -> dict:
    """
    Main function: returns a dict with all details.
    """
    domain = extract_domain(domain_or_url)

    # Individual checks
    spf_ok = has_valid_spf(domain)       # True / False / None
    dmarc_ok = has_valid_dmarc(domain)   # True / False / None
    suspicious = is_suspicious_domain(domain)
    unknown_ip, resolved_ip = is_unknown_ip(domain)

    risk_score = 0

    # Apply scoring rules **only when we are sure a check failed**
    if spf_ok is False:
        risk_score += 1  # SPF fail → +1

    if dmarc_ok is False:
        risk_score += 2  # DMARC fail → +2

    if suspicious:
        risk_score += 2  # Suspicious domain → +2

    if unknown_ip:
        risk_score += 1  # Unknown IP → +1

    # Decide verdict based on total score
    # You can tune these thresholds.
    if risk_score == 0:
        verdict = "Safe"
    elif 1 <= risk_score <= 3:
        verdict = "Suspicious"
    else:  # 4–6
        verdict = "Phishing"

    return {
        "domain": domain,
        "ip": resolved_ip,
        "spf_ok": spf_ok,
        "dmarc_ok": dmarc_ok,
        "suspicious_domain": suspicious,
        "unknown_ip": unknown_ip,
        "risk_score": risk_score,
        "verdict": verdict,
    }


# -------------------------------
# Simple command-line interface
# -------------------------------
def main():
    print("=== Simple Phishing Risk Checker ===")
    user_input = input("Enter a URL or domain (e.g. https://example.com): ").strip()

    result = calculate_risk(user_input)

    print("\n--- Detailed Results ---")
    print(f"Domain          : {result['domain']}")
    print(f"Resolved IP     : {result['ip'] if result['ip'] else 'N/A'}")

    # Display SPF/DMARC status in human-friendly way
    def fmt_check(value, name):
        if value is True:
            return f"{name}: PASS"
        if value is False:
            return f"{name}: FAIL"
        return f"{name}: UNKNOWN (could not check)"

    print(fmt_check(result["spf_ok"], "SPF"))
    print(fmt_check(result["dmarc_ok"], "DMARC"))
    print(f"Suspicious domain: {'YES' if result['suspicious_domain'] else 'NO'}")
    print(f"Unknown IP       : {'YES' if result['unknown_ip'] else 'NO'}")

    print("\n--- Final Assessment ---")
    print(f"Risk score: {result['risk_score']}")
    print(f"Verdict   : {result['verdict']}")


if __name__ == "__main__":
    main()