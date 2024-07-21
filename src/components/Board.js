import React from 'react';
import Square from './Square';

const Board = ({ board, onSquareClick, possibleMoves, selectedPiece, mode }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => {
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                isPossibleMove={mode === 'practice' && isPossibleMove}
                isSelected={isSelected}
                mode={mode}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;