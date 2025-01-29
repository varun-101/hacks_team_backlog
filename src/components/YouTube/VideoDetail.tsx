import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Title, Text } from '@tremor/react';

interface VideoData {
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

interface VideoDetailProps {
  accessToken: string | null;
}

export const VideoDetail: React.FC<VideoDetailProps> = ({ accessToken }) => {
  const { videoId = '' } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
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

  if (loading) return (
    <Card className="max-w-4xl mx-auto mt-8">
      <Text>Loading video details...</Text>
    </Card>
  );

  if (!videoData) return (
    <Card className="max-w-4xl mx-auto mt-8">
      <Text>No video data found.</Text>
    </Card>
  );

  return (
    <Card className="max-w-4xl mx-auto mt-8 p-6">
      <Title className="mb-4">{videoData.snippet.title}</Title>
      <div className="aspect-video mb-6">
        <img 
          src={videoData.snippet.thumbnails.high.url} 
          alt={videoData.snippet.title} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="space-y-4">
        <div>
          <Text className="font-medium">Description</Text>
          <Text className="whitespace-pre-wrap">{videoData.snippet.description}</Text>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Text className="font-medium">Views</Text>
            <Text>{parseInt(videoData.statistics.viewCount).toLocaleString()}</Text>
          </div>
          <div>
            <Text className="font-medium">Likes</Text>
            <Text>{parseInt(videoData.statistics.likeCount).toLocaleString()}</Text>
          </div>
          <div>
            <Text className="font-medium">Comments</Text>
            <Text>{parseInt(videoData.statistics.commentCount).toLocaleString()}</Text>
          </div>
        </div>
        <div>
          <Text className="font-medium">Published</Text>
          <Text>{new Date(videoData.snippet.publishedAt).toLocaleDateString()}</Text>
        </div>
      </div>
    </Card>
  );
}; 