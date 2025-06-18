import os
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv
import base64
import io
load_dotenv()

genai.configure(api_key=os.getenv("GENAI_API_KEY"))

vision_model = genai.GenerativeModel(os.getenv("Image_Reader_Model"))

def get_extracted_text(image_blob):
    image = Image.open(io.BytesIO(image_blob))
    response = vision_model.generate_content(
        ["Extract all readable text from this image.", image]
    )
    return response.text.strip()

def answer_from_image_text(query,extracted_text=None):
    if extracted_text is None:
        return "No text extracted from image."
    response = vision_model.generate_content(
        f"""Based on the following text extracted from an image, answer the query precisely.
        
        Extracted text: {extracted_text}
        
        Query: {query}
        
        Provide only the specific information requested in the query, nothing else.
        If the information isn't available, respond with "Information not found in the image"."""
    )
    return response.text
