import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { getTestByTitle } from '../../services/testService';
//import '../styles/test.css'; // Assuming your CSS file is named test.css

const TestAttendingMode = () => {
  const [testTitle, setTestTitle] = useState('');
  const [test, setTest] = useState(null);
  const [webcamAccess, setWebcamAccess] = useState(false);
  const [error, setError] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [answers, setAnswers] = useState([]);

  const webcamRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (test && test.noTabSwitch) {
        setTabSwitchCount(prevCount => prevCount + 1);
        console.log('Tab switch count:', tabSwitchCount + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [test]);

  useEffect(() => {
    console.log('Tab switch count changed:', tabSwitchCount);
    if (tabSwitchCount === 1) {
      showAlertMessage('You are not allowed to switch tabs during the test.');
    } else if (tabSwitchCount === 2) {
      endTest();
      showAlertMessage('Test ended due to multiple tab switches.');
    }
  }, [tabSwitchCount]);

  const handleTestAccess = async () => {
    try {
      const response = await getTestByTitle(testTitle);
      console.log('Test accessed:', response);
      setTest(response);
      setAnswers(new Array(response.questions.length).fill(null));
      if (response.webcamAccess) {
        setWebcamAccess(true);
      } else {
        setWebcamAccess(false);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error accessing test:', error);
    }
  };

  const endTest = () => {
    console.log('Test ended.');
    setTest(null);
    setWebcamAccess(false);
    setTestTitle('');
    setTabSwitchCount(0);
    setAnswers([]);
  };

  const showAlertMessage = (message, isCorrect) => {
    setError(message);
    setShowAlert(true);
    const alertElement = document.querySelector('.test-alert');
    if (alertElement) {
      alertElement.classList.add(isCorrect? 'correct' : 'incorrect');
      setTimeout(() => {
        setShowAlert(false);
        setError(null);
        alertElement.classList.remove(isCorrect? 'correct' : 'incorrect');
      }, 5000);
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (!test.questions[questionIndex].answered) {
      const updatedAnswers = [...answers];
      updatedAnswers[questionIndex] = optionIndex + 1; // Updated to start from 1
      setAnswers(updatedAnswers);

      const correctAnswerIndex = parseInt(test.questions[questionIndex].correctAnswer, 10);
      console.log('Correct Answer Index:', correctAnswerIndex, 'Selected Option Index:', optionIndex + 1);

      const isCorrect = optionIndex + 1 === correctAnswerIndex;
      const resultMessage = isCorrect? 'Correct answer!' : 'Incorrect answer.';

      // Display alert for correct or incorrect answer
      showAlertMessage(resultMessage, isCorrect);

      const updatedTest = {...test };
      updatedTest.questions[questionIndex].answered = true;
      updatedTest.questions[questionIndex].answeredIndex = optionIndex + 1;
      setTest(updatedTest);
      console.log('Questionanswered:', questionIndex, 'Answer:', optionIndex + 1);
    }
  };

  const handleSubmit = () => {
    const score = answers.reduce((total, answer, index) => {
      const correctAnswerIndex = parseInt(test.questions[index].correctAnswer, 10);
      console.log(`Question ${index + 1}: Correct Answer Index - ${correctAnswerIndex}, User Answer - ${answer}`);
      return answer === correctAnswerIndex? total + 1 : total;
    }, 0);

    alert(`You scored ${score} out of ${test.questions.length}`);
  };

  return (
    <div className="test-attending-container">
      <h2 className="test-heading">Test Attending Mode</h2>
      <label className="test-label">Enter Test Title:</label>
      <input
        type="text"
        value={testTitle}
        onChange={(e) => setTestTitle(e.target.value)}
        placeholder="Enter test title"
        className="test-input"
      />
      <button onClick={handleTestAccess} className="test-button">
        Access Test
      </button>

      {showAlert && (
        <p className={`test-alert ${showAlert? 'how' : ''}`}>{error}</p>
      )}

      {test && (
        <div className="test-details">
          <h3>{test.title}</h3>
          <p>Time Limit: {test.timeLimit} minutes</p>
          {webcamAccess && (
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
              />
            </div>
          )}

          {test.questions.map((question, index) => (
            <div key={index} className="question-container">
              <p>{question.text}</p>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="radio"
                    id={`q${index}_opt${optionIndex}`}
                    name={`question_${index}`}
                    value={optionIndex + 1} // Updated to start from 1
                    checked={answers[index] === optionIndex + 1}
                    onChange={() => handleOptionSelect(index, optionIndex)}
                    disabled={question.answered}
                  />
                  <label htmlFor={`q${index}_opt${optionIndex}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}

          <button onClick={handleSubmit} className="test-button">
            Submit Test
          </button>
        </div>
      )}
    </div>
  );
};

export default TestAttendingMode;