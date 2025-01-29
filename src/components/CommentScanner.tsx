import React, { useState } from "react";
import axios from "axios";

interface CommentAnalysis {
  comment: string;
  classification: "hate speech" | "homophobic content" | "positive content" | "neutral";
  confidence: number;
}

const CommentScanner: React.FC = () => {
  const [videoLink, setVideoLink] = useState<string>("");
  const [comments, setComments] = useState<CommentAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const youtubeRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const handleScan = async () => {
    const videoId = extractVideoId(videoLink);
    if (!videoId) return alert("Please enter a valid YouTube link");

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<CommentAnalysis[]>("http://127.0.0.1:5000/analyze", {
        video_id: videoId,
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to analyze comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-white">YouTube Comment Scanner</h2>

      <input
        type="text"
        placeholder="Enter YouTube Video URL"
        className="w-full p-2 rounded-lg border bg-gray-800 text-white"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
      />

      <button
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        onClick={handleScan}
        disabled={loading}
      >
        {loading ? "Scanning..." : "Analyze Comments"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {comments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white">Results</h3>
          <ul className="mt-2 space-y-2">
            {comments.map((comment, index) => (
              <li key={index} className="p-3 bg-gray-800 text-white rounded-lg">
                <p className="text-sm">{comment.comment}</p>
                <p className={`text-xs font-bold mt-1 ${
                  comment.classification === "hate speech" ? "text-red-500" :
                  comment.classification === "homophobic content" ? "text-orange-500" :
                  comment.classification === "positive content" ? "text-green-500" :
                  "text-gray-400"
                }`}>
                  {comment.classification} ({(comment.confidence * 100).toFixed(2)}%)
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentScanner;
