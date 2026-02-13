"""
Automated Email Forensics Analyzer - Attachment Security Analysis Module

This module provides security analysis for email attachments from .eml files,
detecting various attack vectors and suspicious patterns. Risk score is 0-100 (capped).
"""

import email
import os
import sys
from email import policy
from typing import Dict, List, Optional, Tuple

# Default MIME type when not specified in email
DEFAULT_MIME_TYPE = "application/octet-stream"

# Constants
DANGEROUS_EXTENSIONS = {".exe", ".bat", ".cmd", ".scr", ".js", ".vbs", ".ps1", ".jar"}
MACRO_EXTENSIONS = {".docm", ".xlsm", ".pptm"}
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB
MAX_RISK_SCORE = 100  # Cap final score at 100

# CRITICAL RULES - single trigger → MALICIOUS (40+)
SCORE_DANGEROUS_EXTENSION = 45   # Dangerous executable extension
SCORE_MACRO_EXTENSION = 40       # Macro-enabled extension

# HIGH RULES - single trigger → SUSPICIOUS (15–39)
SCORE_DOUBLE_EXTENSION = 20      # Double extension attack
SCORE_MIME_MISMATCH = 15         # MIME mismatch

# MEDIUM RULES - contributes to score, typically SAFE alone
SCORE_LARGE_FILE = 8             # Large file (>20 MB)

MIME_MAP = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".exe": "application/x-msdownload",
    ".bat": "application/x-msdownload",
    ".cmd": "application/x-msdownload",
    ".scr": "application/x-msdownload",
    ".js": "application/javascript",
    ".vbs": "text/vbscript",
    ".ps1": "application/x-powershell",
    ".jar": "application/java-archive",
    ".docm": "application/vnd.ms-word.document.macroEnabled.12",
    ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
    ".pptm": "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
}


def check_dangerous_extension(filename: str) -> bool:
    """
    Check if file has a dangerous extension.
    
    Args:
        filename: Name of the file
        
    Returns:
        True if extension is dangerous, False otherwise
    """
    _, ext = os.path.splitext(filename.lower())
    return ext in DANGEROUS_EXTENSIONS


def check_double_extension(filename: str) -> bool:
    """
    Detect double extension attack pattern.
    
    Checks if filename has multiple dots AND the last extension is dangerous.
    
    Args:
        filename: Name of the file
        
    Returns:
        True if double extension attack detected, False otherwise
    """
    parts = filename.lower().split(".")
    if len(parts) < 3:  # Need at least 3 parts for double extension (e.g., "file.pdf.exe")
        return False
    
    last_ext = "." + parts[-1]
    return last_ext in DANGEROUS_EXTENSIONS


def check_mime_mismatch(filename: str, mime_type: str) -> bool:
    """
    Check if file extension matches expected MIME type.
    
    Args:
        filename: Name of the file
        mime_type: Detected MIME type
        
    Returns:
        True if mismatch detected, False otherwise
    """
    _, ext = os.path.splitext(filename.lower())
    
    if not ext:
        return False
    
    expected_mime = MIME_MAP.get(ext)
    if expected_mime is None:
        # Extension not in our mapping, can't verify
        return False
    
    # Normalize MIME types for comparison (case-insensitive)
    return expected_mime.lower() != mime_type.lower()


def check_macro_extension(filename: str) -> bool:
    """
    Check if file has Office macro-enabled extension.
    
    Args:
        filename: Name of the file
        
    Returns:
        True if macro extension detected, False otherwise
    """
    _, ext = os.path.splitext(filename.lower())
    return ext in MACRO_EXTENSIONS


def calculate_risk_score(
    dangerous_ext: bool,
    double_ext: bool,
    mime_mismatch: bool,
    macro_ext: bool,
    large_file: bool,
) -> int:
    """
    Calculate risk score (0-100, capped) using priority-based rules.
    CRITICAL: Dangerous ext 45, Macro 40 → MALICIOUS. HIGH: Double 20, MIME 15 → SUSPICIOUS.
    MEDIUM: Large file 8. Final score capped at 100.
    """
    score = 0
    if dangerous_ext:
        score += SCORE_DANGEROUS_EXTENSION
    if macro_ext:
        score += SCORE_MACRO_EXTENSION
    if double_ext:
        score += SCORE_DOUBLE_EXTENSION
    if mime_mismatch:
        score += SCORE_MIME_MISMATCH
    if large_file:
        score += SCORE_LARGE_FILE
    return min(score, MAX_RISK_SCORE)


def get_verdict(risk_score: int) -> str:
    """
    Verdict from score out of 100.
    CRITICAL-level scores (40+) → MALICIOUS; HIGH-level (15–39) → SUSPICIOUS; else SAFE.
    """
    if risk_score >= 40:
        return "MALICIOUS"
    if risk_score >= 15:
        return "SUSPICIOUS"
    return "SAFE"


def analyze_attachment(filename: str, file_bytes: bytes, mime_type: str) -> Dict:
    """
    Analyze email attachment for security risks.
    
    Performs multiple security checks including extension analysis,
    MIME type validation, and file size checks.
    
    Args:
        filename: Name of the attachment file
        file_bytes: Raw file content as bytes
        mime_type: Detected MIME type of the file
        
    Returns:
        Dictionary with filename, mime_type, size_bytes, checks, risk_score (0-100), verdict.
    """
    size_bytes = len(file_bytes)
    dangerous_ext = check_dangerous_extension(filename)
    double_ext = check_double_extension(filename)
    mime_mismatch = check_mime_mismatch(filename, mime_type)
    macro_ext = check_macro_extension(filename)
    large_file = size_bytes > MAX_FILE_SIZE_BYTES

    risk_score = calculate_risk_score(
        dangerous_ext=dangerous_ext,
        double_ext=double_ext,
        mime_mismatch=mime_mismatch,
        macro_ext=macro_ext,
        large_file=large_file,
    )
    verdict = get_verdict(risk_score)

    result = {
        "filename": filename,
        "mime_type": mime_type,
        "size_bytes": size_bytes,
        "checks": {
            "dangerous_extension": dangerous_ext,
            "double_extension": double_ext,
            "mime_mismatch": mime_mismatch,
            "macro_extension": macro_ext,
            "large_file": large_file,
        },
        "risk_score": risk_score,
        "verdict": verdict,
    }
    return result


def extract_attachments_from_eml(eml_path: str) -> List[Tuple[str, bytes, str]]:
    """
    Parse a .eml file and extract all attachments.
    
    Args:
        eml_path: Path to the .eml file.
        
    Returns:
        List of (filename, file_bytes, mime_type) for each attachment.
        Filename may be empty; mime_type defaults to application/octet-stream.
    """
    attachments: List[Tuple[str, bytes, str]] = []
    
    with open(eml_path, "rb") as f:
        msg = email.message_from_binary_file(f, policy=policy.default)
    
    for part in msg.walk():
        content_disposition = (part.get("Content-Disposition") or "").lower()
        filename = part.get_filename()
        if filename:
            filename = filename.strip()
        elif "attachment" in content_disposition:
            filename = "unnamed_attachment"
        else:
            continue
        
        payload = part.get_payload(decode=True)
        if payload is None:
            payload = b""
        content_type = part.get_content_type() or DEFAULT_MIME_TYPE
        attachments.append((filename, payload, content_type))
    
    return attachments


def analyze_eml(eml_path: str) -> List[Dict]:
    """
    Analyze all attachments in a .eml file.
    Use this from main.py or any caller: pass path to .eml, get list of results in standard format.

    Args:
        eml_path: Path to the .eml file.

    Returns:
        List of dicts, one per attachment. Each dict has:
        - filename: str
        - mime_type: str
        - size_bytes: int
        - checks: { dangerous_extension, double_extension, mime_mismatch, macro_extension, large_file }
        - risk_score: int (0-100)
        - verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS"

    Raises:
        FileNotFoundError: If eml_path does not exist.
        ValueError: If path does not end with .eml.
    """
    if not os.path.isfile(eml_path):
        raise FileNotFoundError(f"EML file not found: {eml_path}")
    if not eml_path.lower().endswith(".eml"):
        raise ValueError("Input file must have .eml extension")
    results: List[Dict] = []
    for filename, file_bytes, mime_type in extract_attachments_from_eml(eml_path):
        results.append(analyze_attachment(filename, file_bytes, mime_type))
    return results


def analyze_eml_highest_risk(eml_path: str) -> Optional[Dict]:
    """
    Analyze all attachments in a .eml file and return only the one with the highest risk score.
    Same dict format as analyze_eml; returns None if the email has no attachments.

    Args:
        eml_path: Path to the .eml file.

    Returns:
        The single analysis result dict with the highest risk_score, or None if no attachments.
    """
    results = analyze_eml(eml_path)
    if not results:
        return None
    return max(results, key=lambda r: r["risk_score"])


if __name__ == "__main__":
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python attachment_analyzer.py <path_to.eml>")
        print("  Analyzes all attachments in the given .eml file.")
        sys.exit(1)
    
    eml_path = sys.argv[1]
    if not os.path.isfile(eml_path):
        print(f"Error: File not found: {eml_path}")
        sys.exit(1)
    if not eml_path.lower().endswith(".eml"):
        print("Error: File must have .eml extension.")
        sys.exit(1)
    
    try:
        results = analyze_eml(eml_path)
        if not results:
            print("No attachments found in this email.")
            sys.exit(0)
        print(f"Analyzed {len(results)} attachment(s) from {eml_path}\n")
        for i, result in enumerate(results, 1):
            print("=" * 60)
            print(f"Attachment {i}: {result['filename']}")
            print("=" * 60)
            print(json.dumps(result, indent=2))
            print(f"\nVerdict: {result['verdict']}  |  Risk Score: {result['risk_score']}/100\n")
    except Exception as e:
        print(f"Error during analysis: {e}")
        sys.exit(1)
