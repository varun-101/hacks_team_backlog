import { useState, useEffect } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { Upload, Clock, X, Calendar, Lock } from 'lucide-react';
import './VideoUpload.css';
import WarningModal from './WarningModal';

interface VideoDetails {
  title: string;
  description: string;
  privacyStatus: 'private' | 'unlisted' | 'public';
  scheduleDate: string;
  scheduleTime: string;
}

interface VideoUploadProps {
  accessToken: string | null;
}

interface FlaggedContent {
  timestamp: number;
  frame_number: number;
  text: string;
  toxic_categories: Record<string, number>;
}


export const VideoUpload: React.FC<VideoUploadProps> = ({ accessToken }) => {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({
    title: '',
    description: '',
    privacyStatus: 'private',
    scheduleDate: '',
    scheduleTime: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);

  useEffect(() => {
    const loadGapiClient = async () => {
      try {
        // Wait for gapi to load
        if (!window.gapi) {
          console.error('Google API client library not loaded');
          return;
        }

        // Load the client library
        await new Promise<void>((resolve) => {
          window.gapi.load('client', resolve);
        });

        // Initialize the client
        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        });

        if (accessToken) {
          window.gapi.client.setToken({ access_token: accessToken });
        }
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
      }
    };

    loadGapiClient();
  }, [accessToken]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoDetails(prev => ({
        ...prev,
        title: file.name.split('.')[0],
      }));
      setShowForm(true);
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsScheduled(e.target.checked);
    if (e.target.checked) {
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

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !accessToken) return;

    setAnalyzing(true);
    setProgress(0);

    try {
      // First, analyze the video
      const analysisFormData = new FormData();
      analysisFormData.append('video', selectedFile);

      const analysisResponse = await fetch('http://localhost:5000/analyze_video', {
        method: 'POST',
        body: analysisFormData,
      });

      if (!analysisResponse.ok) {
        throw new Error('Video analysis failed');
      }

      const analysisResult = await analysisResponse.json();
      
      if (analysisResult.flagged_content?.length > 0) {
        setWarningMessage('Warning: Potentially inappropriate content detected.');
        setFlaggedContent(analysisResult.flagged_content);
        setShowWarning(true);
        setAnalyzing(false);
        return;
      }

      // Proceed with upload
      setAnalyzing(false);
      setUploading(true);

      // Create form data for the video upload
      const videoFormData = new FormData();
      videoFormData.append('video', selectedFile);

      // Create metadata
      const metadata = {
        snippet: {
          title: videoDetails.title,
          description: videoDetails.description,
          categoryId: '22',
        },
        status: {
          privacyStatus: videoDetails.privacyStatus,
          selfDeclaredMadeForKids: false,
          ...(isScheduled && {
            publishAt: new Date(`${videoDetails.scheduleDate}T${videoDetails.scheduleTime}`).toISOString()
          }),
        },
      };

      // Add metadata to form data
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      videoFormData.append('metadata', metadataBlob);

      // Create the upload request using gapi client
      const uploadResponse = await window.gapi.client.request({
        path: '/upload/youtube/v3/videos',
        method: 'POST',
        params: {
          uploadType: 'multipart',
          part: 'snippet,status',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: videoFormData,
      });

      if (uploadResponse.status !== 200) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      // Reset form
      setShowForm(false);
      setSelectedFile(null);
      setVideoDetails({
        title: '',
        description: '',
        privacyStatus: 'private',
        scheduleDate: '',
        scheduleTime: '',
      });

      // Show success message
      alert('Video uploaded successfully!');

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload video: ${error.message}`);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <Title className="text-white mb-6">Upload Video</Title>
      
      {!showForm ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-lg">
          <Upload className="w-12 h-12 text-slate-400 mb-4" />
          <Text className="text-slate-400 mb-4">Drag and drop a video file or click to browse</Text>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading || analyzing}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            Select Video
          </label>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={videoDetails.title}
                onChange={(e) => setVideoDetails(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={videoDetails.description}
                onChange={(e) => setVideoDetails(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="privacyStatus" className="block text-sm font-medium text-slate-300 mb-1">
                Privacy Setting
              </label>
              <select
                id="privacyStatus"
                value={videoDetails.privacyStatus}
                onChange={(e) => setVideoDetails(prev => ({ ...prev, privacyStatus: e.target.value as VideoDetails['privacyStatus'] }))}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={handleScheduleChange}
                  className="rounded border-slate-400 text-purple-600 focus:ring-purple-500"
                />
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Upload
                </span>
              </label>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="scheduleDate" className="block text-sm font-medium text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="scheduleDate"
                      min={getMinDate()}
                      value={videoDetails.scheduleDate}
                      onChange={(e) => setVideoDetails(prev => ({ ...prev, scheduleDate: e.target.value }))}
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required={isScheduled}
                    />
                  </div>
                  <div>
                    <label htmlFor="scheduleTime" className="block text-sm font-medium text-slate-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      id="scheduleTime"
                      value={videoDetails.scheduleTime}
                      onChange={(e) => setVideoDetails(prev => ({ ...prev, scheduleTime: e.target.value }))}
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required={isScheduled}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading || analyzing}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : uploading ? 'Uploading...' : 'Upload Video'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={uploading || analyzing}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {(uploading || analyzing) && (
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Text className="text-slate-300">
              {analyzing ? 'Analyzing video...' : 'Uploading video...'}
            </Text>
            <Text className="text-slate-400">{progress}%</Text>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {showWarning && (
        <WarningModal 
          message={warningMessage}
          flaggedContent={flaggedContent}
          onClose={() => setShowWarning(false)}
        />
      )}
    </Card>
  );
}; 