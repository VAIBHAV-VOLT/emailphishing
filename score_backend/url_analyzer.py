from __future__ import annotations

import re
import socket
import ipaddress
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from urllib.parse import urlparse
from difflib import SequenceMatcher

import dns.resolver
import dns.exception

from analyzer import analyze_email


# =====================================
# CONFIGURATION
# =====================================

TRUSTED_DOMAINS = [
    "paypal.com",
    "microsoft.com",
    "amazon.com",
    "google.com",
]

RISKY_TLDS = [".xyz", ".top", ".click", ".ru", ".zip"]
SIMILARITY_THRESHOLD = 0.8

resolver = dns.resolver.Resolver()
resolver.timeout = 5.0
resolver.lifetime = 5.0
socket.setdefaulttimeout(5.0)

_dns_cache = {}


# =====================================
# DATA STRUCTURE
# =====================================

@dataclass
class URLSecurityReport:
    url: str
    domain: str
    score: int
    verdict: str
    reasons: List[str]


# =====================================
# URL EXTRACTION
# =====================================

def extract_urls(text: str) -> List[str]:
    pattern = re.compile(r"""(?ix)
        (https?://[^\s<>()"']+)
        |
        (www\.[^\s<>()"']+)
    """)
    matches = pattern.findall(text or "")
    urls = []

    for http_url, www_url in matches:
        url = http_url or f"http://{www_url}"
        urls.append(url)

    return urls


# =====================================
# DOMAIN UTILITIES
# =====================================

def get_domain(url: str) -> str:
    parsed = urlparse(url)
    return (parsed.hostname or "").lower()


def is_ip_address(host: str) -> bool:
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


def effective_domain(host: str) -> str:
    parts = host.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return host


# =====================================
# LOOKALIKE DETECTION
# =====================================

def detect_lookalike(domain: str) -> Optional[str]:
    eff = effective_domain(domain)

    for trusted in TRUSTED_DOMAINS:
        if eff == trusted or eff.endswith("." + trusted):
            return None

    best_ratio = 0.0
    best_match = None

    for trusted in TRUSTED_DOMAINS:
        ratio = SequenceMatcher(None, eff, trusted).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = trusted

    if best_match and best_ratio >= SIMILARITY_THRESHOLD:
        return f"Domain looks similar to trusted domain '{best_match}'"

    return None


# =====================================
# DNS AUTH CHECKS
# =====================================

def has_spf(domain: str) -> bool:
    key = f"spf_{domain}"
    if key in _dns_cache:
        return _dns_cache[key]

    try:
        answers = resolver.resolve(domain, "TXT")
        for r in answers:
            if "v=spf1" in r.to_text().lower():
                _dns_cache[key] = True
                return True
    except Exception:
        pass

    _dns_cache[key] = False
    return False


def has_dmarc(domain: str) -> bool:
    key = f"dmarc_{domain}"
    if key in _dns_cache:
        return _dns_cache[key]

    try:
        answers = resolver.resolve("_dmarc." + domain, "TXT")
        for r in answers:
            if "v=dmarc1" in r.to_text().lower():
                _dns_cache[key] = True
                return True
    except Exception:
        pass

    _dns_cache[key] = False
    return False


def has_dkim(domain: str) -> bool:
    key = f"dkim_{domain}"
    if key in _dns_cache:
        return _dns_cache[key]

    selectors = ["default", "selector1", "selector2", "s1", "s2"]

    for selector in selectors:
        try:
            answers = resolver.resolve(f"{selector}._domainkey.{domain}", "TXT")
            for r in answers:
                if "v=dkim1" in r.to_text().lower():
                    _dns_cache[key] = True
                    return True
        except Exception:
            continue

    _dns_cache[key] = False
    return False


def domain_resolves(domain: str) -> bool:
    key = f"ip_{domain}"
    if key in _dns_cache:
        return _dns_cache[key]

    try:
        socket.gethostbyname(domain)
        _dns_cache[key] = True
        return True
    except Exception:
        _dns_cache[key] = False
        return False


# =====================================
# SUSPICIOUS DOMAIN HEURISTICS
# =====================================

def suspicious_domain_pattern(domain: str) -> bool:
    if len(domain) > 30:
        return True
    if any(domain.endswith(tld) for tld in RISKY_TLDS):
        return True
    if sum(c.isdigit() for c in domain) >= 3:
        return True
    return False


# =====================================
# UNIFIED ANALYSIS ENGINE
# =====================================

def analyze_url(url: str) -> URLSecurityReport:
    domain = get_domain(url)
    parsed = urlparse(url)
    scheme = parsed.scheme.lower()

    score = 0
    reasons = []

    # --- URL Checks ---
    if scheme == "http":
        score += 1
        reasons.append("Uses HTTP instead of HTTPS")

    if is_ip_address(domain):
        score += 2
        reasons.append("Uses IP address instead of domain")

    lookalike = detect_lookalike(domain)
    if lookalike:
        score += 2
        reasons.append(lookalike)

    if suspicious_domain_pattern(domain):
        score += 2
        reasons.append("Suspicious domain pattern")

    # --- DNS Checks ---
    if not has_spf(domain):
        score += 1
        reasons.append("No SPF record")

    if not has_dmarc(domain):
        score += 2
        reasons.append("No DMARC record")

    if not has_dkim(domain):
        score += 1
        reasons.append("No DKIM record")

    if not domain_resolves(domain):
        score += 1
        reasons.append("Domain does not resolve")

    # --- Verdict ---
    if score <= 2:
        verdict = "Safe"
    elif score <= 5:
        verdict = "Suspicious"
    else:
        verdict = "Phishing"

    return URLSecurityReport(url, domain, score, verdict, reasons)


# =====================================
# EMAIL PIPELINE ENTRY
# =====================================

def analyze_email_security(email_file: str) -> Dict[str, object]:
    result = analyze_email(email_file)

    body = result["body"]
    urls = extract_urls(body)

    reports = [analyze_url(url) for url in urls]

    return {
        "total_urls": len(reports),
        "reports": [asdict(r) for r in reports],
    }


# =====================================
# RUN
# =====================================

if __name__ == "__main__":
    email_file = "email2.eml"

    final_report = analyze_email_security(email_file)

    print("\n=== FINAL SECURITY REPORT ===\n")
    print(final_report)
