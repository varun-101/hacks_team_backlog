import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePersistentAuth } from './components/Auth/PersistentAuth';
import { ChannelInfo } from './components/YouTube/ChannelInfo';
import { VideoUpload } from './components/YouTube/VideoUpload';
import { VideoStats } from './components/YouTube/VideoStats';
import { VideoDetail } from './components/YouTube/VideoDetail';
import './App.css';

function Dashboard() {
  const { accessToken, login, logout } = usePersistentAuth();

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Channel Dashboard</h1>
        
        {!accessToken ? (
          <button onClick={() => login()}>
            Sign in with Google
          </button>
        ) : (
          <>
            <button onClick={logout}>Logout</button>
            <ChannelInfo accessToken={accessToken} />
            <VideoUpload accessToken={accessToken} />
            <VideoStats accessToken={accessToken} />
          </>
        )}
      </header>
    </div>
  );
}

function App() {
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/video/:videoId" element={<VideoDetail accessToken={localStorage.getItem('youtube_access_token')} />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
