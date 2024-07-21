export const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const isPathClear = (from, to, board) => {
  const dx = Math.sign(to.col - from.col);
  const dy = Math.sign(to.row - from.row);
  let x = from.col + dx;
  let y = from.row + dy;

  while (x !== to.col || y !== to.row) {
    if (board[y][x]) return false;
    x += dx;
    y += dy;
  }
  return true;
};

export const isValidMove = (from, to, board, currentPlayer) => {
  const piece = board[from.row][from.col];
  const targetPiece = board[to.row][to.col];
  const isWhitePiece = piece === piece.toUpperCase();

  if ((isWhitePiece && currentPlayer !== 'white') || (!isWhitePiece && currentPlayer !== 'black')) {
    return false;
  }

  if (targetPiece && ((isWhitePiece && targetPiece === targetPiece.toUpperCase()) || (!isWhitePiece && targetPiece === targetPiece.toLowerCase()))) {
    return false;
  }

  const dx = to.col - from.col;
  const dy = to.row - from.row;

  switch (piece.toLowerCase()) {
    case 'p':
      if (isWhitePiece) {
        if (dy === -1 && dx === 0 && !targetPiece) return true;
        if (dy === -2 && dx === 0 && from.row === 6 && !board[from.row - 1][from.col] && !targetPiece) return true;
        if (dy === -1 && Math.abs(dx) === 1 && targetPiece) return true;
      } else {
        if (dy === 1 && dx === 0 && !targetPiece) return true;
        if (dy === 2 && dx === 0 && from.row === 1 && !board[from.row + 1][from.col] && !targetPiece) return true;
        if (dy === 1 && Math.abs(dx) === 1 && targetPiece) return true;
      }
      break;
    case 'r':
      if ((dx === 0 || dy === 0) && isPathClear(from, to, board)) return true;
      break;
    case 'n':
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      return knightMoves.some(([moveY, moveX]) => 
        from.row + moveY === to.row && from.col + moveX === to.col
      );
    case 'b':
      if (Math.abs(dx) === Math.abs(dy) && isPathClear(from, to, board)) return true;
      break;
    case 'q':
      if ((dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && isPathClear(from, to, board)) return true;
      break;
    case 'k':
      if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return true;
      break;
    default:
      return false;
  }

  return false;
};

export const getPossibleMoves = (piece, [row, col], board) => {
  const moves = [];
  const isWhitePiece = piece === piece.toUpperCase();
  const currentPlayer = isWhitePiece ? 'white' : 'black';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isValidMove({ row, col }, { row: i, col: j }, board, currentPlayer)) {
        moves.push({ row: i, col: j });
      }
    }
  }

  return moves;
};

export const checkForWinner = (board) => {
  const kings = { white: false, black: false };
  for (let row of board) {
    for (let piece of row) {
      if (piece === 'K') kings.white = true;
      if (piece === 'k') kings.black = true;
    }
  }
  if (!kings.white) return 'black';
  if (!kings.black) return 'white';
  return null;
};

export const checkForCheckmate = (board, currentPlayer) => {
  if (!isKingInCheck(board, currentPlayer)) return false;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece && (currentPlayer === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
        const possibleMoves = getPossibleMoves(piece, [i, j], board);
        for (const move of possibleMoves) {
          if (!isMovePuttingKingInCheck({row: i, col: j}, move, board, currentPlayer)) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const checkForStalemate = (board, currentPlayer) => {
  if (isKingInCheck(board, currentPlayer)) return false;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece && (currentPlayer === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
        const possibleMoves = getPossibleMoves(piece, [i, j], board);
        for (const move of possibleMoves) {
          if (!isMovePuttingKingInCheck({row: i, col: j}, move, board, currentPlayer)) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const isKingInCheck = (board, currentPlayer) => {
  const kingPiece = currentPlayer === 'white' ? 'K' : 'k';
  let kingPosition;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === kingPiece) {
        kingPosition = { row: i, col: j };
        break;
      }
    }
    if (kingPosition) break;
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece && (currentPlayer === 'white' ? piece === piece.toLowerCase() : piece === piece.toUpperCase())) {
        if (isValidMove({ row: i, col: j }, kingPosition, board, currentPlayer === 'white' ? 'black' : 'white')) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isMovePuttingKingInCheck = (from, to, board, currentPlayer) => {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = '';

  return isKingInCheck(newBoard, currentPlayer);
};