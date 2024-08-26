import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MastercodeEnrollment.css';
import { useQuestions } from './QuestionsContext'; // Import useQuestions hook

const MastercodeEnrollment = () => {
  const [mastercode, setMastercode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const navigate = useNavigate();
  const { fetchQuestions } = useQuestions(); // Use the useQuestions hook to access fetchQuestions

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the payload for the mastercode enrollment
    const payload = {
      mastercode,
      firstname: firstName,
      lastname: lastName,
      date_of_birth: dateOfBirth,
    };

    // Call fetchQuestions with the specific URL for mastercode enrollment
    try {
      let data=await fetchQuestions(`${process.env.REACT_APP_BACKEND_URL}/mastercode`, payload, 'enrollment');
      console.log("data----",data)
      } catch (error) {
      // Handle any errors
      // console.error('Error during mastercode enrollment:', error);
      navigate('/error', { state: { errorMessage: error.message || 'An error occurred during enrollment.' } });
    }
  };

  return (
    <div className="form-container">
      <div className="form-message">
        <h2>Unlock Your Adventure</h2>
        <p>Enter your mastercode and personal details to embark on your grand adventure.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Mastercode:
          <input type="text" value={mastercode} className="input-field" onChange={(e) => setMastercode(e.target.value)} />
        </label>
        <label>
          First Name:
          <input type="text" value={firstName} className="input-field" onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} className="input-field" onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          Date of Birth:
          <input type="date" value={dateOfBirth} className="input-field" onChange={(e) => setDateOfBirth(e.target.value)} />
        </label>
        <button type="submit" className="submit-button">Enroll</button>
      </form>
    </div>
  );
};

export default MastercodeEnrollment;