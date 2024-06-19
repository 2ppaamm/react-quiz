import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultsPage.css'; 
import NavigationButtons from './NavigationButtons';
import { ReactComponent as GameLevel } from '../game_level.svg';

const ResultsPage = () => {
  const location = useLocation();
  const resultData = location.state?.resultData;
  const [userFirstName, setUserFirstName] = useState('');
  const [gameLevel, setGameLevel] = useState('');

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = () => {
      // Attempt to retrieve user info from localStorage
      const storedUserInfo = localStorage.getItem('userInfo');

      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        if (userInfo && userInfo.name) {
          setUserFirstName(userInfo.name.split(" ")[0]+"!"); // Assuming the name stores the full name
          setGameLevel(userInfo?.game_level)
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
      const encouragementMessage = resultData.percentage > 80 ? `Nice Work, ${userFirstName}` : `You can do better, ${userFirstName}`;
      setMessage(encouragementMessage);
    }
  }, [userFirstName, resultData]);

  // Use process.env.PUBLIC_URL to reference the public folder for image paths
  const resultImage = resultData?.percentage > 80 ? 'good results.png' : 'bad results.png';
  const imagePath = `${process.env.PUBLIC_URL}/images/${resultImage}`; // Construct the path with PUBLIC_URL

  return (
    <div className="results-container">
            {/* Header */}
            <div className='header-container-result'>
            <div className='game-level'><GameLevel width={20} height={20} style={{paddingRight:8}}/>400</div>
            </div>
      {resultData ? (
        <>
          <img src={imagePath} alt="Result" className="result-image" />
          <div className="title-font">{message}</div>
         <div className="percentage-bar-container">
            <div className="percentage-bar" style={{ width: `${resultData.percentage}%` }}></div>
          </div>
          <div className='result-font-container'>
            {
            resultData.correct===resultData.total 
            ?
            <div>
            <p className="result-font">All Correct!</p>
            <div className='game-level'><GameLevel width={20} height={20} style={{paddingRight:8}}/> {resultData.kudos} + 2 PERFECT BONUS</div>
            </div>
            :
            <div>
            <p className="result-font">You got {resultData.correct}/{resultData.total} answers right!</p>
            <div className='game-level'><GameLevel width={20} height={20} style={{paddingRight:8}}/> {resultData.kudos}</div>
            </div>
            }
          </div>
         </>
      ) : (
        <p>No results to display.</p>
      )}
      <NavigationButtons isResult={true} />
    </div>
  );

};

export default ResultsPage;
