/**
 * Validation Middleware
 * Waliduje dane wejściowe
 */
const BoardValidator = require('../game/BoardValidator');

/**
 * Waliduje dane nowej gry
 */
function validateNewGame(req, res, next) {
  const { boardSize, winCondition } = req.body;

  const validation = BoardValidator.validateGameConfig(
    boardSize || 3,
    winCondition || 3
  );

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  next();
}

/**
 * Waliduje ruch w grze
 */
function validateMove(req, res, next) {
  const { row, col, player } = req.body;

  if (typeof row !== 'number' || typeof col !== 'number') {
    return res.status(400).json({ error: 'Invalid move coordinates' });
  }

  if (!player || (player !== 'X' && player !== 'O')) {
    return res.status(400).json({ error: 'Invalid player symbol' });
  }

  next();
}

/**
 * Waliduje stan planszy
 */
function validateBoard(req, res, next) {
  const { board } = req.body;

  if (!board || !Array.isArray(board)) {
    return res.status(400).json({ error: 'Board must be an array' });
  }

  const validation = BoardValidator.validateBoardState(board);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  next();
}

module.exports = {
  validateNewGame,
  validateMove,
  validateBoard
};
