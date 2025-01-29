import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePersistentAuth } from './components/Auth/PersistentAuth';
import { ChannelInfo } from './components/YouTube/ChannelInfo';
import { VideoUpload } from './components/YouTube/VideoUpload';
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
      <Dashboard />
    </GoogleOAuthProvider>
  );
}

export default App;
