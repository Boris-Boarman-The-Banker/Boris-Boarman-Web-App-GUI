from dataclasses import dataclass, field
from typing import Dict, List, Optional

@dataclass
class BusinessModel:
    """Business model data structure populated from LLM analysis."""
    idea: str
    model_description: str  # Removed default to ensure LLM provides description
    pricing_tiers: Dict[str, float]
    features: Dict[str, List[str]]
    product_description: str = field(default="")  # New field from LLM
    market_analysis: Optional[str] = None
    monthly_projections: Dict[str, List[int]] = field(default_factory=lambda: {})
