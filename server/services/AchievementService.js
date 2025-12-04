/**
 * AchievementService - System osiągnięć
 */
class AchievementService {
  constructor() {
    this.achievements = this._defineAchievements();
    this.playerAchievements = new Map(); // playerName -> Set of achievement IDs
  }

  /**
   * Definiuje wszystkie osiągnięcia
   * @private
   */
  _defineAchievements() {
    return {
      // Dla początkujących
      first_win: {
        id: 'first_win',
        name: 'First Win',
        description: 'Wygraj pierwszą grę',
        icon: '🏆',
        condition: (stats) => stats.wins >= 1
      },
      first_online_win: {
        id: 'first_online_win',
        name: 'First Online Win',
        description: 'Wygraj pierwszą grę online',
        icon: '🌐',
        condition: (stats) => stats.onlineWins >= 1
      },

      // Umiejętności
      speed_demon: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Wygraj grę w mniej niż 30 sekund',
        icon: '⚡',
        condition: (stats) => stats.fastestWin && stats.fastestWin < 30000
      },
      perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Wygraj grę w 3 ruchach',
        icon: '✨',
        condition: (stats) => stats.shortestWin && stats.shortestWin <= 3
      },

      // Doświadczenie
      veteran: {
        id: 'veteran',
        name: 'Veteran',
        description: 'Rozegraj 100 gier',
        icon: '🎖️',
        condition: (stats) => stats.gamesPlayed >= 100
      },
      master: {
        id: 'master',
        name: 'Master',
        description: 'Wygraj 50 gier',
        icon: '👑',
        condition: (stats) => stats.wins >= 50
      },
      unbeatable: {
        id: 'unbeatable',
        name: 'Unbeatable',
        description: 'Wygraj 10 gier z rzędu',
        icon: '🔥',
        condition: (stats) => stats.currentStreak >= 10
      },

      // Specjalne
      ai_hunter: {
        id: 'ai_hunter',
        name: 'AI Hunter',
        description: 'Pokonaj AI na poziomie Impossible',
        icon: '🤖',
        condition: (stats) => stats.defeatedImpossibleAI
      },
      social_butterfly: {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Rozegraj 10 gier z różnymi graczami',
        icon: '🦋',
        condition: (stats) => stats.uniqueOpponents >= 10
      },
      night_owl: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Graj o 3 w nocy',
        icon: '🦉',
        condition: (stats) => stats.playedAt3AM
      }
    };
  }

  /**
   * Sprawdza i przyznaje osiągnięcia dla gracza
   */
  checkAchievements(playerName, stats) {
    if (!this.playerAchievements.has(playerName)) {
      this.playerAchievements.set(playerName, new Set());
    }

    const playerAchievementSet = this.playerAchievements.get(playerName);
    const newAchievements = [];

    for (const achievement of Object.values(this.achievements)) {
      // Pomiń jeśli już ma
      if (playerAchievementSet.has(achievement.id)) {
        continue;
      }

      // Sprawdź warunek
      if (achievement.condition(stats)) {
        playerAchievementSet.add(achievement.id);
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  /**
   * Pobiera wszystkie osiągnięcia gracza
   */
  getPlayerAchievements(playerName) {
    const achievementIds = this.playerAchievements.get(playerName) || new Set();
    return Array.from(achievementIds).map(id => this.achievements[id]);
  }

  /**
   * Pobiera postęp w osiągnięciach
   */
  getProgress(playerName, stats) {
    const progress = [];

    for (const achievement of Object.values(this.achievements)) {
      const unlocked = this.playerAchievements.get(playerName)?.has(achievement.id) || false;
      
      progress.push({
        ...achievement,
        unlocked,
        progress: this._calculateProgress(achievement, stats)
      });
    }

    return progress;
  }

  /**
   * Oblicza postęp dla osiągnięcia
   * @private
   */
  _calculateProgress(achievement, stats) {
    switch (achievement.id) {
      case 'first_win':
        return Math.min(1, stats.wins);
      case 'veteran':
        return Math.min(1, stats.gamesPlayed / 100);
      case 'master':
        return Math.min(1, stats.wins / 50);
      case 'unbeatable':
        return Math.min(1, stats.currentStreak / 10);
      case 'social_butterfly':
        return Math.min(1, stats.uniqueOpponents / 10);
      default:
        return achievement.condition(stats) ? 1 : 0;
    }
  }

  /**
   * Eksportuje osiągnięcia gracza
   */
  exportPlayerAchievements(playerName) {
    const achievements = this.getPlayerAchievements(playerName);
    return {
      playerName,
      achievements: achievements.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description
      })),
      total: achievements.length,
      percentage: (achievements.length / Object.keys(this.achievements).length * 100).toFixed(1)
    };
  }

  /**
   * Resetuje osiągnięcia gracza
   */
  resetPlayerAchievements(playerName) {
    this.playerAchievements.delete(playerName);
  }
}

module.exports = AchievementService;
