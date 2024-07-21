import React from 'react';

const Welcome = ({ onModeSelect }) => {
  return (
    <div className="welcome-container">
      <h2>Welcome to the Chess Game</h2>
      <div className="buttons">
        <button onClick={() => onModeSelect('practice')} className="mode-button">Practice Mode</button>
        <button onClick={() => onModeSelect('1v1')} className="mode-button">1v1 Mode</button>
      </div>
    </div>
  );
};

export default Welcome;