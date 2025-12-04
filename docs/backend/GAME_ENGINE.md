# Silnik Gry - Dokumentacja

## Klasa GameEngine

Główny silnik gry TicTacToe zarządzający stanem planszy, walidacją ruchów i sprawdzaniem warunków wygranej.

### Konstruktor

```javascript
new GameEngine(size = 3, winCondition = 3)
```

**Parametry:**
- `size` (number): rozmiar planszy NxN (domyślnie 3)
- `winCondition` (number): ile symboli w rzędzie do wygranej (domyślnie 3)

**Przykład:**
```javascript
const game = new GameEngine(3, 3); // Standardowa plansza 3x3
const bigGame = new GameEngine(5, 4); // Plansza 5x5, wygrana przy 4 w rzędzie
```

### Metody Publiczne

#### initBoard()

Inicjalizuje pustą planszę.

**Zwraca:** `Array[size][size]` wypełniony `null`

**Przykład:**
```javascript
const board = game.initBoard();
// [[null, null, null], [null, null, null], [null, null, null]]
```

#### makeMove(row, col, player)

Wykonuje ruch na planszy.

**Parametry:**
- `row` (number): numer wiersza (0 do size-1)
- `col` (number): numer kolumny (0 do size-1)  
- `player` (string): 'X' lub 'O'

**Zwraca:** `{ success: boolean, error?: string, gameState?: Object }`

**Przykład:**
```javascript
const result = game.makeMove(0, 0, 'X');
if (result.success) {
  console.log('Ruch wykonany', result.gameState);
} else {
  console.error('Błąd:', result.error);
}
```

#### checkWin()

Sprawdza czy jest zwycięzca.

**Zwraca:** `{ winner: 'X'|'O'|null, line: [[row,col],...] | null }`

**Przykład:**
```javascript
const result = game.checkWin();
if (result.winner) {
  console.log(`Wygrywa ${result.winner}!`);
  console.log('Linia wygrywająca:', result.line);
}
```

#### checkDraw()

Sprawdza czy jest remis.

**Zwraca:** `boolean`

#### getValidMoves()

Zwraca listę dostępnych ruchów.

**Zwraca:** `[[row, col], ...]`

**Przykład:**
```javascript
const moves = game.getValidMoves();
console.log('Dostępne ruchy:', moves);
// [[0,0], [0,1], [0,2], ...]
```

#### undoMove()

Cofa ostatni ruch.

**Zwraca:** `Move | null`

**Przykład:**
```javascript
const undoneMove = game.undoMove();
if (undoneMove) {
  console.log('Cofnięto ruch:', undoneMove);
}
```

#### getGameState()

Zwraca pełny stan gry.

**Zwraca:** `GameState object`

```javascript
{
  board: Array<Array<string|null>>,
  currentPlayer: 'X' | 'O',
  status: 'playing' | 'won' | 'draw',
  winner: 'X' | 'O' | null,
  winningLine: Array<[row, col]> | null,
  moves: Array<Move>,
  settings: {
    boardSize: number,
    winCondition: number
  }
}
```

#### reset()

Resetuje grę do stanu początkowego.

**Przykład:**
```javascript
game.reset();
console.log('Gra zresetowana');
```

## Klasa BoardValidator

Walidator planszy i ruchów.

### Metody Statyczne

#### validateMove(board, row, col, player)

Sprawdza poprawność ruchu.

**Zwraca:** `{ valid: boolean, error?: string }`

#### validateBoardState(board)

Sprawdza czy stan planszy jest poprawny.

**Zwraca:** `{ valid: boolean, error?: string }`

#### validateGameConfig(size, winCondition)

Waliduje konfigurację gry.

**Zwraca:** `{ valid: boolean, error?: string }`

## Klasa WinChecker

Sprawdzanie warunków wygranej - zoptymalizowany dla dużych plansz.

### Metody Statyczne

#### checkWin(board, winCondition)

Sprawdza wszystkie możliwe linie wygranej.

**Zwraca:** `{ winner: string|null, line: Array|null }`

#### checkWinFromMove(board, row, col, winCondition)

Szybkie sprawdzenie wygranej tylko wokół ostatniego ruchu.
Optymalizacja dla dużych plansz.

**Zwraca:** `{ winner: string|null, line: Array|null }`

## Przykłady Użycia

### Podstawowa gra

```javascript
const GameEngine = require('./game/GameEngine');

const game = new GameEngine(3, 3);

// Wykonaj ruchy
game.makeMove(0, 0, 'X'); // X
game.makeMove(1, 1, 'O'); // O
game.makeMove(0, 1, 'X'); // X
game.makeMove(1, 2, 'O'); // O
game.makeMove(0, 2, 'X'); // X - wygrana!

const state = game.getGameState();
console.log('Status:', state.status);    // 'won'
console.log('Zwycięzca:', state.winner); // 'X'
```

### Cofanie ruchów

```javascript
game.makeMove(0, 0, 'X');
game.makeMove(1, 1, 'O');

game.undoMove(); // Cofa ruch O
game.undoMove(); // Cofa ruch X

// Plansza znowu pusta
```

### Większa plansza

```javascript
const bigGame = new GameEngine(5, 4);

// Gra na planszy 5x5, wygrana przy 4 w rzędzie
bigGame.makeMove(0, 0, 'X');
// ...
```
