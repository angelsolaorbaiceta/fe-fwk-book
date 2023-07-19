export function makeInitialState() {
  return {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    player: 'X',
    draw: false,
    winner: null,
  }
}

export function markReducer(state, { row, col }) {
  if (row > 3 || row < 0 || col > 3 || col < 0) {
    throw new Error('Invalid move')
  }

  if (state.board[row][col]) {
    throw new Error('Invalid move')
  }

  const newBoard = [
    [...state.board[0]],
    [...state.board[1]],
    [...state.board[2]],
  ]
  newBoard[row][col] = state.player

  const newPlayer = state.player === 'X' ? 'O' : 'X'
  const winner = checkWinner(newBoard, state.player)
  const draw = !winner && newBoard.every((row) => row.every((cell) => cell))

  return {
    board: newBoard,
    player: newPlayer,
    draw,
    winner,
  }
}

/**
 * Check if the given player has won the game by checking the rows, columns, and diagonals.
 *
 * @param {Array.<null|string>} board The board to check
 * @param {string} player The player to check for (X or O)
 * @returns {string|null} The winner (X or O) or null if no winner
 */
function checkWinner(board, player) {
  for (let i = 0; i < 3; i++) {
    if (checkRow(board, i, player)) {
      return player
    }

    if (checkColumn(board, i, player)) {
      return player
    }
  }

  if (checkMainDiagonal(board, player)) {
    return player
  }

  if (checkSecondaryDiagonal(board, player)) {
    return player
  }

  return null
}

/**
 * Check if the given player has won the given row.
 *
 * @param {Array.<null|string>} board the board to check
 * @param {number} idx the row index
 * @param {string} player the player to check for (X or O)
 *
 * @returns {boolean} true if the player has won the row, false otherwise
 */
function checkRow(board, idx, player) {
  const row = board[idx]
  return row.every((cell) => cell === player)
}

/**
 * Check if the given player has won the given column.
 *
 * @param {Array.<null|string>} board the board to check
 * @param {number} idx the column index
 * @param {string} player the player to check for (X or O)
 *
 * @returns {boolean} true if the player has won the column, false otherwise
 */
function checkColumn(board, idx, player) {
  const column = [board[0][idx], board[1][idx], board[2][idx]]
  return column.every((cell) => cell === player)
}

/**
 * Check if the given player has won the main diagonal (\).
 *
 * @param {Array.<null|string>} board the board to check
 * @param {string} player the player to check for (X or O)
 *
 * @returns {boolean} true if the player has won the diagonal, false otherwise
 */
function checkMainDiagonal(board, player) {
  const diagonal = [board[0][0], board[1][1], board[2][2]]
  return diagonal.every((cell) => cell === player)
}

/**
 * Check if the given player has won the secondary diagonal (/).
 *
 * @param {Array.<null|string>} board the board to check
 * @param {string} player the player to check for (X or O)
 *
 * @returns {boolean} true if the player has won the diagonal, false otherwise
 */
function checkSecondaryDiagonal(board, player) {
  const diagonal = [board[0][2], board[1][1], board[2][0]]
  return diagonal.every((cell) => cell === player)
}
