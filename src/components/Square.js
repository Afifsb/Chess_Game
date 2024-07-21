import React from 'react';
import Piece from './Piece';

const Square = ({ piece, onClick, isPossibleMove, isSelected, mode }) => {
  let className = "square";
  if (mode === 'practice' && isPossibleMove) className += " possible-move";
  if (isSelected) className += " selected";

  return (
    <div className={className} onClick={onClick}>
      <Piece piece={piece} />
    </div>
  );
};

export default Square;