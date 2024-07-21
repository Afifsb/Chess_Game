import React, { useState } from 'react';
import Game from './components/Game';
import Welcome from './components/Welcome';
import '../src/components/ChessGame.css';

function App() {
  const [mode, setMode] = useState(null);

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleGoBack = () => {
    setMode(null);
  };

  return (
    <div className="App">
      <h1>React Chess Game</h1>
      {!mode && <Welcome onModeSelect={handleModeSelection} />}
      {mode && (
        <>
          <Game mode={mode} />
          <button onClick={handleGoBack} className="go-back-button">Go Back</button>
        </>
      )}
    </div>
  );
}

export default App;