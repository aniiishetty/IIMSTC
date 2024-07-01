import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { getTestByTitle } from '../../services/testService';
// import './styles/TestAttendingMode.css'; // Assuming you have a CSS file for styling

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
        setTabSwitchCount(tabSwitchCount + 1);
        if (tabSwitchCount === 2) {
          endTest();
          showAlertMessage('Test ended due to multiple tab switches.');
        } else if (tabSwitchCount === 1) {
          showAlertMessage('You are not allowed to switch tabs during the test.');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabSwitchCount, test]);

  const handleTestAccess = async () => {
    try {
      const response = await getTestByTitle(testTitle);
      setTest(response);
      setAnswers(new Array(response.questions.length).fill(null));
      if (response.webcamAccess) {
        setWebcamAccess(true);
      } else {
        setWebcamAccess(false);
      }
    } catch (error) {
      setError(error.message);
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

  const showAlertMessage = (message) => {
    setError(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setError(null);
    }, 5000);
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (!test.questions[questionIndex].answered) {
      const updatedAnswers = [...answers];
      updatedAnswers[questionIndex] = optionIndex;
      setAnswers(updatedAnswers);
  
      const correctAnswerIndex = test.questions[questionIndex].correctAnswer;
      const isCorrect = optionIndex === correctAnswerIndex;
      const resultMessage = isCorrect ? 'Correct answer!' : 'Incorrect answer.';
      
      // Display alert for correct answer
      if (isCorrect) {
        showAlertMessage(resultMessage);
      }
      
      const updatedTest = { ...test };
      updatedTest.questions[questionIndex].answered = true;
      updatedTest.questions[questionIndex].answeredIndex = optionIndex;
      setTest(updatedTest);
    }
  };
  
  const handleSubmit = () => {
    // Compare answers with the correct answers stored in the test object
    const score = answers.reduce((total, answer, index) => {
      const correctAnswerIndex = test.questions[index].correctAnswer;
      return answer === correctAnswerIndex ? total + 1 : total;
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

      {showAlert && <p className="test-alert">{error}</p>}

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
                    value={optionIndex}
                    checked={answers[index] === optionIndex}
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
