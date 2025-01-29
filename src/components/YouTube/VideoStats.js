import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './VideoStats.css'; // Import the CSS file

export const VideoStats = ({ accessToken }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadsPlaylistId, setUploadsPlaylistId] = useState(null);

  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const uploadsId = data.items[0].contentDetails.relatedPlaylists.uploads;
          setUploadsPlaylistId(uploadsId);
        }
      } catch (error) {
        console.error('Error fetching channel info:', error);
      }
    };

    if (accessToken) {
      fetchChannelInfo();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!uploadsPlaylistId) return;

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data);
        
        setVideos(data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [uploadsPlaylistId, accessToken]);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="video-stats">
      <h2>Your Videos</h2>
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul>
          {videos.map(video => (
            <li key={video.id}>
              <Link to={`/video/${video.id}`}> {/* Link to VideoDetail */}
                <h3>{video.snippet.title}</h3>
                <img 
                  src={video.snippet.thumbnails.high.url} 
                  alt={video.snippet.title} 
                  style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }} 
                />
              </Link>
              <p>Description: {video.snippet.description}</p>
              <p>Published At: {video.snippet.publishedAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 