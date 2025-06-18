from flask import Flask, jsonify, request
from flask_cors import CORS
from app.reader import extract_bill_data
import logging
from datetime import datetime
from app.analyzeBills import get_extracted_text,answer_from_image_text
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def home():
    return "Hello from Flask Server!"

@app.route("/image-reader", methods=["POST"])
def image_reader_post():
    """
    Endpoint for processing bill images and extracting structured data
    Accepts: multipart/form-data with 'file' field containing the image
    Returns: JSON with extracted bill data
    """

    if 'files' not in request.files:
        logger.error("No file part in request")
        return jsonify({
            'success': False,
            'error': 'No file uploaded',
            'timestamp': datetime.now().isoformat()
        }), 400

    image_file = request.files['files']
    
    if image_file.filename == '':
        logger.error("No selected file")
        return jsonify({
            'success': False,
            'error': 'No file selected',
            'timestamp': datetime.now().isoformat()
        }), 400

    allowed_extensions = {'png', 'jpg', 'jpeg', 'pdf'}
    if '.' not in image_file.filename or \
       image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        logger.error(f"Invalid file type: {image_file.filename}")
        return jsonify({
            'success': False,
            'error': 'Invalid file type. Allowed: png, jpg, jpeg, pdf',
            'timestamp': datetime.now().isoformat()
        }), 400

    try:
        logger.info(f"Processing file: {image_file.filename}")
        
        image_blob = image_file.read()
        bill_data = extract_bill_data(image_blob)
        
        logger.info("Successfully extracted bill data")
        
        return jsonify({
            'success': True,
            'data': {
                'category': bill_data['category'],
                'vendor': bill_data['vendor'],
                'amount': bill_data['amount'],
                'due_date': bill_data['due_date'],
                'bill_number': bill_data['bill_number']
            },
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to process image',
            'details': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500
    
@app.route("/analyze-bill",methods=["POST"])
def analyze_bill():
    if "image" not in request.files:
        return jsonify({'message': 'No image uploaded'}), 400

    image_blob = request.files["image"].read()
    question = request.form.get("question")
    try:
        extracted_text = get_extracted_text(image_blob)
        
        if not extracted_text:
            return jsonify({'message': 'No text found in the image'}), 400
        
        answer_from_image_text_response = answer_from_image_text(question, extracted_text)
        
        return jsonify({
            'extracted_text': extracted_text,
            'answer_from_image_text': answer_from_image_text_response
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error processing the image: {str(e)}'}), 500
    

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0',
        'timestamp': datetime.now().isoformat()
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)