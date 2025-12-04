/**
 * Game Routes - Endpointy do zarządzania grami
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const GameEngine = require('../game/GameEngine');
const AIEngine = require('../ai/AIEngine');

// In-memory storage dla gier (w produkcji użyć bazy danych)
const games = new Map();
const aiEngine = new AIEngine();

/**
 * POST /api/game/new
 * Tworzy nową grę
 */
router.post('/new', async (req, res, next) => {
  try {
    const {
      mode = 'pvp',
      boardSize = 3,
      winCondition = 3,
      difficulty = 'medium',
      playerX = 'Player 1',
      playerO = 'Player 2'
    } = req.body;

    // Walidacja
    if (boardSize < 3 || boardSize > 10) {
      return res.status(400).json({ error: 'Board size must be between 3 and 10' });
    }

    if (winCondition < 3 || winCondition > boardSize) {
      return res.status(400).json({ error: 'Invalid win condition' });
    }

    // Utwórz nową grę
    const gameId = uuidv4();
    const gameEngine = new GameEngine(boardSize, winCondition);
    
    const gameData = {
      id: gameId,
      engine: gameEngine,
      mode,
      difficulty,
      playerX,
      playerO: mode === 'pve' ? 'AI' : playerO,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    games.set(gameId, gameData);

    const state = gameEngine.getGameState();
    
    res.status(201).json({
      gameId,
      board: state.board,
      currentPlayer: state.currentPlayer,
      status: state.status,
      settings: {
        mode,
        boardSize,
        winCondition,
        difficulty: mode === 'pve' ? difficulty : null,
        playerX,
        playerO: gameData.playerO
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/game/:id
 * Pobiera stan gry
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const gameData = games.get(id);

    if (!gameData) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const state = gameData.engine.getGameState();
    
    res.json({
      gameId: id,
      board: state.board,
      currentPlayer: state.currentPlayer,
      status: state.status,
      winner: state.winner,
      winningLine: state.winningLine,
      moves: state.moves,
      settings: state.settings,
      players: {
        X: gameData.playerX,
        O: gameData.playerO
      },
      createdAt: gameData.createdAt,
      updatedAt: gameData.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/game/:id/move
 * Wykonuje ruch w grze
 */
router.post('/:id/move', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { row, col, player } = req.body;

    const gameData = games.get(id);

    if (!gameData) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Walidacja danych wejściowych
    if (typeof row !== 'number' || typeof col !== 'number') {
      return res.status(400).json({ error: 'Invalid move coordinates' });
    }

    // Wykonaj ruch
    const result = gameData.engine.makeMove(row, col, player);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    gameData.updatedAt = Date.now();

    const state = result.gameState;
    let aiMove = null;

    // Jeśli tryb PVE i gra trwa, AI wykonuje ruch
    if (gameData.mode === 'pve' && state.status === 'playing' && state.currentPlayer === 'O') {
      try {
        const aiMoveResult = await aiEngine.selectMove(state, gameData.difficulty);
        
        const aiResult = gameData.engine.makeMove(
          aiMoveResult.row,
          aiMoveResult.col,
          state.currentPlayer
        );

        if (aiResult.success) {
          aiMove = {
            row: aiMoveResult.row,
            col: aiMoveResult.col,
            thinkingTime: aiMoveResult.thinkingTime
          };
          Object.assign(state, aiResult.gameState);
        }
      } catch (aiError) {
        console.error('AI move failed:', aiError);
      }
    }

    res.json({
      success: true,
      board: state.board,
      currentPlayer: state.currentPlayer,
      status: state.status,
      winner: state.winner,
      winningLine: state.winningLine,
      aiMove
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/game/:id/undo
 * Cofa ostatni ruch
 */
router.post('/:id/undo', (req, res, next) => {
  try {
    const { id } = req.params;
    const gameData = games.get(id);

    if (!gameData) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const undoneMove = gameData.engine.undoMove();

    if (!undoneMove) {
      return res.status(400).json({ error: 'No moves to undo' });
    }

    gameData.updatedAt = Date.now();
    const state = gameData.engine.getGameState();

    res.json({
      success: true,
      undoneMove,
      board: state.board,
      currentPlayer: state.currentPlayer,
      status: state.status
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/game/:id
 * Usuwa grę
 */
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!games.has(id)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    games.delete(id);
    
    res.json({ success: true, message: 'Game deleted' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/game/:id/reset
 * Resetuje grę do stanu początkowego
 */
router.post('/:id/reset', (req, res, next) => {
  try {
    const { id } = req.params;
    const gameData = games.get(id);

    if (!gameData) {
      return res.status(404).json({ error: 'Game not found' });
    }

    gameData.engine.reset();
    gameData.updatedAt = Date.now();
    
    const state = gameData.engine.getGameState();

    res.json({
      success: true,
      board: state.board,
      currentPlayer: state.currentPlayer,
      status: state.status
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
