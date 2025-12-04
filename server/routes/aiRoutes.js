/**
 * AI Routes - Endpointy AI
 */
const express = require('express');
const router = express.Router();
const AIEngine = require('../ai/AIEngine');

const aiEngine = new AIEngine();

/**
 * POST /api/ai/move
 * Pobiera ruch AI dla danego stanu gry
 */
router.post('/move', async (req, res, next) => {
  try {
    const {
      board,
      currentPlayer,
      difficulty = 'medium',
      boardSize = 3,
      winCondition = 3
    } = req.body;

    // Walidacja
    if (!board || !Array.isArray(board)) {
      return res.status(400).json({ error: 'Invalid board' });
    }

    if (!currentPlayer || (currentPlayer !== 'X' && currentPlayer !== 'O')) {
      return res.status(400).json({ error: 'Invalid player' });
    }

    const gameState = {
      board,
      currentPlayer,
      settings: {
        boardSize,
        winCondition
      }
    };

    // Pobierz ruch AI
    const move = await aiEngine.selectMove(gameState, difficulty);

    res.json({
      row: move.row,
      col: move.col,
      thinkingTime: move.thinkingTime,
      evaluation: move.evaluation,
      difficulty
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/analyze
 * Analizuje pozycję na planszy
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { board, currentPlayer, boardSize = 3, winCondition = 3 } = req.body;

    if (!board || !Array.isArray(board)) {
      return res.status(400).json({ error: 'Invalid board' });
    }

    const gameState = {
      board,
      currentPlayer,
      settings: { boardSize, winCondition }
    };

    const analysis = aiEngine.analyzePosition(gameState);

    res.json({
      evaluation: analysis.evaluation,
      advantage: analysis.advantage,
      details: analysis.details
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/hint
 * Zwraca podpowiedź dla gracza
 */
router.post('/hint', async (req, res, next) => {
  try {
    const { board, currentPlayer, boardSize = 3, winCondition = 3 } = req.body;

    if (!board || !Array.isArray(board)) {
      return res.status(400).json({ error: 'Invalid board' });
    }

    const gameState = {
      board,
      currentPlayer,
      settings: { boardSize, winCondition }
    };

    const hint = await aiEngine.getHint(gameState);

    res.json({
      row: hint.row,
      col: hint.col,
      reason: hint.reason,
      evaluation: hint.evaluation
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/cache/clear
 * Czyści cache AI
 */
router.post('/cache/clear', (req, res, next) => {
  try {
    aiEngine.clearCache();
    res.json({ success: true, message: 'AI cache cleared' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
