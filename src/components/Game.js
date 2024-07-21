import React, { useState, useEffect } from 'react';
import Board from './Board';
import PromotionModal from './PromotionModal';
import {
  initialBoard,
  isValidMove,
  getPossibleMoves,
  checkForWinner,
  checkForCheckmate,
  checkForStalemate,
  isKingInCheck,
  isMovePuttingKingInCheck
} from '../utils/chessUtils';

const Game = ({ mode }) => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [moveHistory, setMoveHistory] = useState([]);
  const [promotionPawn, setPromotionPawn] = useState(null);

  useEffect(() => {
    updateGameStatus();
  }, [board, currentPlayer]);

  const updateGameStatus = () => {
    const winner = checkForWinner(board);
    if (winner) {
      setGameStatus(`checkmate_${winner}`);
      return;
    }

    if (isKingInCheck(board, currentPlayer)) {
      if (checkForCheckmate(board, currentPlayer)) {
        setGameStatus(`checkmate_${currentPlayer === 'white' ? 'black' : 'white'}`);
      } else {
        setGameStatus(`check_${currentPlayer}`);
      }
    } else if (checkForStalemate(board, currentPlayer)) {
      setGameStatus('stalemate');
    } else {
      setGameStatus('playing');
    }
  };

  const handleSquareClick = (rowIndex, colIndex) => {
    if (gameStatus !== 'playing' && gameStatus !== `check_${currentPlayer}`) return;

    if (selectedPiece) {
      const from = { row: selectedPiece.row, col: selectedPiece.col };
      const to = { row: rowIndex, col: colIndex };

      if (isValidMove(from, to, board, currentPlayer) && !isMovePuttingKingInCheck(from, to, board, currentPlayer)) {
        const newBoard = board.map(row => [...row]);
        const capturedPiece = newBoard[to.row][to.col];
        newBoard[to.row][to.col] = newBoard[from.row][from.col];
        newBoard[from.row][from.col] = '';

        // Check for pawn promotion
        if (newBoard[to.row][to.col].toLowerCase() === 'p' && (to.row === 0 || to.row === 7)) {
          setPromotionPawn({ row: to.row, col: to.col });
        } else {
          setBoard(newBoard);
          setSelectedPiece(null);
          setPossibleMoves([]);
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        }

        setMoveHistory([...moveHistory, {
          piece: selectedPiece.piece,
          from,
          to,
          captured: capturedPiece
        }]);
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (board[rowIndex][colIndex]) {
      const piece = board[rowIndex][colIndex];
      const isPieceWhite = piece === piece.toUpperCase();
      if ((isPieceWhite && currentPlayer === 'white') || (!isPieceWhite && currentPlayer === 'black')) {
        setSelectedPiece({ piece, row: rowIndex, col: colIndex });
        if (mode === 'practice') {
          setPossibleMoves(getPossibleMoves(piece, [rowIndex, colIndex], board));
        }
      }
    }
  };

  const handlePromotion = (promotedPiece) => {
    const newBoard = board.map(row => [...row]);
    newBoard[promotionPawn.row][promotionPawn.col] = currentPlayer === 'white' ? promotedPiece.toUpperCase() : promotedPiece.toLowerCase();
    setBoard(newBoard);
    setPromotionPawn(null);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
  };

  const handleRestart = () => {
    setBoard(initialBoard);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setCurrentPlayer('white');
    setGameStatus('playing');
    setMoveHistory([]);
  };

  return (
    <div className="game">
      <h2>Current Player: {currentPlayer}</h2>
      <div className="game-status">
        {gameStatus.startsWith('check') && <h3>Check!</h3>}
        {gameStatus.startsWith('checkmate') && <h3>Checkmate! {gameStatus.split('_')[1]} wins!</h3>}
        {gameStatus === 'stalemate' && <h3>Stalemate!</h3>}
      </div>
      <div className="game-board">
        <Board
          board={board}
          onSquareClick={handleSquareClick}
          selectedPiece={selectedPiece}
          possibleMoves={mode === 'practice' ? possibleMoves : []}
          mode={mode}
        />
        <div className="move-history">
          <h3>Move History</h3>
          <ul>
            {moveHistory.map((move, index) => (
              <li key={index}>
                {move.piece} {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} to
                {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
                {move.captured && ` (Captured ${move.captured})`}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="restart-button" onClick={handleRestart}>Restart Game</button>
      {promotionPawn && (
        <PromotionModal onPromote={handlePromotion} />
      )}
    </div>
  );
};

export default Game;