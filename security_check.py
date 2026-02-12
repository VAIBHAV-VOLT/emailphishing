import sys
import socket
from urllib.parse import urlparse

import dns.resolver


def get_domain(target):
    if "://" not in target:
        return target.split("/")[0].split(":")[0].lower()
    parsed = urlparse(target)
    return (parsed.netloc or parsed.path).split(":")[0].lower()


def has_spf(domain):
    try:
        answers = dns.resolver.resolve(domain, "TXT")
        for r in answers:
            if "v=spf1" in r.to_text().lower():
                return True
    except Exception:
        pass
    return False


def has_dmarc(domain):
    try:
        answers = dns.resolver.resolve("_dmarc." + domain, "TXT")
        for r in answers:
            if "v=dmarc1" in r.to_text().lower():
                return True
    except Exception:
        pass
    return False


def suspicious_domain(domain):
    risky_tlds = [".xyz", ".top", ".click", ".ru", ".zip"]
    if len(domain) > 30:
        return True
    if any(domain.endswith(tld) for tld in risky_tlds):
        return True
    if sum(c.isdigit() for c in domain) >= 3:
        return True
    return False


def unknown_ip(domain):
    try:
        ip = socket.gethostbyname(domain)
        socket.gethostbyaddr(ip)
        return False
    except Exception:
        return True


def main():
    if len(sys.argv) < 2:
        print("Usage: python checker.py <domain_or_url>")
        return

    domain = get_domain(sys.argv[1])

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

    print()
    print("Target :", domain)
    print("Score  :", score)
    print("Result :", verdict)


if __name__ == "__main__":
    main()