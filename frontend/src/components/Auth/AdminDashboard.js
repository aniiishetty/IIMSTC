// components/AdminDashboard/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { createUser, createFaculty, createTest, uploadQuestions } from '../../services/adminService';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import '../styles/AdminDashboard.css';



const AdminDashboard = () => {
    // State for user creation
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    });
    const [userResponse, setUserResponse] = useState(null); // Response from API

    // State for faculty creation
    const [facultyData, setFacultyData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    });
    const [facultyResponse, setFacultyResponse] = useState(null); // Response from API

    const [copied, setCopied] = useState(false); // State for copy functionality
    const [showCreateUser, setShowCreateUser] = useState(false); // State to manage visibility of create user form
    const [showCreateFaculty, setShowCreateFaculty] = useState(false); // State to manage visibility of create faculty form
    const [showCreateTest, setShowCreateTest] = useState(false); // State to manage visibility of create test form

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await createUser(userData.firstName, userData.lastName, userData.dateOfBirth);
            setUserResponse(response);
        } catch (error) {
            console.error('Error creating user:', error);
        }
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

    const [formData, setFormData] = useState({
        title: '', // Ensure title is initialized in state
        questions: [
            { text: '', options: ['', '', '', ''], correctAnswer: 0 }
        ],
        noTabSwitch: false,
        webcamAccess: false,
        timeLimit: 0
    });
    const [testId, setTestId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [questionsFile, setQuestionsFile] = useState(null); // State for CSV file upload

    const handleChange = (e, qIndex, oIndex) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => {
            if (qIndex !== undefined) {
                const questions = [...prevState.questions];
                if (oIndex !== undefined) {
                    questions[qIndex].options[oIndex] = value;
                } else {
                    questions[qIndex][name] = value;
                }
                return { ...prevState, questions };
            }
            return { ...prevState, [name]: type === 'checkbox' ? checked : value };
        });
    };

    const addQuestion = () => {
        setFormData(prevState => ({
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
            // Validate required fields
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
            setTestId(response.testId); // Assuming the response contains the testId
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
            formDataToSend.append('title', formData.title); // Ensure title is included

            const response = await uploadQuestions(formDataToSend);
            console.log('Questions uploaded successfully:', response);
            // Handle success feedback or further actions if needed
        } catch (error) {
            console.error('Error uploading questions:', error);
        }
    };

    // Styles and toggle function for sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        // Reset copied state after a certain duration or on certain actions
        const timeout = setTimeout(() => {
            setCopied(false);
        }, 3000); // Reset after 3 seconds

        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <div style={{ display: 'flex' }}>
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                {/* Sidebar toggle button */}
                <div className="sidebar-toggle" onClick={toggleSidebar}>
                    {sidebarOpen ? '<' : '>'}
                </div>
                {/* Sidebar options */}
                <button
                    className={`sidebar-option ${showCreateUser ? 'active' : ''}`}
                    onClick={() => {
                        setShowCreateUser(true);
                        setShowCreateFaculty(false);
                        setShowCreateTest(false);
                    }}
                >
                    {sidebarOpen                         ? 'Create User' : 'User'}
                </button>
                <button
                    className={`sidebar-option ${showCreateFaculty ? 'active' : ''}`}
                    onClick={() => {
                        setShowCreateFaculty(true);
                        setShowCreateUser(false);
                        setShowCreateTest(false);
                    }}
                >
                    {sidebarOpen ? 'Create Faculty' : 'Faculty'}
                </button>
                <button
                    className={`sidebar-option ${showCreateTest ? 'active' : ''}`}
                    onClick={() => {
                        setShowCreateTest(true);
                        setShowCreateUser(false);
                        setShowCreateFaculty(false);
                    }}
                >
                    {sidebarOpen ? 'Create Test' : 'Test'}
                </button>
            </div>
            <div className={`content ${sidebarOpen ? 'open' : 'closed'}`}>
                {/* Create User Form */}
                {showCreateUser && (
                    <form className="form" onSubmit={handleCreateUser}>
                        <h2>Create User</h2>
                        <input
                            type="text"
                            name="firstName"
                            value={userData.firstName}
                            onChange={(e) =>
                                setUserData({ ...userData, firstName: e.target.value })
                            }
                            placeholder="First Name"
                            className="input"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={userData.lastName}
                            onChange={(e) =>
                                setUserData({ ...userData, lastName: e.target.value })
                            }
                            placeholder="Last Name"
                            className="input"
                        />
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={userData.dateOfBirth}
                            onChange={(e) =>
                                setUserData({ ...userData, dateOfBirth: e.target.value })
                            }
                            placeholder="Date of Birth"
                            className="input"
                        />
                        <button type="submit" className="button">
                            Create User
                        </button>
                        {userResponse && (
                            <div>
                                <p>Username: {userResponse.username}</p>
                                <p>Password: {userResponse.password}</p>
                                <CopyToClipboard
                                    text={userResponse.password}
                                    onCopy={() => setCopied(true)}
                                >
                                    <button className="button">
                                        <FaCopy />
                                    </button>
                                </CopyToClipboard>
                                {copied ? <span className="copied">Copied!</span> : null}
                            </div>
                        )}
                    </form>
                )}

                {/* Create Faculty Form */}
                {showCreateFaculty && (
                    <form className="form" onSubmit={handleCreateFaculty}>
                        <h2>Create Faculty</h2>
                        <input
                            type="text"
                            name="firstName"
                            value={facultyData.firstName}
                            onChange={(e) =>
                                setFacultyData({ ...facultyData, firstName: e.target.value })
                            }
                            placeholder="First Name"
                            className="input"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={facultyData.lastName}
                            onChange={(e) =>
                                setFacultyData({ ...facultyData, lastName: e.target.value })
                            }
                            placeholder="Last Name"
                            className="input"
                        />
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={facultyData.dateOfBirth}
                            onChange={(e) =>
                                setFacultyData({ ...facultyData, dateOfBirth: e.target.value })
                            }
                            placeholder="Date of Birth"
                            className="input"
                        />
                        <button type="submit" className="button">
                            Create Faculty
                        </button>
                        {facultyResponse && (
                            <div>
                                <p>Username: {facultyResponse.username}</p>
                                <p>Password: {facultyResponse.password}</p>
                                <CopyToClipboard
                                    text={facultyResponse.password}
                                    onCopy={() => setCopied(true)}
                                >
                                    <button className="button">
                                        <FaCopy />
                                    </button>
                                </CopyToClipboard>
                                {copied ? <span className="copied">Copied!</span> : null}
                            </div>
                        )}
                    </form>
                )}

                {/* Create Test Form */}
                {showCreateTest && (
                    <form className="form" onSubmit={handleSubmit}>
                        <h2>Create Test</h2>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleChange(e)}
                            placeholder="Title"
                            className="input"
                        />
                        {formData.questions.map((question, qIndex) => (
                            <div key={qIndex} className="question-container">
                                <input
                                    type="text"
                                    name="text"
                                    value={question.text}
                                    onChange={(e) => handleChange(e, qIndex)}
                                    placeholder="Question"
                                    className="input"
                                />
                                {question.options.map((option, oIndex) => (
                                    <input
                                        key={oIndex}
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleChange(e, qIndex, oIndex)}
                                        placeholder={`Option ${oIndex + 1}`}
                                        className="input"
                                    />
                                ))}
                                <select
                                    value={question.correctAnswer}
                                    onChange={(e) => handleChange(e, qIndex)}
                                    name="correctAnswer"
                                    className="input"
                                >
                                    <option value="">Select Correct Answer</option>
                                    {question.options.map((_, index) => (
                                        <option key={index} value={index}>
                                            Option {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button type="button" className="button" onClick={addQuestion}>
                            Add Question
                        </button>
                        <label>
                            No Tab Switch
                            <input
                                type="checkbox"
                                name="noTabSwitch"
                                checked={formData.noTabSwitch}
                                onChange={(e) => handleChange(e)}
                            />
                        </label>
                        <label>
                            Webcam Access
                            <input
                                type="checkbox"
                                name="webcamAccess"
                                checked={formData.webcamAccess}
                                onChange={(e) => handleChange(e)}
                            />
                        </label>
                        <input
                            type="number"
                            name="timeLimit"
                            value={formData.timeLimit}
                            onChange={(e) => handleChange(e)}
                            placeholder="Time Limit (in minutes)"
                            className="input"
                        />
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="input"
                        />
                        <button type="submit" className="button">
                            Create Test
                        </button>
                        {successMessage && <p>{successMessage}</p>}
                        {testId && (
                            <div>
                                <p>Test ID: {testId}</p>
                                <CopyToClipboard
                                    text={testId}
                                    onCopy={() => setCopied(true)}
                                >
                                    <button className="button">
                                        <FaCopy />
                                    </button>
                                </CopyToClipboard>
                                {copied ? <span className="copied">Copied!</span> : null}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

