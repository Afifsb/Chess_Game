import React, { useState, useEffect } from 'react';
import Board from './Board';
import { initialBoard, isValidMove, getPossibleMoves, checkForWinner } from '../utils/chessUtils';
import './ChessGame.css';

const Game = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const newWinner = checkForWinner(board);
    if (newWinner) setWinner(newWinner);
  }, [board]);

  const handleSquareClick = (rowIndex, colIndex) => {
    if (winner) return;

    if (selectedPiece) {
      const from = { row: selectedPiece.row, col: selectedPiece.col };
      const to = { row: rowIndex, col: colIndex };
      
      if (isValidMove(from, to, board, currentPlayer)) {
        const newBoard = board.map(row => [...row]);
        newBoard[to.row][to.col] = selectedPiece.piece;
        newBoard[from.row][from.col] = '';
        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (board[rowIndex][colIndex]) {
      const piece = board[rowIndex][colIndex];
      const isPieceWhite = piece === piece.toUpperCase();
      if ((isPieceWhite && currentPlayer === 'white') || (!isPieceWhite && currentPlayer === 'black')) {
        setSelectedPiece({ piece, row: rowIndex, col: colIndex });
        setPossibleMoves(getPossibleMoves(piece, [rowIndex, colIndex], board));
      }
    }
  };

  const handleRestart = () => {
    setBoard(initialBoard);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setCurrentPlayer('white');
    setWinner(null);
  };

  return (
    <div className="game">
      <h2>Current Player: {currentPlayer}</h2>
      {winner && <h2>Winner: {winner}</h2>}
      <Board 
        board={board} 
        onSquareClick={handleSquareClick} 
        selectedPiece={selectedPiece}
        possibleMoves={possibleMoves}
      />
      <button className="restart-button" onClick={handleRestart}>Restart Game</button>
    </div>
  );
};

export default Game;