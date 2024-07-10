import React, { useState } from 'react';
import styled from 'styled-components';

// Define styled components
const FormContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CourseForm = ({ handleAddCourse, onClose }) => {
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    code: '',
    blueprint: false,
    template: false,
    timeZone: '',
    subaccount: '',
    term: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseDetails(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newCourse = {
      ...courseDetails,
      id: generateUniqueId(), // Generate a unique ID (using a more robust function)
      duration: calculateDuration(courseDetails.term), // Calculate duration based on term
    };

    handleAddCourse(newCourse);
    onClose();
  };

  const validateForm = () => {
    const { name, code, timeZone, subaccount, term } = courseDetails;

    if (!name || !code || !timeZone || !subaccount || !term) {
      alert('Please fill in all required fields.');
      return false;
    }

    // Additional validation logic can be added here

    return true;
  };

  const generateUniqueId = () => {
    // Example of generating a unique ID (using a more robust function)
    return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric ID
  };

  const calculateDuration = (term) => {
    // Example of calculating duration based on term (replace with your logic)
    switch (term) {
      case 'Spring':
      case 'Fall':
        return '16 weeks';
      case 'Summer':
        return '12 weeks';
      default:
        return 'Unknown duration';
    }
  };

  return (
    <FormContainer>
      <FormTitle>Course Details</FormTitle>
      <FormGroup>
        <Label>Name</Label>
        <Input type="text" name="name" value={courseDetails.name} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Course Code</Label>
        <Input type="text" name="code" value={courseDetails.code} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Blueprint Course</Label>
        <Input type="checkbox" name="blueprint" checked={courseDetails.blueprint} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Course Template</Label>
        <Input type="checkbox" name="template" checked={courseDetails.template} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Time Zone</Label>
        <Select name="timeZone" value={courseDetails.timeZone} onChange={handleChange}>
          <option value="">Select Time Zone</option>
          <option value="Mountain Time (US & Canada) (07:00-06:00)">Mountain Time (US & Canada) (07:00-06:00)</option>
          {/* Add more time zones as needed */}
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>Subaccount</Label>
        <Input type="text" name="subaccount" value={courseDetails.subaccount} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Term</Label>
        <Select name="term" value={courseDetails.term} onChange={handleChange}>
          <option value="">Select Term</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
          {/* Add more terms as needed */}
        </Select>
      </FormGroup>
      <Button onClick={handleSubmit}>Submit</Button>
      <Button onClick={onClose}>Close</Button>
    </FormContainer>
  );
};

export default CourseForm;
