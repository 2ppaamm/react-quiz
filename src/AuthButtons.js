import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons = () => {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  console.log("Authenticated:", isAuthenticated, "Loading:", isLoading);

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => logout({ returnTo: window.location.origin })}  className="logout-button">
          Log Out
        </button>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Log In
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
