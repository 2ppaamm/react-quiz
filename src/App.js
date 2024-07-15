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
import ErrorPage from './components/ErrorPage';
import useAccessToken from './components/useAccessToken';  // Make sure this path is correct
import { QuestionsProvider } from './components/QuestionsContext';
import { useQuestions } from './components/QuestionsContext';
import { fetchUserInfo } from './components/fetchUserInfo';

function Root() {
  const { isRegistered, setIsRegistered } = useQuestions();
  const { isAuthenticated, isLoading } = useAuth0();
  const accessToken = useAccessToken();  // Using the custom hook
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && accessToken) {
      fetchUserInfo(accessToken).then(({ isRegistered, userInfo }) => {
        if (isRegistered) {
          setUserInfo(userInfo);
          console.log(userInfo);
          setIsRegistered(isRegistered);
        }
      }).catch(err => {
        console.error("Error processing user info:", err);
      });
    }
  }, [isLoading, isAuthenticated, accessToken, setIsRegistered]);

  return (
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
  );
}

function App() {
  return (
    <QuestionsProvider>
      <Router>
        <Root />
      </Router>
    </QuestionsProvider>
  );
}

export default App;