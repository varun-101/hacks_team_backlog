from flask import Flask, request, jsonify
from googleapiclient.discovery import build
import pandas as pd
from transformers import pipeline
from flask_cors import CORS  # Enable CORS for frontend communication

app = Flask(__name__)
CORS(app)  # Allows React frontend to call this API

# Your YouTube API Key (replace with your actual key)
API_KEY = "AIzaSyDeSz3s5pUbeA2sKAbxySux7BSm6spCpqE"

def get_youtube_comments(video_id, max_results=100):
    youtube = build('youtube', 'v3', developerKey=API_KEY)
    comments = []
    next_page_token = None

    while len(comments) < max_results:
        response = youtube.commentThreads().list(
            part='snippet',
            videoId=video_id,
            maxResults=min(100, max_results - len(comments)),
            pageToken=next_page_token
        ).execute()

        for item in response.get("items", []):
            comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            comments.append(comment)

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return comments

def classify_comments(comments):
    # Initialize classifier with updated parameters
    classifier = pipeline(
        "text-classification",
        model="facebook/roberta-hate-speech-dynabench-r4-target",
        top_k=None
    )

    # Define targeted categories and their indicators
    categories = {
        'homophobia': ['gay', 'fag', 'queer', 'homo'],
        'hate_speech': ['hate', 'suck', 'stupid', 'idiot', 'dumb'],
        'positive': ['love', 'wholesome', 'great', 'awesome', 'amazing'],
        'racism': ['racist', 'nigger', 'white supremacist', 'black lives matter'],
        'sexism': ['bitch', 'whore', 'slut', 'misogynist']
    }
    
    results = []
    
    for comment in comments:
        comment_lower = comment.lower()
        
        # Initialize scores for categories
        category_scores = {category: 0 for category in categories}
        
        # Rule-based classification (using category keywords)
        for category, terms in categories.items():
            category_scores[category] = sum(1 for term in terms if term in comment_lower.split())

        # Get model classification
        try:
            scores = classifier(comment)
            max_score = max(scores[0], key=lambda x: x['score'])
            
            # Combine rule-based and model-based classification
            primary_category = 'neutral'
            if category_scores['homophobia'] > 0:
                primary_category = 'homophobic content'
            elif category_scores['hate_speech'] > 0:
                primary_category = 'hate speech'
            elif category_scores['racism'] > 0:
                primary_category = 'racism'
            elif category_scores['sexism'] > 0:
                primary_category = 'sexism'
            elif category_scores['positive'] > 0:
                primary_category = 'positive content'
            
            results.append({
                'comment': comment,
                'classification': primary_category,
                'confidence': round(max_score['score'], 3)
            })
        except Exception as e:
            results.append({
                'comment': comment,
                'classification': 'error',
                'confidence': 0.0
            })

    return results

@app.route("/analyze", methods=["POST"])
def analyze_comments():
    data = request.json
    video_id = data.get("video_id")

    if not video_id:
        return jsonify({"error": "Missing video ID"}), 400

    comments = get_youtube_comments(video_id)
    classified_comments = classify_comments(comments)

    return jsonify(classified_comments)

if __name__ == "__main__":
    app.run(debug=True)

