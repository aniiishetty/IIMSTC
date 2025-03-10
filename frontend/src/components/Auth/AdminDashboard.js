import React, { useState, useEffect } from 'react';
import { FaBars, FaEllipsisH, FaCopy } from "react-icons/fa";
import { BiSearch, BiCalendar } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { PiStudentFill } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import styled from 'styled-components';
import { createUser, createFaculty, createTest, uploadQuestions } from '../../services/adminService';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from '../styles/AdminDashboard.module.css'; // Import CSS module
import { useNavigate } from 'react-router-dom';

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;
const Sidebar = styled(motion.div)`
  width: 80px;
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
`;

const Logo = styled(motion.h1)`
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuItem = styled.a`
  text-decoration: none;
  color: #fff;
  padding: 10px;
  margin: 5px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
    border-radius: 5px;
  }
`;


const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [copied, setCopied] = useState(false);
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

  const [showCreateUser, setShowCreateUser] = useState(true);
  const [showCreateFaculty, setShowCreateFaculty] = useState(false);
  const [showCreateTest, setShowCreateTest] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [userResponse, setUserResponse] = useState(null);

  const [facultyData, setFacultyData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [facultyResponse, setFacultyResponse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    questions: [
      { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ],
    noTabSwitch: false,
    webcamAccess: false,
    timeLimit: 0
  });
  const [testId, setTestId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [questionsFile, setQuestionsFile] = useState(null);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(userData.firstName, userData.lastName, userData.dateOfBirth);
      setUserResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleLogout = () => {
    // Perform any logout actions here, such as clearing tokens
    navigate('/'); // Redirect to Home.js or '/'
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    try {
      const response = await createFaculty(facultyData.firstName, facultyData.lastName, facultyData.dateOfBirth);
      setFacultyResponse(response);
    } catch (error) {
      console.error('Error creating faculty:', error);
    }
  };

  const handleQuestionChange = (e, qIndex, oIndex) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const questions = [...prevState.questions];
      if (oIndex !== undefined) {
        questions[qIndex].options[oIndex] = value; // Handles option input
      } else {
        questions[qIndex][name] = value; // Handles question text input
      }
      return { ...prevState, questions };
    });
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      return { ...prevState, [name]: type === "checkbox" ? checked : value };
    });
  };

  const addQuestion = () => {
    setFormData((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        { text: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || formData.questions.some(q => !q.text || q.options.some(opt => opt === '')) || formData.timeLimit <= 0) {
        throw new Error('All fields (title, questions, noTabSwitch, webcamAccess, timeLimit) are required');
      }

      let formDataToSend = {
        ...formData,
        title: String(formData.title),
        timeLimit: Number(formData.timeLimit),
      };

      const response = await createTest(formDataToSend);
      console.log('Test created successfully:', response);
      setSuccessMessage('Test created successfully!');
      setTestId(response.testId);
      alert(`Test created successfully! Test ID: ${response.testId}`);
    } catch (error) {
      console.error('Error creating test:', error.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setQuestionsFile(file);
  };

  const handleUploadQuestions = async () => {
    if (!questionsFile || !formData.title) {
      console.error('Both CSV file and title are required to upload questions.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('questionsFile', questionsFile);
      formDataToSend.append('title', formData.title);

      const response = await uploadQuestions(formDataToSend);
      console.log('Questions uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading questions:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const renderContent = () => {
    if (showCreateUser) {
      return (
        <div className={styles.createContent}>
          <form className={styles.form} onSubmit={handleCreateUser}>
            <h2>Create User</h2>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
              placeholder="First Name"
              className={styles.input}
            />
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
              placeholder="Last Name"
              className={styles.input}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={(e) =>
                setUserData({ ...userData, dateOfBirth: e.target.value })
              }
              placeholder="Date of Birth"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Create User
            </button>
            {userResponse && (
              <div>
                <p>UserId: {userResponse.userId}</p>
                <p>Password: {userResponse.password}</p>
                <CopyToClipboard
                  text={`${userResponse.userId} ${userResponse.password}`}
                  onCopy={() => setCopied(true)}
                >
                  <button className={styles.button}>
                    <FaCopy />
                  </button>
                </CopyToClipboard>
                {copied ? <span className={styles.copied}>Copied!</span> : null}
              </div>
            )}
          </form>
        </div>
      );
    } else if (showCreateFaculty) {
      return (
        <div className={styles.createContent}>
          <form className={styles.form} onSubmit={handleCreateFaculty}>
            <h2>Create Faculty</h2>
            <input
              type="text"
              name="firstName"
              value={facultyData.firstName}
              onChange={(e) =>
                setFacultyData({ ...facultyData, firstName: e.target.value })
              }
              placeholder="First Name"
              className={styles.input}
            />
            <input
              type="text"
              name="lastName"
              value={facultyData.lastName}
              onChange={(e) =>
                setFacultyData({ ...facultyData, lastName: e.target.value })
              }
              placeholder="Last Name"
              className={styles.input}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={facultyData.dateOfBirth}
              onChange={(e) =>
                setFacultyData({ ...facultyData, dateOfBirth: e.target.value })
              }
              placeholder="Date of Birth"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Create Faculty
            </button>
            {facultyResponse && (
              <div>
                <p>FacultyId: {facultyResponse.facultyId}</p>
                <p>Password: {facultyResponse.password}</p>
                <CopyToClipboard
                  text={`${facultyResponse.facultyId} ${facultyResponse.password}`}
                  onCopy={() => setCopied(true)}
                >
                  <button className={styles.button}>
                    <FaCopy />
                  </button>
                </CopyToClipboard>
                {copied ? <span className={styles.copied}>Copied!</span> : null}
              </div>
            )}
          </form>
        </div>
      );
    } else if (showCreateTest) {
      return (
        <div className={styles.createContent}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Create Test</h2>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              placeholder="Test Title"
              className={styles.input}
            />
            {formData.questions.map((question, qIndex) => (
              <div key={qIndex}>
                <input
                  type="text"
                  name="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(e, qIndex)}
                  placeholder={`Question ${qIndex + 1}`}
                  className={styles.input}
                />
                {question.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(e, qIndex, oIndex)}
                    placeholder={`Option ${oIndex + 1}`}
                    className={styles.input}
                  />
                ))}
                <select
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(e, qIndex)}
                  className={styles.input}
                >
                  {question.options.map((option, oIndex) => (
                    <option key={oIndex} value={oIndex}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className={styles.button}>
              Add Question
            </button>
            <label className={styles.label}>
              <input
                type="checkbox"
                name="noTabSwitch"
                checked={formData.noTabSwitch}
                onChange={handleFieldChange}
              />
              No Tab Switch
            </label>
            <label className={styles.label}>
              <input
                type="checkbox"
                name="webcamAccess"
                checked={formData.webcamAccess}
                onChange={handleFieldChange}
              />
              Webcam Access
            </label>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleFieldChange}
              placeholder="Time Limit (in minutes)"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Create Test
            </button>
            {successMessage && <p>{successMessage}</p>}
            {testId && (
              <div>
                <p>Test ID: {testId}</p>
                <CopyToClipboard text={testId} onCopy={() => setCopied(true)}>
                  <button className={styles.button}>
                    <FaCopy />
                  </button>
                </CopyToClipboard>
                {copied ? <span className={styles.copied}>Copied!</span> : null}
              </div>
            )}
          </form>
          <div className={styles.uploadSection}>
            <h3>Upload Questions from CSV</h3>
            <input type="file" accept=".csv" onChange={handleFileUpload} className={styles.input} />
            <button onClick={handleUploadQuestions} className={styles.button}>
              Upload Questions
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.sidebar}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarAnimation}
      >
        <div className={styles.topSection}>
          <motion.h1
            className={styles.logo}
            animate={isOpen ? 'show' : 'hidden'}
            variants={showAnimation}
          >
            Admin
          </motion.h1>
          <div className={styles.bars}>
            <FaBars onClick={toggle} />
            

          </div>
        </div>

        <div className={styles.search}>
          <div className={styles.searchIcon}>
            <BiSearch />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.input
                type="text"
                placeholder="Search"
                variants={inputAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
              />
            )}
          </AnimatePresence>
        </div>
        <div className={styles.menu}>
          <div
            className={`${styles.link} ${activeSection === 'createUser' ? styles.active : ''}`}
            onClick={() => {
              setActiveSection('createUser');
              setShowCreateUser(true);
              setShowCreateFaculty(false);
              setShowCreateTest(false);
            }}
          >
            <div className={styles.icon}><VscAccount /></div>
            <AnimatePresence>
              {isOpen && <motion.div className={styles.linkText} variants={showAnimation}>Create User</motion.div>}
            </AnimatePresence>
          </div>
          <div
            className={`${styles.link} ${activeSection === 'createFaculty' ? styles.active : ''}`}
            onClick={() => {
              setActiveSection('createFaculty');
              setShowCreateUser(false);
              setShowCreateFaculty(true);
              setShowCreateTest(false);
            }}
          >
            <div className={styles.icon}><PiStudentFill /></div>
            <AnimatePresence>
              {isOpen && <motion.div className={styles.linkText} variants={showAnimation}>Create Faculty</motion.div>}
            </AnimatePresence>
          </div>
          <div
            className={`${styles.link} ${activeSection === 'createTest' ? styles.active : ''}`}
            onClick={() => {
              setActiveSection('createTest');
              setShowCreateUser(false);
              setShowCreateFaculty(false);
              setShowCreateTest(true);
            }}
          >
            <div className={styles.icon}><BiCalendar /></div>
            <AnimatePresence>
              {isOpen && <motion.div className={styles.linkText} variants={showAnimation}>Create Test</motion.div>}
            </AnimatePresence>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
      </motion.div>
      <MainContent>{renderContent()}</MainContent>
    </div>
  );
};
export default AdminDashboard;