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

  const submitAnswers = async () => {
    console.log('Submitting answers...');
    navigate('/results', {state: { resultData: { kudos: 10, percentage: 30, name: "Aqib", correct: 2, total: 5 }}});
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
