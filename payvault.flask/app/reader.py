import os
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv
import io
import re
from typing import Dict, Optional
load_dotenv()

genai.configure(api_key=os.getenv("GENAI_API_KEY"))
vision_model = genai.GenerativeModel(os.getenv("Image_Reader_Model"))

def extract_bill_data(image_blob: bytes) -> Dict[str, Optional[str]]:
    """
    Extract bill information from an image and return structured data
    Returns a dictionary with category, vendor, amount, due_date, bill_number
    """
    try:
        image = Image.open(io.BytesIO(image_blob))
        response = vision_model.generate_content(
            ["Extract all readable text from this bill or invoice document.", image]
        )
        extracted_text = response.text.strip()
        
        if not extracted_text:
            return empty_bill_data()
        
        bill_data = empty_bill_data()

        vendor_response = vision_model.generate_content(
            f"""From this bill text, identify only the vendor/company name. 
            Return just the name or "Not found" if not available.
            
            Text: {extracted_text}"""
        )
        bill_data['vendor'] = clean_response(vendor_response.text)
        
        category_response = vision_model.generate_content(
            f"""From this bill text, determine the bill category (e.g., Electricity, Water, Internet, Food, Shopping). 
            Return only the category name or "Other" if not clear.
            
            Text: {extracted_text}"""
        )
        bill_data['category'] = clean_response(category_response.text)
        
        amount_response = vision_model.generate_content(
            f"""From this bill text, extract the total amount due. 
            Return only the numeric value (without currency symbols) or "0" if not found.
            
            Text: {extracted_text}"""
        )
        bill_data['amount'] = extract_numeric_value(clean_response(amount_response.text))
        
        date_response = vision_model.generate_content(
            f"""From this bill text, find the payment due date. 
            Return only the date in YYYY-MM-DD format or empty if not found.
            
            Text: {extracted_text}"""
        )
        bill_data['due_date'] = format_date(clean_response(date_response.text))
        
        bill_num_response = vision_model.generate_content(
            f"""From this bill text, locate the bill/invoice number. 
            Return only the number or empty if not found.
            
            Text: {extracted_text}"""
        )
        bill_data['bill_number'] = clean_response(bill_num_response.text)
        
        return bill_data
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return empty_bill_data()

def empty_bill_data() -> Dict[str, str]:
    """Return empty bill data structure"""
    return {
        'category': '',
        'vendor': '',
        'amount': '0',
        'due_date': '',
        'bill_number': ''
    }

def clean_response(text: str) -> str:
    """Clean the API response by removing quotes and unwanted phrases"""
    text = text.strip(' "\'')
    if text.lower() in ['not found', 'not available', 'n/a', 'none']:
        return ''
    return text

def extract_numeric_value(text: str) -> str:
    """Extract just the numeric value from a string"""
    if not text:
        return '0'
    match = re.search(r'(\d+\.?\d*)', text.replace(',', ''))
    return match.group(1) if match else '0'

def format_date(date_str: str) -> str:
    """Try to convert various date formats to YYYY-MM-DD"""
    if not date_str:
        return ''
    
    try:
        from datetime import datetime
        date_formats = [
            '%Y-%m-%d', '%d-%m-%Y', '%m/%d/%Y', 
            '%d/%m/%Y', '%b %d, %Y', '%d %b %Y'
        ]
        
        for fmt in date_formats:
            try:
                dt = datetime.strptime(date_str, fmt)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue
                
        match = re.search(r'(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})', date_str)
        if match:
            day, month, year = match.groups()
            year = f'20{year}' if len(year) == 2 else year
            return f'{year}-{month.zfill(2)}-{day.zfill(2)}'
            
    except Exception:
        pass
    
    return ''
