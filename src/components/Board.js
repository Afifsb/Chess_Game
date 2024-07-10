import React from 'react';
import Square from './Square';
import './ChessGame.css';

const Board = ({ board, onSquareClick, selectedPiece, possibleMoves }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            onClick={() => onSquareClick(rowIndex, colIndex)}
            isSelected={selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex}
            isLight={(rowIndex + colIndex) % 2 !== 0}
            isPossibleMove={possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default Board;