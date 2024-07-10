import React from 'react';
import Piece from './Piece';
import './ChessGame.css';

const Square = ({ piece, onClick, isSelected, isLight, isPossibleMove }) => {
  return (
    <div 
      className={`square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      {piece && <Piece piece={piece} />}
      {isPossibleMove && <div className="possible-move"></div>}
    </div>
  );
};

export default Square;