import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const useAccessToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:current_user",
          },
        });
        setAccessToken(token);
      } catch (error) {
        console.error("Error fetching access token: ", error);
      }
    };

    fetchToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  return accessToken;
};

export default useAccessToken;
