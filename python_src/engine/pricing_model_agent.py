from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableLambda
from langchain.schema.output_parser import StrOutputParser
from dotenv import load_dotenv
import os
import logging

# Load API key from .env file
load_dotenv(override=True)
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("Warning: OPENAI_API_KEY not found in .env file")
    api_key = input("Please enter your OpenAI API key: ")
    if not api_key:
        raise ValueError("OpenAI API key is required to continue")

# Define the OpenAI LLM
llm = ChatOpenAI(model="gpt-4", temperature=0.7, openai_api_key=api_key)

# Define a single, comprehensive prompt template
prompt = PromptTemplate(
    input_variables=["business_idea"],
    template=(
        "You are a business analyst. Analyze this business idea and provide a structured response:\n"
        "Business Idea: {business_idea}\n\n"
        "Format your response exactly like this:\n\n"
        "BUSINESS MODEL:\n"
        "[One clear sentence describing the revenue model and delivery method]\n\n"
        "PRODUCT DESCRIPTION:\n"
        "[Brief product overview]\n\n"
        "PRICING TIERS:\n"
        "Tier1 = $X\n"
        "Tier2 = $Y\n"
        "Tier3 = $Z\n\n"
        "FEATURES:\n"
        "Tier1: [basic features]\n"
        "Tier2: [premium features]\n"
        "Tier3: [enterprise features]\n\n"
        "MONTHLY REVENUE PROJECTIONS:\n"
        "Month1: T1_users, T2_users, T3_users\n"
        "Month2: T1_users, T2_users, T3_users\n"
        "Month3: T1_users, T2_users, T3_users\n\n"
        "MARKET ANALYSIS:\n"
        "- Target market size\n"
        "- Growth potential\n"
        "- Key competitive advantages\n\n"
        "Note: Be specific about the business model and how it generates revenue. "
        "Use exact number formats as shown. For monthly projections, provide comma-separated numbers."
    )
)

# Create LangChain pipeline
llm_chain = prompt | llm | StrOutputParser()

# Configure logging for this module
logger = logging.getLogger(__name__)

def generate_business_model(business_idea: str) -> str:
    """
    Generate a business model analysis for the given business idea.
    
    Args:
        business_idea (str): User's business idea description
        
    Returns:
        str: Structured analysis including business model, pricing, and projections
    """
    try:
        logger.info(f"Generating business model for idea: {business_idea}")
        response = llm_chain.invoke({"business_idea": business_idea})
        if response:
            logger.info("Successfully generated business model")
            return response
        else:
            logger.error("Empty response received from LLM chain")
            return None
        
    except Exception as e:
        print(f"Error generating business model: {e}")
        return None

def parse_llm_response(response: str) -> dict:
    """
    Parse the LLM response string into a structured dictionary.
    
    Args:
        response (str): Raw response string from LLM
        
    Returns:
        dict: Structured data containing business analysis
    """
    try:
        logger.info("Parsing LLM response")
        
        # Initialize empty structure
        parsed = {
            "market_analysis": "",
            "business_model": "",
            "pricing_tiers": {},
            "features": {},
            "product_description": "",
            "monthly_projections": {}
        }
        
        # Split response into sections
        sections = response.split('\n\n')
        current_section = ""
        
        for section in sections:
            if not section.strip():
                continue
                
            if "BUSINESS MODEL:" in section:
                parsed["business_model"] = section.replace("BUSINESS MODEL:", "").strip()
            elif "PRODUCT DESCRIPTION:" in section:
                parsed["product_description"] = section.replace("PRODUCT DESCRIPTION:", "").strip()
            elif "PRICING TIERS:" in section:
                tiers = {}
                for line in section.split('\n')[1:]:  # Skip header
                    if '=' in line:
                        tier, price = line.split('=')
                        tiers[tier.strip()] = price.strip()
                parsed["pricing_tiers"] = tiers
            elif "FEATURES:" in section:
                features = {}
                current_tier = ""
                for line in section.split('\n')[1:]:  # Skip header
                    if ':' in line:
                        tier, feature_list = line.split(':')
                        features[tier.strip()] = [f.strip() for f in feature_list.strip('[]').split(',')]
                parsed["features"] = features
            elif "MONTHLY REVENUE PROJECTIONS:" in section:
                projections = {}
                for line in section.split('\n')[1:]:  # Skip header
                    if ':' in line:
                        month, users = line.split(':')
                        projections[month.strip()] = [u.strip() for u in users.split(',')]
                parsed["monthly_projections"] = projections
            elif "MARKET ANALYSIS:" in section:
                parsed["market_analysis"] = section.replace("MARKET ANALYSIS:", "").strip()
        
        logger.info("Successfully parsed LLM response")
        return parsed
        
    except Exception as e:
        logger.error(f"Error parsing LLM response: {str(e)}")
        return {
            "market_analysis": "",
            "business_model": "",
            "pricing_tiers": {},
            "features": {},
            "product_description": "",
            "monthly_projections": {}
        }

# Test function
if __name__ == "__main__":
    test_idea = "A SaaS platform for automated social media content generation using AI"
    result = generate_business_model(test_idea)
    print(result)