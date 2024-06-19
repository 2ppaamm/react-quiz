// StatusBar.js
import React from 'react';

const StatusBar = ({ completed, total }) => {
  // Calculates the percentage of questions answered
  const completedPercentage = (completed / total) * 100 + '%';

  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', height: '10px', margin: '10px 0',borderRadius:"10px" }}>
      <div style={{ width: completedPercentage, height: '100%', backgroundColor: '#960000', borderRadius:"10px"}} />
    </div>
  );
};

export default StatusBar;
