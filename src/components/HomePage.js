import React from 'react';
import NavigationButtons from './NavigationButtons';

const HomePage = ({ userInfo }) => {
  return (
    <div>
      <img
        className="welcome-image"
        src={`${process.env.PUBLIC_URL}/images/welcome.png`}
        alt="Welcome"
      />
      <h3>Welcome back, <strong>{userInfo?.firstname || userInfo?.name || "Future Math Genius"}</strong>!</h3>
      <NavigationButtons />
    </div>
  );
};

export default HomePage;
