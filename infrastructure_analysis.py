import re
import ipaddress
from email.message import Message


def extract_ips(received_headers):
    """
    Extract all IPv4 addresses from a list of Received headers.

    :param received_headers: list of header strings
    :return: list of IP address strings (may include private/loopback)
    """
    ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
    ips = []

    for header in received_headers or []:
        if not header:
            continue
        found_ips = re.findall(ip_pattern, header)
        ips.extend(found_ips)

    return ips


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
    Analyze an email.Message to extract all IPs from Received headers
    and identify the first external/public IP.

    :param msg: email.message.Message (or compatible) object
    :return: dict with keys:
             - "ips": list of all found IPs (may include private)
             - "originating_ip": first public IP, or None
    """
    received_headers = msg.get_all("Received") or []
    ips = extract_ips(received_headers)
    originating_ip = get_first_external_ip(ips)

    return {
        "ips": ips,
        "originating_ip": originating_ip,
    }

