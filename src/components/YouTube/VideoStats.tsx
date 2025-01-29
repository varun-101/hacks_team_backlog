import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Title, Text } from '@tremor/react';

interface VideoItem {
  id: string;
  snippet: {
    resourceId: {
      videoId: string;
    };
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

interface VideoStatsProps {
  accessToken: string | null;
}

export const VideoStats: React.FC<VideoStatsProps> = ({ accessToken }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadsPlaylistId, setUploadsPlaylistId] = useState<string | null>(null);

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
          setUploadsPlaylistId(data.items[0].contentDetails.relatedPlaylists.uploads);
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
        setVideos(data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [uploadsPlaylistId, accessToken]);

  // Add this mock data for testing
  const mockVideos = [
    {
      id: '1',
      snippet: {
        resourceId: { videoId: 'abc123' },
        title: 'Test Video',
        thumbnails: { high: { url: 'https://picsum.photos/400/225' } },
        publishedAt: new Date().toISOString()
      }
    }
  ];

  // Modify the useEffect to use mock data
  useEffect(() => {
    setVideos(mockVideos);
    setLoading(false);
  }, []);

  if (loading) return (
    <Card className="mt-8">
      <Text>Loading videos...</Text>
    </Card>
  );

  return (
    <Card className="mt-8">
      <Title className="mb-6">Your Videos</Title>
      {videos.length === 0 ? (
        <Text>No videos found.</Text>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <Link 
              key={video.id} 
              to={`/video/${video.snippet.resourceId.videoId}`}
              className="block hover:opacity-75 transition-opacity"
            >
              <Card className="h-full">
                <div className="aspect-video mb-4">
                  <img 
                    src={video.snippet.thumbnails.high.url} 
                    alt={video.snippet.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <Title className="text-lg mb-2 line-clamp-2">{video.snippet.title}</Title>
                <Text className="text-sm text-gray-500">
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </Text>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}; 