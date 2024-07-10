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
    if (board[y][x] !== '') return false;
    x += dx;
    y += dy;
  }
  return true;
};

export const isValidMove = (from, to, board, currentPlayer) => {
  const piece = board[from.row][from.col];
  const isPieceWhite = piece === piece.toUpperCase();
  if ((isPieceWhite && currentPlayer !== 'white') || (!isPieceWhite && currentPlayer === 'white')) {
    return false;
  }

  const dx = to.col - from.col;
  const dy = to.row - from.row;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  const targetPiece = board[to.row][to.col];
  const isCapture = targetPiece !== '' && isPieceWhite !== (targetPiece === targetPiece.toUpperCase());

  if (targetPiece !== '' && !isCapture) return false;

  switch (piece.toLowerCase()) {
    case 'p':
      if (isPieceWhite) {
        if (dy === -1 && dx === 0 && !isCapture) return true;
        if (dy === -2 && dx === 0 && from.row === 6 && !isCapture && board[from.row - 1][from.col] === '') return true;
        if (dy === -1 && adx === 1 && isCapture) return true;
      } else {
        if (dy === 1 && dx === 0 && !isCapture) return true;
        if (dy === 2 && dx === 0 && from.row === 1 && !isCapture && board[from.row + 1][from.col] === '') return true;
        if (dy === 1 && adx === 1 && isCapture) return true;
      }
      break;
    case 'r':
      if ((dx === 0 || dy === 0) && isPathClear(from, to, board)) return true;
      break;
    case 'n':
      if ((adx === 2 && ady === 1) || (adx === 1 && ady === 2)) return true;
      break;
    case 'b':
      if (adx === ady && isPathClear(from, to, board)) return true;
      break;
    case 'q':
      if ((dx === 0 || dy === 0 || adx === ady) && isPathClear(from, to, board)) return true;
      break;
    case 'k':
      if (adx <= 1 && ady <= 1) return true;
      break;
    default:
      return false;
  }
  return false;
};

export const getPossibleMoves = (piece, position, board) => {
  const possibleMoves = [];
  const isWhite = piece === piece.toUpperCase();
  const [row, col] = position;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isValidMove({row, col}, {row: i, col: j}, board, isWhite ? 'white' : 'black')) {
        possibleMoves.push({row: i, col: j});
      }
    }
  }

  return possibleMoves;
};

export const checkForWinner = (board) => {
  let whiteKing = false;
  let blackKing = false;

  for (let row of board) {
    for (let piece of row) {
      if (piece === 'K') whiteKing = true;
      if (piece === 'k') blackKing = true;
    }
  }

  if (!whiteKing) return 'black';
  if (!blackKing) return 'white';
  return null;
};