import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultsPage.css'; 
import NavigationButtons from './NavigationButtons';

const ResultsPage = () => {
  const location = useLocation();
  const resultData = location.state?.resultData;
  const [userFirstName, setUserFirstName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = () => {
      // Attempt to retrieve user info from localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        if (userInfo && userInfo.name) {
          setUserFirstName(userInfo.name.split(" ")[0]); // Assuming the name stores the full name
        }
      } else {
        // Optionally, handle the case where no user info is found in localStorage
        console.log('No user info found in localStorage.');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    // Set the message based on the resultData.percentage
    if (resultData) {
      const encouragementMessage = resultData.percentage > 80 ? `Nice job, ${userFirstName}!` : `Let's try again, ${userFirstName}`;
      setMessage(encouragementMessage);
    }
  }, [userFirstName, resultData]);

  // Use process.env.PUBLIC_URL to reference the public folder for image paths
  const resultImage = resultData?.percentage > 80 ? 'good results.png' : 'bad results.png';
  const imagePath = `${process.env.PUBLIC_URL}/images/${resultImage}`; // Construct the path with PUBLIC_URL

  return (
    <div className="results-container">
      {resultData ? (
        <>
          <img src={imagePath} alt="Result" className="result-image" />
          <h3>{message}</h3>
          <h4>You have earned {resultData.kudos} kudos in this test.</h4>
         <div className="percentage-bar-container">
            <div className="percentage-bar" style={{ width: `${resultData.percentage}%` }}></div>
          </div>
          <h4>You got {resultData.percentage}% right.</h4>
         </>
      ) : (
        <p>No results to display.</p>
      )}
      <NavigationButtons />
    </div>
  );

};

export default ResultsPage;
