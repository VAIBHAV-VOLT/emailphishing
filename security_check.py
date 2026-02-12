import socket
from urllib.parse import urlparse
import dns.resolver

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
    try:
        answers = dns.resolver.resolve(domain, "TXT")
        for r in answers:
            if "v=spf1" in r.to_text().lower():
                return True
    except Exception:
        pass
    return False


# -------------------------------
# DMARC Check
# -------------------------------
def has_dmarc(domain: str) -> bool:
    try:
        answers = dns.resolver.resolve("_dmarc." + domain, "TXT")
        for r in answers:
            if "v=dmarc1" in r.to_text().lower():
                return True
    except Exception:
        pass
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
    try:
        ip = socket.gethostbyname(domain)
        socket.gethostbyaddr(ip)
        return False
    except Exception:
        return True


# -------------------------------
# Risk Scoring (same logic)
# -------------------------------
def analyze_domain(domain: str):
    spf = has_spf(domain)
    dmarc = has_dmarc(domain)
    suspicious = suspicious_domain(domain)
    unknown = unknown_ip(domain)

    score = 0
    if not spf:
        score += 1
    if not dmarc:
        score += 2
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

    return score, verdict, spf, dmarc, suspicious, unknown


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

        score, verdict, spf, dmarc, suspicious, unknown = analyze_domain(
            domain)

        print("\n--------------------------------")
        print("URL:", url)
        print("Domain:", domain)
        print("SPF Present:", spf)
        print("DMARC Present:", dmarc)
        print("Suspicious Pattern:", suspicious)
        print("Resolvable Host:", not unknown)
        print("Risk Score:", score)
        print("Verdict:", verdict)

    print("\n=== Analysis Complete ===\n")


if __name__ == "__main__":
    main()
