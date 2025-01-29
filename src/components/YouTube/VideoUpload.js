import { useState } from 'react';

export const VideoUpload = ({ accessToken }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Get the upload URL
      const metadata = {
        snippet: {
          title: file.name,
          description: 'Uploaded via Social Media Manager',
        },
        status: {
          privacyStatus: 'private', // or 'public', 'unlisted'
        },
      };

      const initializeUpload = await fetch(
        'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Length': file.size,
            'X-Upload-Content-Type': file.type,
          },
          body: JSON.stringify(metadata),
        }
      );

      if (!initializeUpload.ok) {
        throw new Error('Failed to initialize upload');
      }

      const uploadUrl = initializeUpload.headers.get('Location');
      if (!uploadUrl) {
        throw new Error('No upload URL received');
      }

      // Step 2: Upload the file
      const chunkSize = 256 * 1024; // 256KB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);

        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
            'Content-Length': chunk.size.toString(),
          },
          body: chunk,
        });

        if (response.status === 308) {
          // Chunk uploaded successfully, continue with next chunk
          const progress = Math.round((end / file.size) * 100);
          setProgress(progress);
        } else if (response.ok) {
          // Upload completed
          setProgress(100);
          const result = await response.json();
          console.log('Upload completed:', result);
          alert('Video uploaded successfully!');
          break;
        } else {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload video: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-upload">
      <h3>Upload Video</h3>
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && (
        <div className="upload-progress">
          <progress value={progress} max="100" />
          <p>{progress}% uploaded</p>
        </div>
      )}
    </div>
  );
}; 