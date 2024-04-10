import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuestions } from './QuestionsContext'; // Make sure this path is correct

const buttonStyles = {
  continue: { backgroundColor: "#960000"  },
  testSkills: { backgroundColor: "#E64646" },
  subjectSelect: { backgroundColor: "#FFC0AC" }
};

const NavigationButtons = () => {
  const navigate = useNavigate();
  const { fetchQuestions } = useQuestions();

  const handleFetchAndNavigate = async (mode) => {
    const questionURL = `${process.env.REACT_APP_BACKEND_URL}/test/protected/${mode}`;
    await fetchQuestions(questionURL, {});
    navigate('/questions-display');
  };

  const buttons = [
    {
      id: 'continue',
      text: 'Continue',
      subtitle: 'Start where you left off',
      style: buttonStyles.continue,
      onClick: () => handleFetchAndNavigate('continue')
    },
    {
      id: 'testSkills',
      text: 'Test your skills',
      subtitle: 'Random Quiz',
      style: buttonStyles.testSkills,
      onClick: () => handleFetchAndNavigate('random')
    },
    {
      id: 'subjectSelect',
      text: 'Subject Select',
      subtitle: 'Practice any subject',
      style: buttonStyles.subjectSelect,
      link: '/subject-select'
    }
  ];

 return (
    <div className="buttons-container">
      {/* Continue Button */}
      <div className="action-button" style={buttonStyles.continue} onClick={() => handleFetchAndNavigate('continue')}>
        <strong>Continue</strong>
        <div className="subtitle">Start where you left off</div>
      </div>

      {/* Test Skills (Random Quiz) Button */}
      <div className="action-button" style={buttonStyles.testSkills} onClick={() => handleFetchAndNavigate('random')}>
        <strong>Test your skills</strong>
        <div className="subtitle">Random Quiz</div>
      </div>
      <Link to="/subject-select" style={{ ...buttonStyles.subjectSelect, color: 'black', textDecoration: 'inherit' }} className="action-button">
        <strong>Subject Select</strong>
        <div id="subjectselectsub" className="subtitle">Practice any subject</div>
      </Link>
    </div>
  );};

export default NavigationButtons;
