import { useState, useEffect } from 'react';
import './VideoUpload.css';

export const VideoUpload = ({ accessToken }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    privacyStatus: 'private',
    scheduleDate: '',
    scheduleTime: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    const loadGapiClient = async () => {
      try {
        await new Promise((resolve) => window.gapi.load('client', resolve));
        await window.gapi.client.init({
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        });
        window.gapi.client.setToken({ access_token: accessToken });
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
      }
    };

    if (accessToken) {
      loadGapiClient();
    }
  }, [accessToken]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setVideoDetails(prev => ({
        ...prev,
        title: file.name.split('.')[0],
      }));
      setShowForm(true);
    }
  };

  const handleScheduleChange = (e) => {
    setIsScheduled(e.target.checked);
    if (e.target.checked) {
      // Set default schedule time to 30 minutes from now
      const now = new Date();
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      
      setVideoDetails(prev => ({
        ...prev,
        scheduleDate: thirtyMinutesFromNow.toISOString().split('T')[0],
        scheduleTime: thirtyMinutesFromNow.toTimeString().slice(0, 5),
      }));
    } else {
      setVideoDetails(prev => ({
        ...prev,
        scheduleDate: '',
        scheduleTime: '',
      }));
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    try {
      // Validate schedule time if scheduling is enabled
      let publishAt = null;
      if (isScheduled && videoDetails.scheduleDate && videoDetails.scheduleTime) {
        const scheduledDate = new Date(`${videoDetails.scheduleDate}T${videoDetails.scheduleTime}`);
        const now = new Date();
        const minScheduleTime = new Date(now.getTime() + 15 * 60 * 1000);
        
        if (scheduledDate <= minScheduleTime) {
          throw new Error('Scheduled time must be at least 15 minutes in the future');
        }
        publishAt = scheduledDate.toISOString();
      }

      // First, upload the video with scheduling info if applicable
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify({
        snippet: {
          title: videoDetails.title,
          description: videoDetails.description,
          categoryId: '22',
        },
        status: {
          privacyStatus: 'private',
          selfDeclaredMadeForKids: false,
          ...(publishAt && { publishAt }), // Include publishAt in initial upload if scheduling
        },
      })], { type: 'application/json' }));
      formData.append('file', selectedFile);

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status');
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setProgress(progress);
        }
      };

      const uploadResponse = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error occurred'));
        xhr.send(formData);
      });

      // If not private and not scheduled, update the privacy setting
      if (!isScheduled && videoDetails.privacyStatus !== 'private') {
        try {
          const updateResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=status`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: uploadResponse.id,
                status: {
                  privacyStatus: videoDetails.privacyStatus,
                  selfDeclaredMadeForKids: false,
                },
              }),
            }
          );

          if (!updateResponse.ok) {
            console.error('Privacy update failed, but video was uploaded');
          }
        } catch (error) {
          console.error('Privacy update failed, but video was uploaded:', error);
        }
      }

      console.log('Video processed successfully');
      alert(isScheduled ? 
        `Video scheduled successfully for ${new Date(publishAt).toLocaleString()}` : 
        'Video uploaded successfully!'
      );
    } catch (error) {
      console.error('Upload error:', error);
      // Check if the error is just the scheduling update error but video was uploaded
      if (error.message.includes('invalid scheduled publishing time') && 
          error.message.includes('update video settings')) {
        alert('Video uploaded successfully!');
      } else {
        alert(`Failed to upload video: ${error.message}`);
      }
    } finally {
      setUploading(false);
      setShowForm(false);
      setSelectedFile(null);
      setIsScheduled(false);
      setVideoDetails({
        title: '',
        description: '',
        privacyStatus: 'private',
        scheduleDate: '',
        scheduleTime: '',
      });
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="video-upload">
      <h3>Upload Video</h3>
      
      {!showForm ? (
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
      ) : (
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={videoDetails.title}
              onChange={(e) => setVideoDetails(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={videoDetails.description}
              onChange={(e) => setVideoDetails(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="privacyStatus">Privacy Setting:</label>
            <select
              id="privacyStatus"
              value={videoDetails.privacyStatus}
              onChange={(e) => setVideoDetails(prev => ({ ...prev, privacyStatus: e.target.value }))}
              required
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="form-group scheduling">
            <label className="schedule-checkbox">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={handleScheduleChange}
              />
              Schedule Upload
            </label>
            
            {isScheduled && (
              <div className="schedule-inputs">
                <div className="schedule-input-group">
                  <label htmlFor="scheduleDate">Date:</label>
                  <input
                    type="date"
                    id="scheduleDate"
                    min={getMinDate()}
                    value={videoDetails.scheduleDate}
                    onChange={(e) => setVideoDetails(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    required={isScheduled}
                  />
                </div>
                <div className="schedule-input-group">
                  <label htmlFor="scheduleTime">Time:</label>
                  <input
                    type="time"
                    id="scheduleTime"
                    value={videoDetails.scheduleTime}
                    onChange={(e) => setVideoDetails(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    required={isScheduled}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {uploading && (
        <div className="upload-progress">
          <progress value={progress} max="100" />
          <p>{progress}% uploaded</p>
          <p className="upload-status">
            {progress < 100 ? 'Uploading...' : 'Processing video...'}
          </p>
        </div>
      )}
    </div>
  );
}; 