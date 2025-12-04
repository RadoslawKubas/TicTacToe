# TicTacToe Server

Backend serwer dla gry TicTacToe z zaawansowaną sztuczną inteligencją i obsługą multiplayer.

## 🚀 Szybki Start

### Instalacja

```bash
cd server
npm install
```

### Konfiguracja

Skopiuj plik `.env.example` do `.env` i dostosuj ustawienia:

```bash
cp .env.example .env
```

### Uruchomienie

```bash
# Development
npm run dev

# Production
npm start

# Testy
npm test
```

## 📡 API Endpoints

### Game Endpoints

#### POST /api/game/new
Tworzy nową grę.

**Request:**
```json
{
  "mode": "pvp",
  "boardSize": 3,
  "winCondition": 3,
  "difficulty": "medium",
  "playerX": "Player 1",
  "playerO": "Player 2"
}
```

**Response:**
```json
{
  "gameId": "uuid",
  "board": [[null,null,null],[null,null,null],[null,null,null]],
  "currentPlayer": "X",
  "status": "playing",
  "settings": {...}
}
```

#### POST /api/game/:id/move
Wykonuje ruch w grze.

**Request:**
```json
{
  "row": 0,
  "col": 1,
  "player": "X"
}
```

#### GET /api/game/:id
Pobiera stan gry.

#### POST /api/game/:id/undo
Cofa ostatni ruch.

#### POST /api/game/:id/reset
Resetuje grę.

#### DELETE /api/game/:id
Usuwa grę.

### AI Endpoints

#### POST /api/ai/move
Pobiera ruch AI.

**Request:**
```json
{
  "board": [[...]],
  "currentPlayer": "O",
  "difficulty": "hard"
}
```

#### POST /api/ai/analyze
Analizuje pozycję.

#### POST /api/ai/hint
Zwraca podpowiedź.

### Leaderboard Endpoints

#### GET /api/leaderboard
Pobiera ranking.

#### POST /api/leaderboard/submit
Zapisuje wynik.

#### GET /api/leaderboard/player/:name
Pobiera statystyki gracza.

## 🧠 AI Levels

- **easy** - Losowe ruchy
- **medium** - Podstawowa heurystyka
- **hard** - Minimax (głębokość 4)
- **expert** - Alpha-Beta pruning (głębokość 6)
- **impossible** - Perfekcyjny AI

## 📁 Struktura

```
server/
├── index.js              # Główny plik serwera
├── config/
│   └── config.js         # Konfiguracja
├── game/
│   ├── GameEngine.js     # Silnik gry
│   ├── BoardValidator.js # Walidator
│   └── WinChecker.js     # Sprawdzanie wygranej
├── ai/
│   ├── AIEngine.js       # Główny silnik AI
│   ├── Evaluator.js      # Funkcje oceny
│   └── algorithms/       # Algorytmy AI
├── routes/
│   ├── gameRoutes.js
│   ├── aiRoutes.js
│   └── leaderboardRoutes.js
├── middleware/
│   ├── errorHandler.js
│   └── validation.js
└── utils/
    ├── logger.js
    └── helpers.js
```

## 🧪 Testy

```bash
npm test                 # Uruchom wszystkie testy
npm run test:watch       # Testy w trybie watch
npm run test:coverage    # Pokrycie testami
```

## 📚 Dokumentacja

- [Game Engine](../docs/backend/GAME_ENGINE.md)
- [AI Engine](../docs/backend/AI_ENGINE.md)

## 🔧 Development

### Wymagania
- Node.js >= 18.x
- npm >= 9.x

### Skrypty
- `npm start` - Uruchom serwer produkcyjny
- `npm run dev` - Uruchom serwer deweloperski z hot reload
- `npm test` - Uruchom testy

## 📝 Licencja

MIT
