import re
from typing import Tuple, List, Dict

# Define constants
DEFAULT_TIER1_PRICE = 99.0
DEFAULT_MONTHLY_GROWTH = 100

def get_initial_pricing() -> Dict[str, float]:
    """
    Get initial pricing structure with default Tier1 price.
    
    Returns:
        Dict[str, float]: Initial pricing dictionary
    """
    return {'Tier1': DEFAULT_TIER1_PRICE}

from typing import Dict, List, Tuple

def parse_llm_output(output_text: str) -> Tuple[Dict[str, float], str]:
    """Parse pricing tiers and model description from LLM output."""
    pricing = {'Tier1': 99.0}  # Default pricing
    model_description = "Subscription-Based Revenue Model"  # Default description
    
    try:
        sections = output_text.split('\n\n')
        
        # Parse business model description
        model_section = next((s for s in sections if 'BUSINESS MODEL:' in s), None)
        if model_section:
            lines = model_section.split('\n')
            if len(lines) > 1:
                model_description = lines[1].strip()
        
        # Parse pricing tiers
        pricing_section = next((s for s in sections if 'PRICING TIERS:' in s), None)
        if pricing_section:
            for line in pricing_section.split('\n')[1:]:
                if '=' in line:
                    tier, price = line.split('=')
                    price_value = float(price.strip().replace('$', ''))
                    pricing[tier.strip()] = price_value
                    
        return pricing, model_description
    except Exception as e:
        print(f"Error parsing LLM output: {e}")
        return pricing, model_description

def parse_features(llm_output: str) -> Dict[str, List[str]]:
    """Parse features for each pricing tier from LLM output."""
    features = {}
    try:
        sections = llm_output.split('\n\n')
        features_section = next(s for s in sections if 'FEATURES:' in s)
        
        current_tier = None
        for line in features_section.split('\n')[1:]:
            if ':' in line:
                current_tier = line.split(':')[0].strip()
                features[current_tier] = []
            elif current_tier and line.strip():
                features[current_tier].append(line.strip())
        
        return features
    except Exception as e:
        print(f"Error parsing features: {e}")
        return {'Tier1': ['Basic features']}

def parse_market_analysis(llm_output: str) -> str:
    """Parse market analysis section from LLM output."""
    try:
        sections = llm_output.split('\n\n')
        analysis_section = next(s for s in sections if 'MARKET ANALYSIS:' in s)
        return analysis_section.replace('MARKET ANALYSIS:', '').strip()
    except Exception as e:
        print(f"Error parsing market analysis: {e}")
        return "Market analysis not available"