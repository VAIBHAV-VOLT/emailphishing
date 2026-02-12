import socket
from urllib.parse import urlparse
import dns.resolver
import dns.exception

# Create a custom resolver with proper timeout settings
resolver = dns.resolver.Resolver()
resolver.timeout = 5.0
resolver.lifetime = 5.0

# Set socket timeout to 5 seconds
socket.setdefaulttimeout(5.0)

# Simple cache for DNS lookups to avoid repeated queries
_dns_cache = {}

# Import your existing analyzer
from analyzer import analyze_email


# -------------------------------
# Extract domain safely
# -------------------------------
def get_domain(url: str) -> str:
    parsed = urlparse(url)
    return (parsed.netloc or parsed.path).split(":")[0].lower()


# -------------------------------
# SPF Check
# -------------------------------
def has_spf(domain: str) -> bool:
    cache_key = f"spf_{domain}"
    if cache_key in _dns_cache:
        return _dns_cache[cache_key]
    
    try:
        answers = resolver.resolve(domain, "TXT")
        for r in answers:
            if "v=spf1" in r.to_text().lower():
                _dns_cache[cache_key] = True
                return True
    except (dns.exception.DNSException, Exception):
        pass
    
    _dns_cache[cache_key] = False
    return False


# -------------------------------
# DMARC Check
# -------------------------------
def has_dmarc(domain: str) -> bool:
    cache_key = f"dmarc_{domain}"
    if cache_key in _dns_cache:
        return _dns_cache[cache_key]
    
    try:
        answers = resolver.resolve("_dmarc." + domain, "TXT")
        for r in answers:
            if "v=dmarc1" in r.to_text().lower():
                _dns_cache[cache_key] = True
                return True
    except (dns.exception.DNSException, Exception):
        pass
    
    _dns_cache[cache_key] = False
    return False


# -------------------------------
# DKIM Check
# -------------------------------
def has_dkim(domain: str) -> bool:
    cache_key = f"dkim_{domain}"
    if cache_key in _dns_cache:
        return _dns_cache[cache_key]
    
    try:
        # Check only the most common DKIM selectors (not all 10)
        selectors = ["default", "selector1", "selector2", "s1", "s2"]
        for selector in selectors:
            try:
                answers = resolver.resolve(f"{selector}._domainkey.{domain}", "TXT")
                for r in answers:
                    if "v=dkim1" in r.to_text().lower():
                        _dns_cache[cache_key] = True
                        return True
            except (dns.exception.DNSException, Exception):
                continue
    except Exception:
        pass
    
    _dns_cache[cache_key] = False
    return False


# -------------------------------
# Suspicious Domain Heuristics
# -------------------------------
def suspicious_domain(domain: str) -> bool:
    risky_tlds = [".xyz", ".top", ".click", ".ru", ".zip"]

    if len(domain) > 30:
        return True

    if any(domain.endswith(tld) for tld in risky_tlds):
        return True

    if sum(c.isdigit() for c in domain) >= 3:
        return True

    return False


# -------------------------------
# DNS Reputation Check
# -------------------------------
def unknown_ip(domain: str) -> bool:
    cache_key = f"ip_{domain}"
    if cache_key in _dns_cache:
        return _dns_cache[cache_key]
    
    try:
        # Only check if domain resolves to an IP (skip slow reverse lookup)
        ip = socket.gethostbyname(domain)
        _dns_cache[cache_key] = False
        return False  # Domain resolved successfully
    except Exception:
        _dns_cache[cache_key] = True
        return True  # Domain not resolvable


# -------------------------------
# Risk Scoring (same logic)
# -------------------------------
def analyze_domain(domain: str):
    spf = has_spf(domain)
    dmarc = has_dmarc(domain)
    dkim = has_dkim(domain)
    suspicious = suspicious_domain(domain)
    unknown = unknown_ip(domain)

    score = 0
    if not spf:
        score += 1
    if not dmarc:
        score += 2
    if not dkim:
        score += 1
    if suspicious:
        score += 2
    if unknown:
        score += 1

    if score <= 1:
        verdict = "Safe"
    elif score <= 3:
        verdict = "Suspicious"
    else:
        verdict = "Phishing"

    return score, verdict, spf, dmarc, dkim, suspicious, unknown


# -------------------------------
# MAIN (Click ▶ Run)
# -------------------------------
def main():
    email_file = "email2.eml"   # change if needed

    print("\n=== Running Email Analysis ===\n")

    result = analyze_email(email_file)

    metadata = result["metadata"]
    urls = result["urls"]

    # ---- Metadata Output ----
    print("From:", metadata.get("from"))
    print("Subject:", metadata.get("subject"))
    print("Date:", metadata.get("date"))
    print("From Domain:", metadata.get("from_domain"))
    print("Reply-To Mismatch:", metadata.get("reply_to_mismatch"))

    print("\n=== URL & DOMAIN ANALYSIS ===")

    if not urls:
        print("No URLs found in this email.")
        print("This appears to be a content-only email.\n")
        return

    for url_data in urls:
        url = url_data["full_url"]
        domain = get_domain(url)

        score, verdict, spf, dmarc, dkim, suspicious, unknown = analyze_domain(
            domain)

        print("\n--------------------------------")
        print("URL:", url)
        print("Domain:", domain)
        print("SPF Present:", spf)
        print("DMARC Present:", dmarc)
        print("DKIM Present:", dkim)
        print("Suspicious Pattern:", suspicious)
        print("Resolvable Host:", not unknown)
        print("Risk Score:", score)
        print("Verdict:", verdict)

    print("\n=== Analysis Complete ===\n")


if __name__ == "__main__":
    main()
