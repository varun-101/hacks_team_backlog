import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export const usePersistentAuth = () => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('youtube_access_token') || null;
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('youtube_access_token', accessToken);
    }
  }, [accessToken]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
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
  };

  return { accessToken, login, logout };
}; 