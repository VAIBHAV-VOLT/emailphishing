
import sys
import os
import json

# Add current directory to path so we can import modules
sys.path.insert(0, 'phishingtool')

from score_calculator import calculate_comprehensive_phishing_score

def test_score_calculator():
    email_file = 'email2.eml'
    if not os.path.exists(email_file):
        print(f"Error: {email_file} not found.")
        return

    print(f"Testing score calculator with {email_file}...")
    result = calculate_comprehensive_phishing_score(email_file)

    if result:
        print("\nResult keys:")
        print(result.keys())
        
        print("\nChecking for 'from_address' and 'to_address'...")
        if 'from_address' in result and 'to_address' in result:
            print(f"SUCCESS: 'from_address' found: {result['from_address']}")
            print(f"SUCCESS: 'to_address' found: {result['to_address']}")
        else:
            print("FAILURE: 'from_address' or 'to_address' missing in result.")
    else:
        print("Error: calculate_comprehensive_phishing_score returned None.")

if __name__ == "__main__":
    test_score_calculator()
