import { useState, useEffect } from 'react';

export const ChannelInfo = ({ accessToken }) => {
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
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
          setChannelData(data.items[0]);
        }
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    };

    if (accessToken) {
      fetchChannelInfo();
    }
  }, [accessToken]);

  if (!channelData) return <p>Loading channel data...</p>;

  return (
    <div className="channel-info">
      <h2>{channelData.snippet.title}</h2>
      <p>{channelData.snippet.description}</p>
      <div className="statistics">
        <p>Subscribers: {channelData.statistics.subscriberCount}</p>
        <p>Total Views: {channelData.statistics.viewCount}</p>
        <p>Total Videos: {channelData.statistics.videoCount}</p>
      </div>
    </div>
  );
}; 