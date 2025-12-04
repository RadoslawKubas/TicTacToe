# Silnik AI - Dokumentacja

## Poziomy Trudności

### Easy (Łatwy)
- **Algorytm**: Losowy wybór z dostępnych pól
- **Strategia**: Brak strategii, całkowicie losowe ruchy
- **Szansa na optymalny ruch**: ~11% (1/9 dla pustej planszy)
- **Implementacja**: `RandomAI.js`

### Medium (Średni)
- **Algorytm**: Podstawowa heurystyka
- **Strategia**: 
  - Priorytetyzuje centrum planszy
  - Preferuje rogi nad krawędziami
  - Blokuje oczywiste zagrożenia
  - Szuka okazji do wygranej
- **Szansa na optymalny ruch**: ~50%
- **Implementacja**: `HeuristicAI.js`

### Hard (Trudny)
- **Algorytm**: Minimax z ograniczoną głębokością (depth 4)
- **Strategia**:
  - Analizuje możliwe scenariusze do 4 ruchów w przód
  - Blokuje wszystkie wygrane przeciwnika
  - Aktywnie szuka własnych wygranych
  - Ocenia pozycje heurystycznie
- **Czas myślenia**: < 500ms (zazwyczaj)
- **Implementacja**: `MinimaxAI.js`

### Expert (Ekspert)
- **Algorytm**: Minimax z Alpha-Beta pruning
- **Strategia**:
  - Pełna analiza drzewa gry (głębokość 6)
  - Optymalizacja Alpha-Beta redukuje liczbę analizowanych pozycji
  - Transposition Table dla cache
  - Move Ordering dla lepszej wydajności
- **Czas myślenia**: < 1000ms
- **Implementacja**: `AlphaBetaAI.js`

### Impossible (Niemożliwy)
- **Algorytm**: Perfekcyjny Minimax + Opening Book
- **Strategia**:
  - Prekalkulowane optymalne otwarcia dla 3x3
  - Zawsze gra optymalnie
  - Nigdy nie przegrywa (max remis)
  - Pełna analiza z bardzo dużą głębokością
- **Czas myślenia**: < 2000ms
- **Implementacja**: `PerfectAI.js`

## Interfejs AIEngine

### Konstruktor

```javascript
const aiEngine = new AIEngine();
```

### Metody

#### selectMove(gameState, difficulty, maxThinkingTime)

Zwraca optymalny ruch dla danego poziomu trudności.

**Parametry:**
- `gameState` (Object): Stan gry
- `difficulty` (string): 'easy' | 'medium' | 'hard' | 'expert' | 'impossible'
- `maxThinkingTime` (number): Maksymalny czas myślenia w ms (domyślnie 2000)

**Zwraca:**
```javascript
{
  row: number,
  col: number,
  evaluation: number,
  thinkingTime: number,
  fromCache: boolean
}
```

**Przykład:**
```javascript
const move = await aiEngine.selectMove(gameState, 'hard', 2000);
console.log(`AI wybiera: [${move.row}, ${move.col}]`);
console.log(`Czas myślenia: ${move.thinkingTime}ms`);
```

#### analyzePosition(gameState)

Analizuje pozycję i zwraca ocenę.

**Zwraca:**
```javascript
{
  evaluation: number,
  advantage: 'X' | 'O' | 'equal',
  details: {
    lineScore: number,
    opponentLineScore: number,
    positionScore: number,
    mobilityScore: number,
    threats: Array,
    opportunities: Array
  }
}
```

#### getHint(gameState)

Zwraca podpowiedź dla gracza.

**Zwraca:**
```javascript
{
  row: number,
  col: number,
  reason: string,
  evaluation: number
}
```

#### clearCache()

Czyści cache obliczonych ruchów.

#### setCacheEnabled(enabled)

Włącza/wyłącza cache.

## Klasa Evaluator

Funkcje oceny stanu gry używane przez algorytmy AI.

### evaluate(board, player)

Ocenia stan planszy dla danego gracza.

**Zwraca:** `number` - Ocena pozycji (-100 do 100)

- **100**: Wygrana dla gracza
- **0**: Równa pozycja
- **-100**: Wygrana przeciwnika

### getDetailedEvaluation(board, player)

Zwraca szczegółową analizę pozycji.

## Algorytmy

### Minimax

Klasyczny algorytm do gier turowych.

**Pseudokod:**
```
function minimax(node, depth, isMaximizing):
    if depth == 0 or node is terminal:
        return evaluate(node)
    
    if isMaximizing:
        maxEval = -infinity
        for each child of node:
            eval = minimax(child, depth-1, false)
            maxEval = max(maxEval, eval)
        return maxEval
    else:
        minEval = +infinity
        for each child of node:
            eval = minimax(child, depth-1, true)
            minEval = min(minEval, eval)
        return minEval
```

**Funkcja Oceny:**
- Wygrana AI: +100
- Wygrana gracza: -100
- Remis: 0
- W trakcie: heurystyczna ocena pozycji

### Alpha-Beta Pruning

Optymalizacja algorytmu Minimax.

**Optymalizacje:**
1. **Alpha-Beta Pruning** - obcina nieistotne gałęzie drzewa
2. **Transposition Table** - cache stanów planszy
3. **Move Ordering** - sortowanie ruchów według heurystyki
4. **Iterative Deepening** - stopniowe pogłębianie analizy

**Zysk wydajności:** 
- Bez optymalizacji: ~19,683 pozycji (dla głębokości 9)
- Z Alpha-Beta: ~2,000-5,000 pozycji
- Przyspieszenie: ~4-10x

## Przykłady Użycia

### Podstawowe użycie

```javascript
const AIEngine = require('./ai/AIEngine');
const GameEngine = require('./game/GameEngine');

const game = new GameEngine(3, 3);
const ai = new AIEngine();

// Gracz wykonuje ruch
game.makeMove(0, 0, 'X');

// AI odpowiada
const gameState = game.getGameState();
const aiMove = await ai.selectMove(gameState, 'hard');
game.makeMove(aiMove.row, aiMove.col, 'O');
```

### Analiza pozycji

```javascript
const analysis = ai.analyzePosition(gameState);
console.log('Ocena:', analysis.evaluation);
console.log('Przewaga:', analysis.advantage);
console.log('Zagrożenia:', analysis.details.threats);
```

### Podpowiedź dla gracza

```javascript
const hint = await ai.getHint(gameState);
console.log(`Sugerowany ruch: [${hint.row}, ${hint.col}]`);
console.log(`Powód: ${hint.reason}`);
```

### Gra AI vs AI

```javascript
const game = new GameEngine(3, 3);
const ai = new AIEngine();

while (game.gameStatus === 'playing') {
  const state = game.getGameState();
  const difficulty = state.currentPlayer === 'X' ? 'hard' : 'expert';
  const move = await ai.selectMove(state, difficulty);
  game.makeMove(move.row, move.col, state.currentPlayer);
}

console.log('Zwycięzca:', game.winner || 'Remis');
```

## Performance

### Benchmarki (plansza 3x3)

| Poziom | Średni czas | Max czas | Pozycje przeszukane |
|--------|-------------|----------|---------------------|
| Easy   | 50ms        | 100ms    | 1                   |
| Medium | 10ms        | 50ms     | 9-27                |
| Hard   | 200ms       | 500ms    | ~500                |
| Expert | 500ms       | 1000ms   | ~2000               |
| Impossible | 1000ms  | 2000ms   | ~5000               |

### Optymalizacje

1. **Cache**: Identyczne pozycje nie są analizowane wielokrotnie
2. **Move Ordering**: Najlepsze ruchy analizowane najpierw
3. **Early Termination**: Zatrzymanie analizy gdy znaleziono wygrywający ruch
4. **Depth Limiting**: Ograniczenie głębokości dla wydajności
