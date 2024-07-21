import React from 'react';

const Piece = ({ piece }) => {
  const pieceImages = {
    'r': 'bR.png', 'n': 'bN.png', 'b': 'bB.png', 'q': 'bQ.png', 'k': 'bK.png', 'p': 'bP.png',
    'R': 'wR.png', 'N': 'wN.png', 'B': 'wB.png', 'Q': 'wQ.png', 'K': 'wK.png', 'P': 'wP.png',
  };

  return piece ? (
    <img src={`/Images/${pieceImages[piece]}`} alt={piece} className="chess-piece" />
  ) : null;
};

export default Piece;