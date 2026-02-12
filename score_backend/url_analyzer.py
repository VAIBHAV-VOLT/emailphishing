from __future__ import annotations

import ipaddress
import re
from dataclasses import dataclass, asdict
from difflib import SequenceMatcher
from typing import Dict, List, Optional
from urllib.parse import urlparse, ParseResult

# 🔴 Import the email analyzer you already built
from analyzer import analyze_email


# -------------------------------
# Trusted domains for comparison
# -------------------------------
TRUSTED_DOMAINS: List[str] = [
    "paypal.com",
    "microsoft.com",
    "amazon.com",
    "google.com",
]

SIMILARITY_THRESHOLD: float = 0.8


# -------------------------------
# Data structure for results
# -------------------------------
@dataclass
class URLAnalysis:
    original: str
    domain: str
    scheme: str
    suspicious: bool
    reasons: List[str]


# -------------------------------
# Extract URLs from text
# -------------------------------
def extract_urls(text: str) -> List[str]:
    url_pattern = re.compile(
        r"""(?ix)
        (https?://[^\s<>()"']+)
        |
        (www\.[^\s<>()"']+)
        """
    )

    matches = url_pattern.findall(text or "")
    urls: List[str] = []

    for http_url, www_url in matches:
        url = http_url or www_url
        if www_url and not http_url:
            url = f"http://{www_url}"
        urls.append(url)

    return urls


def parse_domain(parsed: ParseResult) -> str:
    hostname = parsed.hostname or ""
    return hostname.lower()


def is_ip_address(host: str) -> bool:
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


def _effective_domain(host: str) -> str:
    parts = host.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return host


def detect_lookalike_domain(domain: str, trusted_domains: List[str]) -> Optional[str]:
    if not domain:
        return None

    eff = _effective_domain(domain)

    for trusted in trusted_domains:
        if eff == trusted or eff.endswith("." + trusted):
            return None

    best_ratio = 0.0
    best_match: Optional[str] = None

    for trusted in trusted_domains:
        ratio = SequenceMatcher(None, eff, trusted).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = trusted

    if best_match and best_ratio >= SIMILARITY_THRESHOLD:
        return (
            f"Domain '{domain}' looks similar to trusted domain "
            f"'{best_match}' (similarity {best_ratio:.2f})"
        )

    return None


def analyze_single_url(url: str) -> URLAnalysis:
    parsed = urlparse(url)
    domain = parse_domain(parsed)
    scheme = (parsed.scheme or "").lower()

    reasons: List[str] = []

    if scheme == "http":
        reasons.append("Uses HTTP instead of HTTPS")

    if is_ip_address(domain):
        reasons.append("Uses IP address instead of domain name")

    lookalike_reason = detect_lookalike_domain(domain, TRUSTED_DOMAINS)
    if lookalike_reason:
        reasons.append(lookalike_reason)

    return URLAnalysis(
        original=url,
        domain=domain,
        scheme=scheme,
        suspicious=bool(reasons),
        reasons=reasons,
    )


def analyze_email_urls(email_body: str) -> Dict[str, object]:
    urls = extract_urls(email_body)

    analyzed: List[URLAnalysis] = [analyze_single_url(url) for url in urls]
    suspicious_count = sum(1 for a in analyzed if a.suspicious)

    return {
        "total_urls": len(analyzed),
        "urls": [asdict(a) for a in analyzed],
        "suspicious_count": suspicious_count,
    }


# -------------------------------
# MAIN RUNNER (Pipeline Entry)
# -------------------------------
if __name__ == "__main__":
    # 🔵 Step 1: Use your analyzer to parse the .eml file
    analysis = analyze_email("email2.eml")

    email_body = analysis["body"]
    metadata = analysis["metadata"]  # available if needed later

    # 🔵 Step 2: Run URL analysis on real email content
    url_result = analyze_email_urls(email_body)

    print("=== METADATA SUMMARY ===")
    print(f"From Domain: {metadata.get('from_domain')}")
    print(f"Reply-To Mismatch: {metadata.get('reply_to_mismatch')}")

    print("\n=== URL ANALYSIS ===")
    print(url_result)
