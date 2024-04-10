import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css'; 

const NavigationBar = () => {
  const navigate = useNavigate(); 

  return (
    <div className="navigation-bar">
      <img src={`${process.env.PUBLIC_URL}/allgifted logo.gif`} alt="Logo" className="logo" />
      <div className="hamburger-icon" onClick={() => navigate('/menu')}>
        &#9776; {/* Common symbol for a hamburger menu */}
      </div>
    </div>
  );
};

export default NavigationBar;
