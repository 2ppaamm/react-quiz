import React, { createContext, useContext, useState } from 'react';
import useAccessToken from './useAccessToken'; // Ensure the correct path

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children, navigate }) => {
  const [questions, setQuestions] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [testId, setTestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accessToken = useAccessToken();


  const fetchQuestions = async (url, payload, type = 'questions') => {
    setLoading(true);
    setError('');
    try {
      if (!accessToken) {
        throw new Error("Access token not available");
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        // Payload could be answers for questions or data for mastercode enrollment
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.log("response is not ok---")
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setQuestions(data.questions || []);
      setTestId(data.test || null);
      return data;
    } catch (error) {
      // console.error("Error fetching questions: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

/*  const fetchQuestions = async (url, payload, type = 'questions') => {
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
              body: JSON.stringify(payload),
          });

          if (!response.ok) {
              const errorMessage = await response.text();
              throw new Error(errorMessage);
          }

          const data = await response.json();
          setLoading(false);
          return data; // Return the response data for the calling component to handle
      } catch (error) {
          console.error("Error fetching questions: ", error);
          setError(error.message);
          setLoading(false);
          throw error; // Rethrow to let the calling component handle the error
      }
  };
*/
  const resetQuestions = () => {
    setQuestions([]);
    setTestId(null);
  };

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions, testId, setTestId, loading, error, fetchQuestions, resetQuestions,setLoading,isRegistered,setIsRegistered}}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => useContext(QuestionsContext);