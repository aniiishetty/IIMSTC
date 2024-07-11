import React, { useState } from 'react';
import { FaBars, FaEllipsisV } from "react-icons/fa"; // Use FaEllipsisV for vertical dots
import { BiSearch, BiCalendar } from "react-icons/bi";
import { VscAccount, VscDashboard } from "react-icons/vsc";
import { PiStudentFill } from "react-icons/pi";
import { FaCog } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import styled from 'styled-components';
import styles from "../styles/Faculty.module.css"; // Main stylesheet for layout
import CourseForm from './courseForm.js'; // Adjust the path based on your project structure
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import react-calendar stylesheet
import { useNavigate } from 'react-router-dom';

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const FacultyDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility
  const [activeSection, setActiveSection] = useState('home');
  const [courses, setCourses] = useState([]);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [unpublishedCourses, setUnpublishedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // State for selected course
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);
  const toggleForm = () => setIsFormOpen(!isFormOpen); // Function to toggle form visibility

  const handleAddCourse = (course) => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); // Generate random color
    course.color = randomColor; // Assign random color to course

    setUnpublishedCourses([...unpublishedCourses, course]);
    setCourses([...courses, course]);
    setIsFormOpen(false);
  };

  const handleUpdateCourse = (updatedCourse) => {
    setCourses(courses.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
    setUnpublishedCourses(unpublishedCourses.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
    setPublishedCourses(publishedCourses.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
    setIsFormOpen(false);
    setSelectedCourse(null);
  };

  const handlePublishCourse = (course) => {
    const updatedUnpublished = unpublishedCourses.filter(c => c !== course);
    setUnpublishedCourses(updatedUnpublished);
    setPublishedCourses([...publishedCourses, course]);
  };

  const handleDeleteCourse = (course) => {
    setUnpublishedCourses(unpublishedCourses.filter(c => c !== course));
    setPublishedCourses(publishedCourses.filter(c => c !== course));
    setCourses(courses.filter(c => c !== course));
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleViewCourse = (course) => {
    alert(`Course Details:\nName: ${course.name}\nDuration: ${course.duration}\nTerm: ${course.term}`);
  };

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
  const handleLogout = () => {
    // Perform any logout actions here, such as clearing tokens
    navigate('/'); // Redirect to Home.js or '/'
  };
  const CourseItem = ({ course, isPublished }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    return (
      <div className={styles.courseCard}>
        <div className={styles.courseCardHeader} style={{ backgroundColor: course.color }}>
          <div className={styles.options}>
            <button className={styles.ellipsisButton} onClick={toggleDropdown}>
              <FaEllipsisV />
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                <div onClick={() => handleEditCourse(course)}>Edit</div>
                <div onClick={() => handleViewCourse(course)}>View</div>
                <div onClick={() => handleDeleteCourse(course)}>Delete</div>
                {!isPublished && (
                  <div onClick={() => handlePublishCourse(course)}>Publish</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styles.courseContent}>
          <div className={styles.courseCategory}>{course.name}<br />
            {course.duration}
            <br />
            {course.term}
          </div>
          {!isPublished && (
            <button className={styles.publishButton} onClick={() => handlePublishCourse(course)}>
              Publish
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div>
            <button onClick={toggleForm} className={styles.button}>Start a new course</button>
            {isFormOpen && <CourseForm onClose={toggleForm} handleAddCourse={handleAddCourse} handleUpdateCourse={handleUpdateCourse} course={selectedCourse} />}
            <div className={styles.courseList}>
              <div className={styles.unpublishedCourses}>
                <h3>Unpublished Courses ({unpublishedCourses.length})</h3>
                {unpublishedCourses.map(course => (
                  <CourseItem key={course.id} course={course} isPublished={false} />
                ))}
              </div>
              <div className={styles.publishedCourses}>
                <h3>Published Courses ({publishedCourses.length})</h3>
                {publishedCourses.map(course => (
                  <CourseItem key={course.id} course={course} isPublished={true} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'account':
        return <div>Account Content</div>;
      case 'courses':
        return (
          <div>
            Courses Content
            {courses.map(course => (
              <CourseItem key={course.id} course={course} isPublished={publishedCourses.includes(course)} />
            ))}
          </div>
        );
      case 'calendar':
        return (
          <div className={styles.calendarSection}>
            <Calendar />
            <div className={styles.courseList}>
              <h3>Courses</h3>
              {courses.map(course => (
                <div key={course.id} className={styles.courseItem} style={{ backgroundColor: course.color }}>
                  {course.name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div className={styles.main_container}>
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={sidebarAnimation}
        className={`${styles.sidebar} ${isOpen ? styles.maximized : styles.minimized}`}
      >
        <div className={styles.top_section}>
          {isOpen && <motion.h1 className={styles.logo} variants={showAnimation}>MyLogo</motion.h1>}
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
          <div className={styles.link} onClick={() => setActiveSection('home')}>
            <div className={styles.icon}><VscDashboard /></div>
            {isOpen && <motion.div className={styles.link_text} variants={showAnimation}>Dashboard</motion.div>}
          </div>
          <div className={styles.link} onClick={() => setActiveSection('account')}>
            <div className={styles.icon}><VscAccount /></div>
            {isOpen && <motion.div className={styles.link_text} variants={showAnimation}>Account</motion.div>}
          </div>
          <div className={styles.link} onClick={() => setActiveSection('courses')}>
            <div className={styles.icon}><PiStudentFill /></div>
            {isOpen && <motion.div className={styles.link_text} variants={showAnimation}>Courses</motion.div>}
          </div>
          <div className={styles.link} onClick={() => setActiveSection('calendar')}>
            <div className={styles.icon}><BiCalendar /></div>
            {isOpen && <motion.div className={styles.link_text} variants={showAnimation}>Calendar</motion.div>}
          </div>
          <div className={styles.link} onClick={() => setActiveSection('settings')}>
            <div className={styles.icon}><FaCog /></div>
            {isOpen && <motion.div className={styles.link_text} variants={showAnimation}>Settings</motion.div>}
          </div>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
      </motion.div>
      <MainContent>
        {renderContent()}
      </MainContent>
    </div>
  );
};

export default FacultyDashboard;

