from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv
import logging
import os
import sys
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from python_src.engine.pricing_model_agent import generate_business_model, parse_llm_response

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

@app.route("/api/python")
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/analyze', methods=['POST'])
def analyze_business_idea():
    try:
        data = request.json
        if not data or 'business_idea' not in data:
            return jsonify({"error": "Missing 'business_idea' in request body"}), 400

        business_idea = data['business_idea']
        cache.set('current_business_idea', business_idea)
        cache.set('analysis_status', 'processing')

        llm_response = generate_business_model(business_idea)

        if llm_response:
            parsed_data = parse_llm_response(llm_response)
            cache.set('current_analysis', parsed_data)
            cache.set('analysis_status', 'complete')
        else:
            cache.set('analysis_status', 'failed')
            cache.set('analysis_error', "Failed to generate business model")

        return jsonify({
            "status": "accepted",
            "message": "Business model analysis in progress"
        })
    except Exception as e:
        logger.error(f"Error analyzing business idea: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/market_analysis', methods=['GET'])
def get_market_analysis():
    analysis_status = cache.get('analysis_status')
    if not analysis_status:
        return jsonify({"error": "No analysis in progress"}), 404
    
    if analysis_status == 'processing':
        return jsonify({"status": "processing"})
    
    if analysis_status == 'failed':
        error = cache.get('analysis_error', 'Unknown error')
        return jsonify({"status": "failed", "error": error})
    
    analysis = cache.get('current_analysis')
    return jsonify({"status": "complete", "data": analysis})

if __name__ == "__main__":
    logger.info("Starting API server...")
    app.run(host='127.0.0.1', port=5328)