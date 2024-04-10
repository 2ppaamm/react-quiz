import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import AuthenticationButtons from './AuthButtons';
import HomePage from './components/HomePage';
import AltHomePage from './components/AltHomePage';
import SubjectSelection from './components/SubjectSelection';
import MenuPage from './components/MenuPage';
import QuestionsDisplay from './components/QuestionsDisplay';
import MastercodeEnrollment from './components/MastercodeEnrollment';
import PurchaseEnrollment from './components/PurchaseEnrollment';
import ResultsPage from './components/ResultsPage';
import { QuestionsProvider } from './components/QuestionsContext';
import { fetchUserInfo } from './components/fetchUserInfo';
import ErrorPage from './components/ErrorPage';

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, getIdTokenClaims, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [isRegistered, setIsRegistered] = useState(true);
  useEffect(() => {
    const testType = localStorage.getItem('testType');
    if (!testType) {
      localStorage.setItem('testType', 'non-video');
    }

    if (!isLoading && isAuthenticated) {
      getAccessTokenSilently().then(() => {
        getIdTokenClaims().then(claims => {
          const idToken = claims.__raw;
          fetchUserInfo(idToken).then(({ isRegistered, userInfo }) => {
            if (isRegistered) {
              setUserInfo(userInfo);
            }
            // Update the state based on registration status
            setIsRegistered(isRegistered);
          }).catch(err => {
            console.error("Error processing user info:", err);
            // Handle error, potentially setting isRegistered to false or showing an error message
          });
        });
      }).catch(error => {
        console.error('Authentication error:', error);
        loginWithRedirect();
      });
    }
  }, [isLoading, isAuthenticated, getIdTokenClaims, getAccessTokenSilently, loginWithRedirect]);

  return (
    <QuestionsProvider>
      <Router>
        <div className={`App ${isAuthenticated ? 'authenticated' : ''}`}>
          {!isLoading && isAuthenticated ? (
            <Routes>
              <Route path="/" element={isRegistered ? <HomePage userInfo={userInfo} /> : <AltHomePage />} />
              <Route path="/mastercode-enrollment" element={<MastercodeEnrollment />} />
              <Route path="/purchase-enrollment" element={<PurchaseEnrollment />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/subject-select" element={<SubjectSelection />} />
              <Route path="/questions-display" element={<QuestionsDisplay />} /> 
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          ) : (
            <p>Loading or not authenticated...</p>
          )}
          <AuthenticationButtons />
        </div>
      </Router>
    </QuestionsProvider>
  );
}

export default App;