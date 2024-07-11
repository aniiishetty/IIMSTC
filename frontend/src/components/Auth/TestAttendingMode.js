import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { getTestByTitle } from '../../services/testService';
import { FaBars, FaCog } from "react-icons/fa";
import { BiSearch, BiCalendar } from "react-icons/bi";
import { VscAccount, VscDashboard } from "react-icons/vsc";
import { PiStudentFill } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import styled from 'styled-components';
import styles from '../styles/test.module.css'; // Assuming your CSS file is named test.module.css
import { useNavigate } from 'react-router-dom';
const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const TestAttendingMode = () => {
  const [title, setTitle] = useState('');
  const [test, setTest] = useState(null);
  const [webcamAccess, setWebcamAccess] = useState(false);
  const [error, setError] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);

  const inputAnimation = {
    hidden: { width: 0, padding: 0, transition: { duration: 0.1 } },
    show: { width: "100px", padding: "5px 10px", transition: { duration: 0.1 } },
  };

  const showAnimation = {
    hidden: { width: 0, opacity: 0, transition: { duration: 0.1 } },
    show: { opacity: 1, width: "auto", transition: { duration: 0.1 } },
  };

  const sidebarAnimation = {
    open: { width: "200px", transition: { duration: 0.1, type: "spring", damping: 10 } },
    closed: { width: "80px", transition: { duration: 0.1, type: "spring", damping: 10 } },
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (test && test.noTabSwitch) {
        setTabSwitchCount((prevCount) => prevCount + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [test]);

  useEffect(() => {
    console.log('Tab switch count changed:', tabSwitchCount);
    if (tabSwitchCount === 2) {
      showAlertMessage('Test ended due to multiple tab switches.');
      endTest(); // Call endTest() after showing the alert for the second tab switch
    } else if (tabSwitchCount === 1) {
      showAlertMessage('You are not allowed to switch tabs during the test.');
    }
  }, [tabSwitchCount]);

  const handleTestAccess = async () => {
    try {
      const response = await getTestByTitle(title); // Pass title as parameter
      console.log('Test accessed:', response);
      setTest(response);
      setAnswers(new Array(response.questions.length).fill(null));
      if (response.webcamAccess) {
        setWebcamAccess(true);
      } else {
        setWebcamAccess(false);
      }
      setActiveSection('dashboard'); // Set active section to dashboard after accessing the test
    } catch (error) {
      setError(error.message);
      console.error('Error accessing test:', error);
    }
  };

  const endTest = () => {
    console.log('Test ended.');
    setTest(null);
    setWebcamAccess(false);
    setTitle(''); // Reset title state
    setTabSwitchCount(0);
    setAnswers([]);
  };

  const showAlertMessage = (message, isCorrect) => {
    setError(message);
    setShowAlert(true);
    const alertElement = document.querySelector(`.${styles.testAlert}`);
    if (alertElement) {
      alertElement.classList.add(isCorrect ? styles.correct : styles.incorrect);
      setTimeout(() => {
        setShowAlert(false);
        setError(null);
        alertElement.classList.remove(isCorrect ? styles.correct : styles.incorrect);
      }, 5000);
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (!test.questions[questionIndex].answered) {
      const updatedAnswers = [...answers];
      updatedAnswers[questionIndex] = optionIndex; // Start from 0 (zero-based index)
      setAnswers(updatedAnswers);

      const correctAnswerIndex = parseInt(test.questions[questionIndex].correctAnswer, 10);
      console.log('Correct Answer Index:', correctAnswerIndex, 'Selected Option Index:', optionIndex);

      const isCorrect = optionIndex === correctAnswerIndex;
      const resultMessage = isCorrect ? 'Correct answer!' : 'Incorrect answer.';
      
      // Display alert for correct or incorrect answer
      showAlertMessage(resultMessage, isCorrect);

      const updatedTest = { ...test };
      updatedTest.questions[questionIndex].answered = true;
      updatedTest.questions[questionIndex].answeredIndex = optionIndex + 1; // Display starts from 1
      setTest(updatedTest);
      console.log('Question answered:', questionIndex, 'Answer:', optionIndex);
    }
  };
  const handleLogout = () => {
    // Perform any logout actions here, such as clearing tokens
    navigate('/'); // Redirect to Home.js or '/'
  };
  const handleSubmit = () => {
    const score = answers.reduce((total, answer, index) => {
      const correctAnswerIndex = parseInt(test.questions[index].correctAnswer, 10);
      console.log(`Question ${index + 1}: Correct Answer Index - ${correctAnswerIndex}, User Answer - ${answer}`);
      return answer === correctAnswerIndex ? total + 1 : total;
    }, 0);

    alert(`You scored ${score} out of ${test.questions.length}`);
  };

  return (
    <div className={styles.main_container}>
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={sidebarAnimation}
        className={`${styles.sidebar} ${isOpen ? styles.maximized : styles.minimized}`}
      >
        <div className={styles.top_section}>
          <AnimatePresence>
            {isOpen && (
              <motion.h1
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={styles.logo}
              >
                Hi, Tutor
              </motion.h1>
            )}
          </AnimatePresence>
          <div className={styles.bars}>
            <FaBars onClick={toggle} />
          </div>
        </div>
        
        <div className={styles.search}>
          <div className={styles.search_icon}>
            <BiSearch />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.input
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={inputAnimation}
                type="text"
                placeholder="Search"
                className={styles.input}
              />
            )}
          </AnimatePresence>
        </div>
        <div className={styles.routes}>
          <div onClick={() => setActiveSection('dashboard')} className={styles.link}>
            <div className={styles.icon}><VscDashboard /></div>
            <AnimatePresence>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={styles.link_text}
              >
                Dashboard
              </motion.div>
            </AnimatePresence>
          </div>
          <div onClick={() => setActiveSection('account')} className={styles.link}>
            <div className={styles.icon}><VscAccount /></div>
            <AnimatePresence>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={styles.link_text}
              >
                Account
              </motion.div>
            </AnimatePresence>
          </div>
          <div onClick={() => setActiveSection('courses')} className={styles.link}>
            <div className={styles.icon}><PiStudentFill /></div>
            <AnimatePresence>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={styles.link_text}
              >
                Courses
              </motion.div>
            </AnimatePresence>
          </div>
          <div onClick={() => setActiveSection('calendar')} className={styles.link}>
            <div className={styles.icon}><BiCalendar /></div>
            <AnimatePresence>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={styles.link_text}
              >
                Calendar
              </motion.div>
            </AnimatePresence>
          </div>
          <div onClick={() => setActiveSection('settings')} className={styles.link}>
            <div className={styles.icon}><FaCog /></div>
            <AnimatePresence>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={styles.link_text}
              >
                Settings
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
      </motion.div>
      <MainContent>
        {activeSection === 'dashboard' && (
          <div className={styles.testAttendingContainer}>
            <h2 className={styles.testHeading}>Test Attending Mode</h2>
            <label className={styles.testLabel}>Enter Test Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter test title"
              className={styles.testInput}
            />
            <button onClick={handleTestAccess} className={styles.testButton}>
              Access Test
            </button>

            {showAlert && (
              <p className={`${styles.testAlert} ${showAlert ? styles.show : ''}`}>{error}</p>
            )}

            {test && (
              <div className={styles.testDetails}>
                <h3>{test.title}</h3>
                <p>Time Limit: {test.timeLimit} minutes</p>
                {webcamAccess && (
                  <div className={styles.webcamContainer}>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className={styles.webcam}
                    />
                  </div>
                )}

                {test.questions.map((question, index) => (
                  <div key={index} className={styles.questionContainer}>
                    <p>{question.text}</p>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <input
                          type="radio"
                          id={`q${index}_opt${optionIndex}`}
                          name={`question_${index}`}
                          value={optionIndex} // Updated to start from 0
                          checked={answers[index] === optionIndex}
                          onChange={() => handleOptionSelect(index, optionIndex)}
                          disabled={question.answered}
                        />
                        <label htmlFor={`q${index}_opt${optionIndex}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                ))}

                <button onClick={handleSubmit} className={styles.testButton}>
                  Submit Test
                </button>
              </div>
            )}
          </div>
        )}
      </MainContent>
    </div>
  );
};

export default TestAttendingMode;
