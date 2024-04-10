import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationButtons from './NavigationButtons';
import './MenuPage.css'; // Make sure the path is correct

const MenuPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Or another action to close the page/modal
  };

  return (
    <div className="menu-page-container">
      <div className="close-button" onClick={handleClose}>
        &times; {/* Close icon */}
      </div>
      <h3 className="menu-title">Menu</h3>
      <NavigationButtons />
      <div className="menu-page-footer">
        <img src={`${process.env.PUBLIC_URL}/allgifted logo.gif`} alt="AllGifted Logo" className="menu-page-logo" />
      </div>
    </div>
  );
};

export default MenuPage;
