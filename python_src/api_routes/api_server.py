from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv
import logging
import os
from pricing_model_agent import generate_business_model, parse_llm_response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from root folder
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize Flask API app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Flask-Caching
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Yo! You are calling a non-existing endpoint!"}), 404

@app.route('/api/analyze', methods=['POST'])
def analyze_business_idea():
    try:
        # Extract business idea from request
        data = request.json
        if not data or 'business_idea' not in data:
            return jsonify({"error": "Missing 'business_idea' in request body"}), 400

        business_idea = data['business_idea']

        # Store the idea in cache
        cache.set('current_business_idea', business_idea)
        cache.set('analysis_status', 'processing')

        # Process using the existing function from pricing_model_agent.py
        llm_response = generate_business_model(business_idea)

        if llm_response:
            # Parse the response
            parsed_data = parse_llm_response(llm_response)
            cache.set('current_analysis', parsed_data)
            cache.set('analysis_status', 'complete')
        else:
            cache.set('analysis_status', 'failed')
            cache.set('analysis_error', "Failed to generate business model")

        return jsonify({
            "status": "accepted",
            "message": "Business model analysis in progress"
        }), 202  # 202 Accepted
    except Exception as e:
        cache.set('analysis_status', 'failed')
        cache.set('analysis_error', str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/market_analysis', methods=['GET'])
def get_market_analysis():
    # Check status
    status = cache.get('analysis_status')

    if status == 'processing':
        return jsonify({
            "status": "processing",
            "message": "Analysis still in progress"
        }), 200

    if status == 'failed':
        return jsonify({
            "status": "failed",
            "error": cache.get('analysis_error')
        }), 500

    # Get the analysis result
    analysis = cache.get('current_analysis')

    if not analysis:
        return jsonify({
            "status": "not_found",
            "message": "No analysis found. Submit a business idea first."
        }), 404

    return jsonify({
        "status": "complete",
        "business_idea": cache.get('current_business_idea'),
        "market_analysis": analysis.get('market_analysis', ''),
        "business_model": analysis.get('business_model', ''),
        "pricing_tiers": analysis.get('pricing_tiers', {}),
        "features": analysis.get('features', {}),
        "product_description": analysis.get('product_description', ''),
        "monthly_projections": analysis.get('monthly_projections', {})
    }), 200

if __name__ == '__main__':
    logger.info("Starting API server...")
    app.run(debug=True, port=5002, host='0.0.0.0')