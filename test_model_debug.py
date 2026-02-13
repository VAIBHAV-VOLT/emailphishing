#!/usr/bin/env python3
"""Test script to debug the Hugging Face model output"""

import sys
sys.path.insert(0, 'phishingtool')

print('Testing Hugging Face model...\n')

test_email = '''Dear Customer,

Your Bank Account is under serious investigation for fraud activity!!!

You must CLICK BELOW NOW or your account funds will be frozen permanently.

http://bank-secure-login-update.free-account-access.ru

To unlock your account send:
• Password
• OTP Code
• Full Card Details
• CVV

Do not ignore this message. This is final notification.

Bank Security Alert Team
bank.support.alerts@free-account-access.ru
'''

# Test the model directly
from transformers import pipeline

MODEL_NAME = 'mariagrandury/roberta-base-finetuned-sms-spam-detection'

try:
    print(f'Loading model: {MODEL_NAME}')
    classifier = pipeline('text-classification', model=MODEL_NAME, truncation=True, max_length=512, device=-1)
    print('Model loaded successfully!\n')
    
    print('Test email:')
    print('-' * 60)
    print(test_email)
    print('-' * 60)
    
    results = classifier(test_email[:2000])
    print(f'\nRaw model output:')
    print(f'  Label: "{results[0]["label"]}"')
    print(f'  Score: {results[0]["score"]}')
    print(f'  Label type: {type(results[0]["label"])}')
    
    # Now test with our analyzer function
    print('\n' + '='*60)
    print('Testing with huggingface_analyzer.py:')
    print('='*60)
    
    from huggingface_analyzer import analyze_email_body_with_transformers
    
    result = analyze_email_body_with_transformers(test_email)
    print(f'\nAnalyzer output:')
    print(f'  Model Score: {result["model_score"]}/10')
    print(f'  Label: {result["label"]}')
    print(f'  Confidence: {result["confidence"]}')
    print(f'  Model Used: {result["model_used"]}')
    
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
