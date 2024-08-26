import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import './QuestionsDisplay.css';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useQuestions } from './QuestionsContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import StatusBar from './StatusBar';
import parse from 'html-react-parser';

const QuestionsDisplay = () => {
  const { questions } = useQuestions(); // Removed unused loading and setLoading
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const activeQuestion = questions[activeQuestionIndex];
  const [userInfo, setUserInfo] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const questionRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        setUserInfo(userInfo);
      } else {
        console.log('No user info found in localStorage.');
      }
      console.log(questions)

    };

    fetchUserInfo();

    if (activeQuestion?.skills?.lesson_link) {
      console.log('Video lesson link available:', activeQuestion.skills.lesson_link);
    }
  }, [activeQuestionIndex, questions]);

  useEffect(() => {
    if (activeQuestion?.type_id === 2) {
      const inputs = document.querySelectorAll('.lineinput');
      inputs.forEach(input => {
        input.placeholder = 'Type your answer here';
      });
    }
  }, [activeQuestion]);

  const renderKaTex = (htmlString) => {
    const regexInline = /\$\$([^$]+?)\$\$/g;
    let result = htmlString.replace(regexInline, (match, formula) => `<span class="inline-math">${formula}</span>`);

    return parse(result, {
      replace: (domNode) => {
        if (domNode.attribs && domNode.attribs.class === "inline-math") {
          return <InlineMath math={domNode.children[0].data} />;
        }
      }
    });
  };

  const handleMCQ = (index) => {
    console.log('Selected MCQ option:', index);
  };

      setIsAnswerCorrect(allAnswersCorrect); // Update the state based on the correctness of all answers
      console.log('All answers ---',allAnswersCorrect)
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
      //     }

    navigate('/results', {state: { resultData:{
      kudos:10,
      percentage:30,
      name:"Aqib",
      correct:2,
      total:5,
  }}});
    
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!questions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className='page-container'>
      <div className='header-container'>
        <div className='font-container'>
          <FontAwesomeIcon icon={faAngleLeft} onClick={handleGoBack} className="backArrow"/>
          {userInfo?.game_level && <div className='game-level'>{userInfo.game_level}</div>}
        </div>
        <StatusBar completed={answeredCount} total={5} />
      </div>
      <div className='question-container'>
        <div className='primary'>Primary 4</div>
        <div className="question-text" ref={questionRef}>
          {activeQuestion?.question && renderKaTex(DOMPurify.sanitize(activeQuestion.question))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsDisplay;
