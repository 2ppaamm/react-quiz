import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import storage from './storage';
import './SubjectSelection.css';
import { useQuestions } from './QuestionsContext'; 
import NavigationBar from './NavigationBar';

const SubjectSelection = () => {
  const { fetchQuestions } = useQuestions(); // Combine destructuring for clarity
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_URL; // Direct use of environment variable

  // Load tracks effect
  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      try {
        await storage.setItem('testType', 'subjectSelect');
        const tracksData = await storage.getItem('tracks');
        if (tracksData) {
          setTracks(JSON.parse(tracksData));
        } else {
          console.log('No tracks data available');
          // Consider fetching from the backend or setting an error state here
        }
      } catch (error) {
        console.error("Could not load tracks from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, []);

  // Fetch questions for a selected track
  const fetchQuestionsForTrack = useCallback(async (trackId) => {
    setIsLoading(true);
    const trackURL = `${baseURL}/test/trackquestions/${trackId}`;

    try {
      await fetchQuestions(trackURL);
      navigate('/questions-display'); // Ensure fetchQuestions updates the context appropriately
    } catch (error) {
      console.error('Error during Subject test:', error);
      navigate('/error', { state: { message: error.message || 'There was an issue fetching the questions.' } });
    } finally {
      setIsLoading(false);
    }
  }, [baseURL, navigate, fetchQuestions]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <NavigationBar />
      <h1>Subject Selection</h1>
      <h2>All Gifted Math</h2>
      <div className="tracks-grid">
        {tracks.map((track, index) => (
          <div key={index} className="track-item" role="button" tabIndex="0" 
               onClick={() => fetchQuestionsForTrack(track.id)} style={{ cursor: "pointer" }}>
            <div className="track-image-container">
              {track.image ? (
                <img src={track.image} alt={`Track ${index + 1}`} className="track-image" />
              ) : (
                <div className="track-item-placeholder"></div>
              )}
              <div className="track-status-bar">
                <div className="track-status-bar-filled" style={{ width: `${track.doneNess || 0}%` }}></div>
              </div>
            </div>
            <div className="track-description">{track.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection;