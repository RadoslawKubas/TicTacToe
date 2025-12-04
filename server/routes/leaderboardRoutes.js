/**
 * Leaderboard Routes - Endpointy rankingu
 */
const express = require('express');
const router = express.Router();

// In-memory storage dla rankingu (w produkcji użyć bazy danych)
const leaderboard = new Map();

/**
 * GET /api/leaderboard
 * Pobiera ranking graczy
 */
router.get('/', (req, res, next) => {
  try {
    const {
      limit = 10,
      offset = 0,
      mode = 'all'
    } = req.query;

    let players = Array.from(leaderboard.values());

    // Filtruj po trybie jeśli określony
    if (mode !== 'all') {
      players = players.map(player => ({
        ...player,
        stats: player.stats[mode] || { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 }
      }));
    }

    // Sortuj po winRate
    players.sort((a, b) => {
      const rateA = a.wins / (a.gamesPlayed || 1);
      const rateB = b.wins / (b.gamesPlayed || 1);
      return rateB - rateA;
    });

    // Dodaj ranking
    players = players.map((player, index) => ({
      rank: index + 1,
      ...player,
      winRate: player.wins / (player.gamesPlayed || 1)
    }));

    // Paginacja
    const paginatedPlayers = players.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      players: paginatedPlayers,
      total: players.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leaderboard/submit
 * Zapisuje wynik gry
 */
router.post('/submit', (req, res, next) => {
  try {
    const {
      playerName,
      opponent,
      result, // 'win', 'loss', 'draw'
      mode = 'pvp',
      moves = 0,
      duration = 0
    } = req.body;

    // Walidacja
    if (!playerName || !result) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['win', 'loss', 'draw'].includes(result)) {
      return res.status(400).json({ error: 'Invalid result value' });
    }

    // Pobierz lub utwórz profil gracza
    let player = leaderboard.get(playerName);
    
    if (!player) {
      player = {
        name: playerName,
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
        rating: 1000,
        stats: {
          pvp: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
          pve: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 }
        },
        createdAt: Date.now()
      };
    }

    // Aktualizuj statystyki
    player.gamesPlayed++;
    player.stats[mode].gamesPlayed++;

    if (result === 'win') {
      player.wins++;
      player.stats[mode].wins++;
      player.rating += 25;
    } else if (result === 'loss') {
      player.losses++;
      player.stats[mode].losses++;
      player.rating -= 15;
    } else {
      player.draws++;
      player.stats[mode].draws++;
      player.rating += 5;
    }

    player.lastActive = Date.now();

    // Zapisz zaktualizowany profil
    leaderboard.set(playerName, player);

    res.json({
      success: true,
      player: {
        name: player.name,
        wins: player.wins,
        losses: player.losses,
        draws: player.draws,
        gamesPlayed: player.gamesPlayed,
        rating: player.rating,
        winRate: player.wins / player.gamesPlayed
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leaderboard/player/:name
 * Pobiera statystyki konkretnego gracza
 */
router.get('/player/:name', (req, res, next) => {
  try {
    const { name } = req.params;
    const player = leaderboard.get(name);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Oblicz ranking gracza
    const allPlayers = Array.from(leaderboard.values());
    allPlayers.sort((a, b) => b.rating - a.rating);
    const rank = allPlayers.findIndex(p => p.name === name) + 1;

    res.json({
      ...player,
      rank,
      winRate: player.wins / (player.gamesPlayed || 1)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/leaderboard/player/:name
 * Usuwa gracza z rankingu
 */
router.delete('/player/:name', (req, res, next) => {
  try {
    const { name } = req.params;
    
    if (!leaderboard.has(name)) {
      return res.status(404).json({ error: 'Player not found' });
    }

    leaderboard.delete(name);
    
    res.json({ success: true, message: 'Player removed from leaderboard' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
