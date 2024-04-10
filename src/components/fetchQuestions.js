import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [testId, setTestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { getIdTokenClaims } = useAuth0();

  const fetchQuestions = async (url, answers) => {
    setLoading(true);
    setError('');
    
    try {
      const idTokenClaims = await getIdTokenClaims();
      const idToken = idTokenClaims.__raw;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ answers }),
      });

      if (response.status === 206) {
        const data = await response.json();
        setTestId(data.testId);
        setQuestions(data.questions || []);
      } else {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error("Error fetching questions: ", error);
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestionsContext.Provider value={{ questions, testId, loading, error, fetchQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => useContext(QuestionsContext);
