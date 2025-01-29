import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VideoDetail.css'; // Import the CSS file

export const VideoDetail = ({ accessToken }) => {
  const { videoId } = useParams();
  console.log('Video ID:', videoId); // Log the videoId for debugging
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('Video Data:', data); // Log the fetched video data for debugging
        if (data.items && data.items.length > 0) {
          setVideoData(data.items[0]);
        }
      } catch (error) {
        console.error('Error fetching video details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchVideoDetails();
    }
  }, [accessToken, videoId]);

  if (loading) return <p>Loading video details...</p>;

  if (!videoData) return <p>No video data found.</p>;

  return (
    <div className="video-detail">
      <h2>{videoData.snippet.title}</h2>
      <img 
        src={videoData.snippet.thumbnails.high.url} 
        alt={videoData.snippet.title} 
        style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }} 
      />
      <p>Description: {videoData.snippet.description}</p>
      <p>Published At: {videoData.snippet.publishedAt}</p>
      <p>Views: {videoData.statistics.viewCount}</p>
      <p>Likes: {videoData.statistics.likeCount}</p>
      <p>Comments: {videoData.statistics.commentCount}</p>
      {/* Add more stats as needed */}
    </div>
  );
}; 