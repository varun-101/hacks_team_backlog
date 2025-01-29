from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from transformers import pipeline
from PIL import Image
import pytesseract
import os

# Update this path according to your system
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  # Adjust for Windows

app = Flask(__name__)
CORS(app, resources={
    r"/analyze_video": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})  # Enable CORS for all routes

class VideoContentAnalyzer:
    def __init__(self):
        # Initialize the text classification pipeline for toxicity detection
        self.text_classifier = pipeline(
            "text-classification",
            model="unitary/toxic-bert",
            return_all_scores=True
        )
        
        # Initialize OCR for text extraction from frames
        self.ocr_engine = pytesseract

    def extract_text_from_frame(self, frame):
        """Extract text from video frame using OCR."""
        if self.ocr_engine is None:
            return ""
        
        # Convert frame to PIL Image for OCR
        pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        text = self.ocr_engine.image_to_string(pil_image)
        return text.strip()

    def analyze_text_content(self, text):
        """Analyze text for toxic content."""
        if not text:
            return None
            
        results = self.text_classifier(text)
        
        # Convert results to a more readable format
        analysis = {
            label['label']: label['score'] 
            for label in results[0]
        }
        
        return analysis

    def process_video(self, video_path, sample_rate=1.0):
        """Process video file and analyze frames for toxic content."""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Error opening video file")

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        results = []
        frame_count = 0
        
        print(f"Processing video: {total_frames} frames at {fps} FPS")
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Only process frames according to sample rate
            if frame_count % int(1/sample_rate) == 0:
                timestamp = frame_count / fps
                
                # Extract text from frame
                text = self.extract_text_from_frame(frame)
                
                # Analyze extracted text
                if text:
                    analysis = self.analyze_text_content(text)
                    
                    if analysis:
                        results.append({
                            'timestamp': timestamp,
                            'frame_number': frame_count,
                            'text': text,
                            'analysis': analysis
                        })
                
                print(f"Processed frame {frame_count}/{total_frames}")
            
            frame_count += 1
            
        cap.release()
        return results

    def generate_report(self, results, threshold=0.5):
        """Generate summary report of toxic content findings."""
        report = {
            'total_frames_analyzed': len(results),
            'flagged_content': []
        }
        
        for result in results:
            # Check if any toxic scores are above threshold
            toxic_categories = {
                category: score 
                for category, score in result['analysis'].items() 
                if score > threshold
            }
            
            if toxic_categories:
                report['flagged_content'].append({
                    'timestamp': result['timestamp'],
                    'frame_number': result['frame_number'],
                    'text': result['text'],
                    'toxic_categories': toxic_categories
                })
        
        return report

@app.route('/analyze_video', methods=['POST'])
def analyze_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']
    
    # Define the uploads directory
    uploads_dir = './uploads'
    
    # Create the uploads directory if it doesn't exist
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    video_path = os.path.join(uploads_dir, video_file.filename)
    video_file.save(video_path)

    analyzer = VideoContentAnalyzer()
    
    try:
        # Process video
        print("Starting video analysis...")
        results = analyzer.process_video(video_path, sample_rate=0.5)
        
        # Generate report
        report = analyzer.generate_report(results, threshold=0.5)
        
        # Clean up the uploaded video file
        os.remove(video_path)
        print(report)
        return jsonify(report)
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")  # Log the error
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)