/**
 * AnalysisService - Serwis analizy gier
 */
const AIEngine = require('../ai/AIEngine');

class AnalysisService {
  constructor() {
    this.aiEngine = new AIEngine();
  }

  /**
   * Analizuje pełną grę
   */
  async analyzeGame(moves, boardSize = 3, winCondition = 3) {
    const GameEngine = require('../game/GameEngine');
    const game = new GameEngine(boardSize, winCondition);
    
    const analysis = {
      moves: [],
      mistakes: [],
      bestMoves: [],
      accuracy: { X: 0, O: 0 }
    };

    let totalMovesX = 0;
    let totalMovesO = 0;
    let goodMovesX = 0;
    let goodMovesO = 0;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const state = game.getGameState();

      // Pobierz najlepszy ruch według AI
      const bestMove = await this.aiEngine.selectMove(state, 'expert', 5000);
      
      // Wykonaj faktyczny ruch
      game.makeMove(move.row, move.col, move.player);

      // Porównaj z najlepszym ruchem
      const isBestMove = move.row === bestMove.row && move.col === bestMove.col;
      const moveQuality = this._evaluateMoveQuality(move, bestMove, state);

      analysis.moves.push({
        moveNumber: i + 1,
        player: move.player,
        actual: { row: move.row, col: move.col },
        best: { row: bestMove.row, col: bestMove.col },
        isBestMove,
        quality: moveQuality,
        evaluation: bestMove.evaluation
      });

      // Zlicz dobre ruchy
      if (move.player === 'X') {
        totalMovesX++;
        if (moveQuality >= 0.8) goodMovesX++;
      } else {
        totalMovesO++;
        if (moveQuality >= 0.8) goodMovesO++;
      }

      // Zapisz błędy
      if (moveQuality < 0.5) {
        analysis.mistakes.push({
          moveNumber: i + 1,
          player: move.player,
          move: { row: move.row, col: move.col },
          betterMove: { row: bestMove.row, col: bestMove.col },
          reason: this._getMistakeReason(moveQuality)
        });
      }
    }

    // Oblicz dokładność
    analysis.accuracy.X = totalMovesX > 0 ? goodMovesX / totalMovesX : 0;
    analysis.accuracy.O = totalMovesO > 0 ? goodMovesO / totalMovesO : 0;

    return analysis;
  }

  /**
   * Analizuje pojedynczy ruch
   */
  async analyzeMove(board, move, player) {
    const state = {
      board,
      currentPlayer: player,
      settings: { boardSize: board.length, winCondition: 3 }
    };

    const bestMove = await this.aiEngine.selectMove(state, 'expert');
    const quality = this._evaluateMoveQuality(move, bestMove, state);

    return {
      quality,
      isBestMove: move.row === bestMove.row && move.col === bestMove.col,
      bestMove: { row: bestMove.row, col: bestMove.col },
      evaluation: bestMove.evaluation,
      suggestion: this._getMoveSuggestion(quality)
    };
  }

  /**
   * Ocenia jakość ruchu
   * @private
   */
  _evaluateMoveQuality(actualMove, bestMove, state) {
    // Jeśli to jest najlepszy ruch, zwróć 1.0
    if (actualMove.row === bestMove.row && actualMove.col === bestMove.col) {
      return 1.0;
    }

    // W przeciwnym razie oceń na podstawie różnicy w ocenie
    // To uproszczenie - w pełnej wersji można by użyć minimax dla obu ruchów
    return Math.max(0, 0.5 - Math.abs(bestMove.evaluation) * 0.1);
  }

  /**
   * Pobiera powód błędu
   * @private
   */
  _getMistakeReason(quality) {
    if (quality < 0.2) return 'Bardzo słaby ruch - tracisz przewagę';
    if (quality < 0.5) return 'Słaby ruch - istnieje lepszy wybór';
    return 'Przeciętny ruch';
  }

  /**
   * Pobiera sugestię dla ruchu
   * @private
   */
  _getMoveSuggestion(quality) {
    if (quality >= 0.9) return 'Doskonały ruch!';
    if (quality >= 0.7) return 'Dobry ruch';
    if (quality >= 0.5) return 'Przeciętny ruch';
    if (quality >= 0.3) return 'Słaby ruch - rozważ inne opcje';
    return 'Bardzo słaby ruch - spróbuj znaleźć lepszy';
  }

  /**
   * Generuje raport z analizy gry
   */
  generateReport(analysis) {
    const report = {
      summary: {
        totalMoves: analysis.moves.length,
        mistakes: analysis.mistakes.length,
        accuracyX: (analysis.accuracy.X * 100).toFixed(1) + '%',
        accuracyO: (analysis.accuracy.O * 100).toFixed(1) + '%'
      },
      rating: this._calculateRating(analysis),
      topMistakes: analysis.mistakes.slice(0, 3),
      recommendations: this._generateRecommendations(analysis)
    };

    return report;
  }

  /**
   * Oblicza rating gracza
   * @private
   */
  _calculateRating(analysis) {
    const avgAccuracy = (analysis.accuracy.X + analysis.accuracy.O) / 2;
    
    if (avgAccuracy >= 0.9) return 'Expert';
    if (avgAccuracy >= 0.7) return 'Advanced';
    if (avgAccuracy >= 0.5) return 'Intermediate';
    if (avgAccuracy >= 0.3) return 'Beginner';
    return 'Novice';
  }

  /**
   * Generuje rekomendacje
   * @private
   */
  _generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.accuracy.X < 0.5 || analysis.accuracy.O < 0.5) {
      recommendations.push('Poświęć więcej czasu na przemyślenie każdego ruchu');
    }

    if (analysis.mistakes.length > 3) {
      recommendations.push('Spróbuj przewidywać ruchy przeciwnika');
    }

    if (analysis.mistakes.some(m => m.moveNumber <= 3)) {
      recommendations.push('Skup się na lepszym otwarciu gry');
    }

    return recommendations;
  }
}

module.exports = AnalysisService;
