import re
import ipaddress
from email.message import Message


def extract_ips(metadata):
    """
    Extract all IPv4 addresses from email metadata.

    :param metadata: dict containing email metadata (from extract_metadata)
    :return: list of IP address strings (may include private/loopback)
    """
    ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
    ips = []

    # Extract from Received headers
    received_headers = metadata.get("received") or []
    for header in received_headers:
        if not header:
            continue
        found_ips = re.findall(ip_pattern, header)
        ips.extend(found_ips)

    # Extract from X-Originating-IP header
    x_originating_ip = metadata.get("x_originating_ip")
    if x_originating_ip:
        found_ips = re.findall(ip_pattern, x_originating_ip)
        ips.extend(found_ips)

    # Remove duplicates while preserving order
    seen = set()
    unique_ips = []
    for ip in ips:
        if ip not in seen:
            seen.add(ip)
            unique_ips.append(ip)

    return unique_ips


def get_first_external_ip(ip_list):
    """
    Return the first public (non-private, non-loopback) IPv4 address from a list.

    :param ip_list: list of IP address strings
    :return: first external IP as string, or None if none found
    """
    for ip in ip_list or []:
        try:
            ip_obj = ipaddress.ip_address(ip)
            # Skip private and loopback addresses
            if not ip_obj.is_private and not ip_obj.is_loopback:
                return ip
        except ValueError:
            # Skip invalid IPs
            continue
    return None


def analyze_received_headers(msg: Message):
    """
    Analyze an email.Message to extract all IPs from metadata
    and identify the first external/public IP.

    :param msg: email.message.Message (or compatible) object
    :return: dict with keys:
             - "ips": list of all found IPs (may include private)
             - "originating_ip": first public IP, or None
    """
    from analyzer import extract_metadata
    
    metadata = extract_metadata(msg)
    ips = extract_ips(metadata)
    originating_ip = get_first_external_ip(ips)

    return {
        "ips": ips,
        "originating_ip": originating_ip,
    }


# Main execution
if __name__ == "__main__":
    # Import here to avoid circular imports
    from analyzer import analyze_email, load_email
    
    # Analyze email from analyzer
    email_result = analyze_email("email2.eml")
    
    # Extract message object for IP analysis
    msg = load_email("email2.eml")
    
    # Perform IP analysis
    ip_analysis = analyze_received_headers(msg)
    
    print("=== IP ANALYSIS ===")
    print(f"All IPs found: {ip_analysis['ips']}")
    print(f"Originating IP: {ip_analysis['originating_ip']}")
    
    print("\n=== EMAIL METADATA ===")
    for key, value in email_result["metadata"].items():
        print(f"{key}: {value}")
    
    print("\n=== URLS FOUND ===")
    for url in email_result["urls"]:
        print(url)

