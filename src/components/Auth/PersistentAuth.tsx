import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

// For testing/development only
const DUMMY_ACCESS_TOKEN = "ya29.a0AfB_byC-DummyAccessToken-KjHgFkDhJkLmNoPqRsTuVwXyZ";

export const usePersistentAuth = () => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('youtube_access_token') || null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('youtube_access_token', accessToken);
    }
  }, [accessToken]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // For development, use dummy token
      setAccessToken(DUMMY_ACCESS_TOKEN);
      navigate('/manager/*');
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ].join(' '),
  });

  const logout = () => {
    localStorage.removeItem('youtube_access_token');
    setAccessToken(null);
    navigate('/');
  };

  return { accessToken, login, logout };
}; 