"""
Hugging Face Pre-trained Model Integration
Uses a model specifically trained for phishing/spam detection
"""

from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import warnings

warnings.filterwarnings('ignore')

# Initialize the phishing detection pipeline
# Using a model trained on email spam/phishing detection
MODEL_NAME = "mariagrandury/roberta-base-finetuned-sms-spam-detection"

try:
    # Load pre-trained model specifically for spam/phishing detection
    # This model is fine-tuned on spam email detection
    classifier = pipeline(
        "text-classification",
        model=MODEL_NAME,
        truncation=True,
        max_length=512,
        device=-1  # Use CPU, set to 0 for GPU
    )
    MODEL_LOADED = True
    print(f"✅ Loaded phishing detection model: {MODEL_NAME}")
except Exception as e:
    print(f"⚠️  Could not load pre-trained phishing model: {e}")
    print("Falling back to basic text analysis")
    MODEL_LOADED = False


def analyze_email_body_with_transformers(email_body):
    """
    Analyze email body using pre-trained phishing detection model.
    
    :param email_body: str, the email body text
    :return: dict with model_score (0-10) and label
    """
    if not email_body or not email_body.strip():
        return {
            "model_score": 0,
            "label": "No Content",
            "confidence": 0.0,
            "model_used": "pre-trained"
        }
    
    try:
        if not MODEL_LOADED:
            return analyze_email_body_fallback(email_body)
        
        # Truncate to first 512 tokens for efficiency
        truncated_body = email_body[:2000]
        
        # Get predictions from the model
        results = classifier(truncated_body)
        
        # Parse results
        label = results[0]['label']
        confidence = results[0]['score']
        
        # Convert to phishing score (0-10)
        # Model outputs: SPAM (high risk) or HAM (low risk)
        if label.upper() == 'SPAM':
            model_score = confidence * 10
        else:
            model_score = (1 - confidence) * 10
        
        return {
            "model_score": round(model_score, 2),
            "label": label,
            "confidence": round(confidence, 4),
            "model_used": MODEL_NAME.split('/')[-1]
        }
    
    except Exception as e:
        print(f"Error analyzing with model: {e}")
        return analyze_email_body_fallback(email_body)


def analyze_email_body_fallback(email_body):
    """
    Fallback text analysis using heuristics if model fails to load.
    
    :param email_body: str, the email body text
    :return: dict with analysis results
    """
    phishing_indicators = [
        'verify your account', 'confirm your identity', 'update your password',
        'click here immediately', 'urgent action required', 'unusual activity',
        'locked account', 'suspicious activity detected', 'act now',
        'limited time offer', 'validate credentials', 'confirm payment',
        'bank account', 'credit card', 'social security',
        're-enter your password', 'confirm account', 'verify identity',
        'update payment method', 'confirm login', 'reset password',
        'unauthorized access', 'account will be closed', 'security alert'
    ]
    
    score = 0
    indicators_found = 0
    email_lower = email_body.lower()
    
    # Check for phishing keywords
    for indicator in phishing_indicators:
        if indicator in email_lower:
            score += 1.5
            indicators_found += 1
    
    # Check for URL shorteners and suspicious patterns
    if 'bit.ly' in email_lower or 'tinyurl' in email_lower or 'short.url' in email_lower:
        score += 2
        indicators_found += 1
    
    # Check for excessive urgency
    urgent_words = email_lower.count('urgent') + email_lower.count('immediately') + email_lower.count('act now')
    if urgent_words > 2:
        score += 1.5
    
    # Normalize score to 0-10
    model_score = min(score, 10)
    
    return {
        "model_score": round(model_score, 2),
        "label": "Heuristic Analysis",
        "confidence": 0.0,
        "indicators_found": indicators_found,
        "model_used": "fallback"
    }


def get_transformer_score(email_body):
    """
    Simple wrapper to get just the score from transformer analysis.
    
    :param email_body: str, the email body text
    :return: float, score from 0-10
    """
    result = analyze_email_body_with_transformers(email_body)
    return result.get("model_score", 0)


# Main execution for testing
if __name__ == "__main__":
    test_email = """
    Dear Valued Customer,
    
    We have detected unusual activity on your account. You must verify your account 
    immediately to avoid suspension. Click here urgently to confirm your identity 
    and update your password.
    
    Best regards,
    Security Team
    """
    
    print("Analyzing test email with pre-trained phishing detection model...")
    result = analyze_email_body_with_transformers(test_email)
    
    print(f"\nModel Score: {result['model_score']}/10")
    print(f"Label: {result['label']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Model Used: {result['model_used']}")
