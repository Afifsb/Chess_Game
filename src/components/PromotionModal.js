import React from 'react';

const PromotionModal = ({ onPromote }) => {
  const pieces = ['Q', 'R', 'B', 'N'];

  return (
    <div className="promotion-modal">
      <h3>Choose a piece for promotion:</h3>
      <div className="promotion-options">
        {pieces.map((piece) => (
          <button key={piece} onClick={() => onPromote(piece)}>
            <img src={`/Images/w${piece}.png`} alt={piece} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromotionModal;