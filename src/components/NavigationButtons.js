import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuestions } from './QuestionsContext'; // Make sure this path is correct
import './NavigationButtons.css'
const buttonStyles = {
  continue: { backgroundColor: "#960000"  },
  testSkills: { backgroundColor: "#FFC0AB" },
  subjectSelect: { backgroundColor: "#FFDEAB" }
};

const NavigationButtons = ({isResult}) => {
  const navigate = useNavigate();
  const { fetchQuestions } = useQuestions();

  const handleFetchAndNavigate = async (mode) => {
        const questionURL = `${process.env.REACT_APP_BACKEND_URL}/test/protected/${mode}`;

    switch(mode)
    {
      case "continue":
        await fetchQuestions(questionURL, {});
        navigate('/questions-display')
        break;
      case "random":
        if(isResult)
          {
            navigate('/')
          }
          else{
            await fetchQuestions(questionURL, {})
            navigate('/questions-display')
          }
        break;
      default:
        break;
    }

    
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
      <div className="action-button-nav" style={buttonStyles.continue} onClick={() => handleFetchAndNavigate('continue')}>
        <div style={{fontWeight:"bold"}}>Continue</div>
            <div className="subtitle">{
               !isResult
               ?
               "Start where you left off"
               :
               "Continue worksheet"
            }</div>
          
        
      </div>
    
      {/* Test Skills (Random Quiz) Button */}

          <div className="action-button-nav" style={buttonStyles.testSkills} onClick={() => handleFetchAndNavigate('random')}>
          <div style={{fontWeight:"bold",color:"black"}}>{isResult?"Finish":"Random Quiz"} </div>
          <div className="subtitle" style={{color:'black'}}>{isResult?"Back to Main Menu":"Random Quiz"}</div>
        </div>
    


      <Link to="/subject-select" style={{ ...buttonStyles.subjectSelect, color: 'black', textDecoration: 'inherit' }} className="action-button-nav">
        <div style={{fontWeight:"bold"}}>Subject Select</div>
        <div id="subjectselectsub" className="subtitle">Practice {isResult?"another":"any"} subject</div>
      </Link>
    </div>
  );};

export default NavigationButtons;
