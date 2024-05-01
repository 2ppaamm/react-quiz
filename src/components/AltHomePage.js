import React, { useState } from 'react'; // Add useState here
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuestions } from './QuestionsContext';
import './AltHomePage.css';

const AltHomePage = () => {
  const { user } = useAuth0(); // Destructure user from useAuth0 hook
  const [isLoading, setIsLoading] = useState(false);
  const { getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();
  const { fetchQuestions } = useQuestions();

  const handleDiagnosticTest = async () => {
    setIsLoading(true);
    // Correctly construct the URL using template literals
    const diagnosticURL = `${process.env.REACT_APP_BACKEND_URL}/diagnostic`;
    try {
      // Pass the correctly constructed URL to fetchQuestions
      await fetchQuestions(diagnosticURL, {});
      // Assuming fetchQuestions navigates to '/questions-display' upon success,
      navigate('/questions-display');
      // and you have error handling within fetchQuestions to navigate to '/error' on failure.
    } catch (error) {
      console.error('Error during diagnostic test:', error);
      // Optionally handle any additional error logic here if not handled in fetchQuestions
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMastercodeEnrollment = () => {
      navigate('/mastercode-enrollment');
  };


  const handlePurchaseEnrollment = () => {
    navigate('/purchase-enrollment');
  };

 return (
    <div className="alt-home-container">
      <img
        className="alternative-welcome-image"
        src={`${process.env.PUBLIC_URL}/images/welcome.png`}
        alt="Welcome, Adventurer!"
      />
      <div className='name-text-container'>Hello, <strong>{user?.name || "Fellow Adventurer"}</strong>!</div>
      <p>Start My journey</p>
      <div className="options-container">
        <div className="action-button" onClick={handleDiagnosticTest}>
          <strong>Discover your Math Superpowers</strong>
          <div className="subtitle">Free diagnostic test</div>
        </div>
        <div className="action-button" onClick={handleMastercodeEnrollment}>
          <strong>Unlock a New World</strong>
          <div className="subtitle">I have a mastercode</div>
        </div>
        <div className="action-button" onClick={handlePurchaseEnrollment}>
          <strong>Embark on a Grand Adventure</strong>
          <div className="subtitle">Join the All Gifted Math Program</div>
        </div>
      </div>
    </div>
  );
};

export default AltHomePage;