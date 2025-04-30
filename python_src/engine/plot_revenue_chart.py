from flask import Flask, render_template, request, redirect, url_for, flash, Blueprint
import matplotlib.pyplot as plt
import io
import base64
import numpy as np
import os
from pricing_model_agent import generate_business_model
from pricing_tiers_parser import get_initial_pricing, parse_llm_output
from business_models import BusinessModel
from typing import Dict, List, Optional

# Create blueprint with template folder configuration
main = Blueprint('main', __name__, 
                template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'))

# Initialize global variables
current_business = BusinessModel(
    idea="",
    model_description="",
    pricing_tiers={'Tier1': 99.0},  # Use direct value instead of function call
    features={'Tier1': []},
    market_analysis=""
)

# Initialize revenue data with revenue and user counts for a single tier
revenue_data = [
    [f'Month{i+1}', 0.0, 0] for i in range(12)  # [month, revenue, users]
]

def calculate_monthly_revenue(pricing: Dict[str, float], initial_users: Dict[str, int], monthly_growth: int = 100) -> List[List]:
    """
    Calculate 12 months of revenue with linear user growth for single tier.
  
    Args:
        pricing: Dictionary of tier prices
        initial_users: Dictionary of initial users per tier
        monthly_growth: Number of new users added per month (default: 100)
      
    Returns:
        List of monthly revenue data with user counts
    """
    monthly_data = []
    current_users = initial_users['Tier1']
  
    for i in range(12):
        revenue = current_users * pricing['Tier1']
        monthly_data.append([
            f'Month{i+1}',
            revenue,
            current_users
        ])
        current_users += monthly_growth
  
    return monthly_data

def generate_chart(save_to_file: bool = False, file_path: str = "chart_preview.png"):
    """Generate a bar chart of revenue data with user count line."""
    # Create figure with two y-axes
    fig, ax1 = plt.subplots(figsize=(15, 8))
    ax2 = ax1.twinx()

    # Extract data for plotting
    months = [row[0] for row in revenue_data]
    revenues = [row[1] for row in revenue_data]
    users = [row[2] for row in revenue_data]

    # Set width of bars and positions
    width = 0.35
    x = np.arange(len(months))

    # Create revenue bars
    bars = ax1.bar(x, revenues, width, label='Tier 1 Revenue', color='#007bff')

    # Create user count line
    line = ax2.plot(x, users, 'r--', label='Tier 1 Users', linewidth=2)

    # Customize chart
    ax1.set_xlabel('Months')
    ax1.set_ylabel('Revenue ($)')
    ax2.set_ylabel('Number of Users')
    plt.title('Monthly Revenue and User Growth')
    ax1.set_xticks(x)
    ax1.set_xticklabels(months, rotation=45)

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height,
                f'${height:,.0f}',
                ha='center', va='bottom', rotation=90)

    # Combine legends
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

    # Adjust layout
    plt.tight_layout()

    if save_to_file:
        # Save plot to file
        plt.savefig(file_path, format='png', bbox_inches='tight')
        plt.close()
        return file_path

    # Convert plot to base64 string
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    plt.close()

    return plot_url
  
def parse_features(llm_output: str) -> Dict[str, List[str]]:
    """
    Parse features for each pricing tier from LLM output.
  
    Args:
        llm_output (str): The structured output from the LLM
      
    Returns:
        Dict[str, List[str]]: Dictionary mapping tier names to feature lists
    """
    features = {}
    try:
        # Split into sections and find features section
        sections = llm_output.split('\n\n')
        features_section = next(s for s in sections if 'FEATURES:' in s)
      
        # Process each line in the features section
        current_tier = None
        for line in features_section.split('\n')[1:]:  # Skip the "FEATURES:" header
            if ':' in line:
                # This is a tier header
                current_tier = line.split(':')[0].strip()
                features[current_tier] = []
            elif current_tier and line.strip():
                # This is a feature for the current tier
                features[current_tier].append(line.strip())
      
        return features
    except Exception as e:
        print(f"Error parsing features: {e}")
        return {
            'Tier1': ['Basic features not available'],
            'Tier2': ['Premium features not available'],
            'Tier3': ['Enterprise features not available']
        }  
  
def parse_market_analysis(llm_output: str) -> str:
    """
    Parse market analysis section from LLM output.
  
    Args:
        llm_output (str): The structured output from the LLM
      
    Returns:
        str: The parsed market analysis text
    """
    try:
        sections = llm_output.split('\n\n')
        analysis_section = next(s for s in sections if 'MARKET ANALYSIS:' in s)
        return analysis_section.replace('MARKET ANALYSIS:', '').strip()
    except Exception as e:
        print(f"Error parsing market analysis: {e}")
        return "Market analysis not available" 

# Move routes to blueprint
@main.route('/')
def index():
    chart = generate_chart()
    return render_template('pages/dashboard.html',
                         chart=chart,
                         business=current_business,
                         success=request.args.get('success', False),
                         error=request.args.get('error', None))

@main.route('/process_idea', methods=['POST'])
def process_idea():
    business_idea = request.form['business_idea']
  
    try:
        # Generate business model using LLM
        llm_output = generate_business_model(business_idea)
      
        if not llm_output:
            flash('Failed to generate business model', 'error')
            return redirect(url_for('main.index', error="Failed to generate business model"))
      
        try:
            # Parse the LLM output
            pricing, model_description = parse_llm_output(llm_output)
          
            # Set initial users for Tier1
            initial_users = {'Tier1': 100}
          
            # Calculate revenue projection
            global revenue_data
            revenue_data = calculate_monthly_revenue(
                pricing=pricing,
                initial_users=initial_users,
                monthly_growth=100
            )
          
            # Update business model
            global current_business
            current_business = BusinessModel(
                idea=business_idea,
                pricing_tiers=pricing,
                features=parse_features(llm_output),
                market_analysis=parse_market_analysis(llm_output),
                model_description=model_description
            )
          
            flash('Business model generated successfully!', 'success')
            return redirect(url_for('main.index', success=True))
          
        except ValueError as e:
            flash(f'Error parsing business model: {str(e)}', 'error')
            return redirect(url_for('main.index', error=str(e)))
          
    except Exception as e:
        print(f"Error processing business idea: {e}")
        flash(f'Error: {str(e)}', 'error')
        return redirect(url_for('main.index', error="Error processing business idea"))

# Initialize Flask app after all routes are defined
app = Flask(__name__,
           static_folder=os.path.join(os.path.dirname(__file__), '..', 'static'),
           static_url_path='/static')
app.secret_key = 'your-secret-key-here'

# Register blueprint
app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')