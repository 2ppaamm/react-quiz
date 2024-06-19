import React, { useState, useContext, useEffect,useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './QuestionsDisplay.css';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useQuestions } from './QuestionsContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee,faAngleLeft, faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import StatusBar from './StatusBar';
import parse from 'html-react-parser';
import Confetti from 'react-confetti';
import { ReactComponent as GameLevel } from '../game_level.svg';


const QuestionsDisplay = () => {
  const { fetchQuestions,loading,setLoading } = useQuestions();
  const { questions, testId, setQuestions, setTestId } = useQuestions();
  const { getIdTokenClaims } = useAuth0();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_BACKEND_URL}`;
  const activeQuestion = questions[activeQuestionIndex];
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const imagePath = `${process.env.PUBLIC_URL}/images/${'kudos.gif'}`; // Construct the path with PUBLIC_URL
  const questionRef = useRef(null);
  function pixelToPercentage(pixelValue) {
    return (pixelValue / window.innerHeight) * 100;
  }
  useEffect(() => {
    //After five questions before submit go to success page 
    //Result screen show animation
    const fetchUserInfo = () => {
      // Attempt to retrieve user info from localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        console.log("user Info ---",userInfo?.game_level)
        if (userInfo && userInfo.game_level !==undefined ){
          setUserInfo(userInfo)
        }
      } else {
        // Optionally, handle the case where no user info is found in localStorage
        console.log('No user info found in localStorage.');
      }
    };
    
    fetchUserInfo();
    const testType = localStorage.getItem('testType');
    console.log("Test type",testType);
    if (testType === 'subjectSelect' && activeQuestion?.skills?.lesson_link) {
      setShowVideoPopup(true);
    } else {
      setShowVideoPopup(false);
    }
  }, [activeQuestionIndex, questions]);

  const handleWatchVideo = () => {
    const videoUrl = `${process.env.REACT_APP_BACKEND_URL}/${activeQuestion.skill.lesson_link}`;
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleOverlay = () => {
    if(isAnswerCorrect)
    {
      goToNextQuestion()
    }
    else
    {
      goToNextQuestion()
      setIsAnswerCorrect(null)
    }
    setAnsweredCount(count=>++count)
    };


  useEffect(() => {
    if (activeQuestion?.type_id === 2) {
      // Clear inputs and set placeholders if the current question is of type 2
      const inputs = document.querySelectorAll('.lineinput');
      inputs.forEach(input => {
      if (input.placeholder === '?') {
            input.placeholder = 'Type your answer here'; // Update placeholder
      }    });
    }
  }, [activeQuestion]);

  const handleCloseVideoPopup = () => {
    setShowVideoPopup(false);
  };
  
  const renderKaTex = (htmlString) => {
    // Simplified regex that only looks for inline math
    const regexInline = /\$\$([^$]+?)\$\$/g;

    let result = htmlString.replace(regexInline, (match, formula) => {
      // Directly return the InlineMath component as a string (won't work but for illustration)
      return `<span class="inline-math">${formula}</span>`;
    });

    // Attempt to parse and replace with InlineMath components
    return parse(result, {
      replace: (domNode) => {
        if (domNode.attribs && domNode.attribs.class === "inline-math") {
          // This won't work as expected because html-react-parser can't directly render React components from strings
          return <InlineMath math={domNode.children[0].data} />;
        }
      }
    });
  };

  const handleMCQ = (index) => {
    setSelectedOption(index);  // Store the index of the selected option
  };
  const handleSubmitMCQ = () => {
    if (selectedOption !== null) {
      const correct = parseInt(questions[activeQuestionIndex].correct_answer) === selectedOption;
      setIsAnswerCorrect(correct);
      setUserAnswers(prevAnswers => [...prevAnswers, { question_id: questions[activeQuestionIndex].id, answer: selectedOption }]);
      setSelectedOption(null); // Reset selection
    }
  };
 
  const handleFIBSubmit = () => {
      let allAnswersCorrect = true;
      const fibAnswers = [];

      // Loop through each expected answer, starting with _1 to _4
      for (let i = 1; i <= 4; i++) {
        // Construct the input ID using `activeQuestion.source` and the current index
        const inputId = `${activeQuestion.source}_${i}`;
        const userAnswer = document.getElementById(inputId)?.value.trim();
        fibAnswers.push(userAnswer); // Collect user answers for submission

        // Since your answers likely start with "answer0", adjust index by -1 for correct answer comparison
        if (userAnswer !== activeQuestion[`answer${i - 1}`]?.toString()) {
          allAnswersCorrect = false;
          break; // If any answer is incorrect, exit the loop early
        }
      }

      setIsAnswerCorrect(allAnswersCorrect); // Update the state based on the correctness of all answers
      setUserAnswers(prevAnswers => [...prevAnswers, { question_id: activeQuestion.id, answer: fibAnswers }]);
  };

  const goToNextQuestion = () => {
    if (activeQuestionIndex < 4) {
    // Not the last question, so move to the next question
    setActiveQuestionIndex(currentIndex => currentIndex + 1);
      if (activeQuestion?.type_id === 2) {
        // Clear inputs and set placeholders if the current question is of type 2
        const inputs = document.querySelectorAll('.lineinput');
        inputs.forEach(input => {
          input.value = ''; // Clear the input
          input.placeholder = 'Type your answer here'; // Update placeholder
        });
      }    
    } else {
      // This is the last question, so submit answers
      submitAnswers();
    }
      setIsAnswerCorrect(null);
  };

  const submitButtonText = isAnswerCorrect === null ? "Submit" : isAnswerCorrect ? "Correct" : "Not correct";
  const buttonIcon = isAnswerCorrect === null ? "" : isAnswerCorrect ? "✓" : "✕";

  const submitAnswers = async (event) => {
    // Prepare the payload for submitting answers
    setLoading(true)
    console.log("User Answers ---",userAnswers);
    const payload = {
        test: testId,
        question_id: userAnswers.map(a => a.question_id),
        answer: userAnswers.map(a => a.answer),
      };

    // Call fetchQuestions with the specific URL for mastercode enrollment
    //Code has been comment as api contain issue
    // try {
    //     const data = await fetchQuestions(`${process.env.REACT_APP_BACKEND_URL}/test/answers`, payload, 'answers');
        
    //     if (data.code === 206) {
    //        navigate('/results', {state: { resultData:data}});
    //     }
    //     if (data.code === 203) {
    //         navigate('/althomepage');
    //     } else if (data.questions && data.questions.length === 0) {
    //         navigate('/error', { state: { message: data.message || 'No questions found for this selection.' } });
    //     }

    //     if (data.questions && data.questions.length > 0) {
    //       navigate('/questions-display');
    //       setActiveQuestionIndex(0);
    //     }
    // } catch (error) {
    //     navigate('/error', { state: { errorMessage: error.message || 'An error occurred.' } });

    navigate('/results', {state: { resultData:{
      kudos:10,
      percentage:30,
      name:"Aqib",
      correct:2,
      total:5,
  }}});
    
  };

  const handleGoBack = () => {
    navigate('/'); // Navigates to the root page
  };

  if(loading)
  return (
    <div style={{display:'flex',alignItems:"flex-start"}}>
    <p>Loading...</p>
    </div>
  )

  return (
    <div className='page-container'>
      {/* Header */}
      <div className='header-container'>
      <div className='font-container'>
        <span className='back-arrow'><FontAwesomeIcon icon={faAngleLeft} onClick={handleGoBack} className="backArrow"/></span>
        <span className='game-level-container'> <div className='game-level'><GameLevel width={20} height={20} style={{paddingRight:8}}/>{userInfo?.game_level}</div></span>
      </div>
      {/* Status bar */}
      <StatusBar completed={answeredCount} total={5} />
      </div>
    <div className={`question-container ${isAnswerCorrect!==null?'disabled':''}`}>
      <div className='primary'>
        Primary 4
      </div>
      <div className="question-text" ref={questionRef}>
        {activeQuestion?.question && renderKaTex(DOMPurify.sanitize(activeQuestion.question))}
      </div>
      {activeQuestion?.question_image && (
          <img src={`${baseUrl}${activeQuestion.question_image}`} alt="Question" className="question-image" />
      )}
      {activeQuestion?.skill && activeQuestion.skill.lesson_link && (
        <div className="watch-video-link" onClick={handleWatchVideo}>
          Watch Video <i className="fas fa-video watch-video-icon"></i>
        </div>
      )}
      {activeQuestion?.type_id === 1 && (
        <div className="answer-options-container">
          { [...Array(4)].map((_, index) => {
              const answerText = activeQuestion[`answer${index}`];
              const answerImage = activeQuestion[`answer${index}_image`];
              if (answerText || answerImage) {
                return (
                  <button
                    key={index}
                    onClick={() => handleMCQ(index)}
                    className={`answer-option ${selectedOption === index ? 'selected' : ''}`}>
                    {answerImage ? (
                      <img src={`${baseUrl}${answerImage}`} alt={`Answer ${index}`} className="answer-image" />
                    ) : (
                      // Render answer text with potential KaTeX expressions
                      renderKaTex(DOMPurify.sanitize(answerText))
                    )}
                  </button>
                );
              }
              return null;
            })
          }
          <button className={`question-submit-button ${isAnswerCorrect!==null? isAnswerCorrect?'correct':'incorrect':''}`} onClick={handleSubmitMCQ}>
           <span className="button-text">{isAnswerCorrect!==null? isAnswerCorrect?"Correct":"Incorrect" :"Submit"} </span>
           <span className="icon-right"> {isAnswerCorrect!==null&&(isAnswerCorrect ?<FontAwesomeIcon icon={faCheckCircle}/>:<FontAwesomeIcon icon={faXmarkCircle}  />)}
        </span>
          </button>
        </div>
      )}

    {activeQuestion?.type_id === 2 && (

                  <button className={`question-submit-button ${isAnswerCorrect!==null? isAnswerCorrect?'correct':'incorrect':''}`} onClick={handleFIBSubmit}>
                  <span className="button-text">{isAnswerCorrect!==null? isAnswerCorrect?"Correct":"Incorrect" :"Submit"} </span>
                  <span className="icon-right"> {isAnswerCorrect!==null&&(isAnswerCorrect ?<FontAwesomeIcon icon={faCheckCircle}/>:<FontAwesomeIcon icon={faXmarkCircle}  />)}
               </span>
                 </button>
      )}
      </div>
      {/* Overlay */}
      {
       isAnswerCorrect!==null&&(<div onClick={handleOverlay} 
       className={`overlay ${isAnswerCorrect!==null? isAnswerCorrect?'overlay-correct':'overlay-incorrect':''}`}
       style={{height:`${Math.floor(pixelToPercentage(questionRef.current.offsetHeight+questionRef.current.offsetTop))>40?50:30}%`}}
       >
        <div className= {`feedback-parallelogram text ${isAnswerCorrect?'':'incorrect'}`}>
        { isAnswerCorrect?'2 Kudos for a Great job!':'Incorrect, 1 kudo for trying 🙂'}
        </div>
       </div>)
      }
      </div>
  );
};
export default QuestionsDisplay;