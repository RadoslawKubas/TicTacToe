# API Reference - Dokumentacja REST API

## Base URL
```
http://localhost:3000/api
```

## Endpointy Gry

### POST /api/game/new
Tworzy nową grę.

**Request Body:**
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

**Response (201 Created):**
```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "board": [[null, null, null], [null, null, null], [null, null, null]],
  "currentPlayer": "X",
  "status": "playing",
  "settings": {
    "mode": "pvp",
    "boardSize": 3,
    "winCondition": 3,
    "difficulty": null,
    "playerX": "Player 1",
    "playerO": "Player 2"
  }
}
```

### GET /api/game/:id
Pobiera stan gry.

**Response (200 OK):**
```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "board": [["X", null, null], [null, "O", null], [null, null, null]],
  "currentPlayer": "X",
  "status": "playing",
  "winner": null,
  "winningLine": null,
  "moves": [
    { "player": "X", "row": 0, "col": 0, "timestamp": 1234567890 },
    { "player": "O", "row": 1, "col": 1, "timestamp": 1234567895 }
  ],
  "settings": {
    "boardSize": 3,
    "winCondition": 3
  },
  "players": {
    "X": "Player 1",
    "O": "Player 2"
  },
  "createdAt": 1234567880,
  "updatedAt": 1234567895
}
```

### POST /api/game/:id/move
Wykonuje ruch w grze.

**Request Body:**
```json
{
  "row": 0,
  "col": 1,
  "player": "X"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "board": [["X", "X", null], [null, "O", null], [null, null, null]],
  "currentPlayer": "O",
  "status": "playing",
  "winner": null,
  "winningLine": null,
  "aiMove": null
}
```

**Response z ruchem AI (dla mode: "pve"):**
```json
{
  "success": true,
  "board": [["X", "X", null], [null, "O", null], ["O", null, null]],
  "currentPlayer": "X",
  "status": "playing",
  "winner": null,
  "winningLine": null,
  "aiMove": {
    "row": 2,
    "col": 0,
    "thinkingTime": 234
  }
}
```

### POST /api/game/:id/undo
Cofa ostatni ruch.

**Response (200 OK):**
```json
{
  "success": true,
  "undoneMove": {
    "player": "O",
    "row": 1,
    "col": 1,
    "timestamp": 1234567895
  },
  "board": [["X", null, null], [null, null, null], [null, null, null]],
  "currentPlayer": "O",
  "status": "playing"
}
```

### POST /api/game/:id/reset
Resetuje grę do stanu początkowego.

**Response (200 OK):**
```json
{
  "success": true,
  "board": [[null, null, null], [null, null, null], [null, null, null]],
  "currentPlayer": "X",
  "status": "playing"
}
```

### DELETE /api/game/:id
Usuwa grę.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Game deleted"
}
```

## Endpointy AI

### POST /api/ai/move
Pobiera ruch AI dla danego stanu gry.

**Request Body:**
```json
{
  "board": [["X", null, null], [null, "O", null], [null, null, null]],
  "currentPlayer": "O",
  "difficulty": "hard",
  "boardSize": 3,
  "winCondition": 3
}
```

**Response (200 OK):**
```json
{
  "row": 0,
  "col": 2,
  "thinkingTime": 157,
  "evaluation": 0.5,
  "difficulty": "hard"
}
```

### POST /api/ai/analyze
Analizuje pozycję na planszy.

**Request Body:**
```json
{
  "board": [["X", "O", null], [null, "X", null], [null, null, "O"]],
  "currentPlayer": "X",
  "boardSize": 3,
  "winCondition": 3
}
```

**Response (200 OK):**
```json
{
  "evaluation": 0.3,
  "advantage": "X",
  "details": {
    "lineScore": 15,
    "opponentLineScore": 12,
    "positionScore": 8,
    "mobilityScore": 4,
    "threats": [],
    "opportunities": [
      {
        "type": "immediate",
        "line": ["X", "X", null]
      }
    ]
  }
}
```

### POST /api/ai/hint
Zwraca podpowiedź dla gracza.

**Request Body:**
```json
{
  "board": [["X", null, null], [null, "O", null], [null, null, null]],
  "currentPlayer": "X",
  "boardSize": 3,
  "winCondition": 3
}
```

**Response (200 OK):**
```json
{
  "row": 1,
  "col": 1,
  "reason": "Best move according to AI",
  "evaluation": 0.7
}
```

### POST /api/ai/cache/clear
Czyści cache AI.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "AI cache cleared"
}
```

## Endpointy Rankingu

### GET /api/leaderboard
Pobiera ranking graczy.

**Query Parameters:**
- `limit` (number, default: 10): liczba wyników
- `offset` (number, default: 0): przesunięcie
- `mode` (string, default: "all"): "pvp" | "pve" | "all"

**Response (200 OK):**
```json
{
  "players": [
    {
      "rank": 1,
      "name": "Player1",
      "wins": 50,
      "losses": 10,
      "draws": 5,
      "gamesPlayed": 65,
      "rating": 1850,
      "winRate": 0.77
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

### POST /api/leaderboard/submit
Zapisuje wynik gry.

**Request Body:**
```json
{
  "playerName": "Player1",
  "opponent": "AI-hard",
  "result": "win",
  "mode": "pve",
  "moves": 7,
  "duration": 45000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "player": {
    "name": "Player1",
    "wins": 51,
    "losses": 10,
    "draws": 5,
    "gamesPlayed": 66,
    "rating": 1875,
    "winRate": 0.77
  }
}
```

### GET /api/leaderboard/player/:name
Pobiera statystyki konkretnego gracza.

**Response (200 OK):**
```json
{
  "name": "Player1",
  "wins": 50,
  "losses": 10,
  "draws": 5,
  "gamesPlayed": 65,
  "rating": 1850,
  "rank": 1,
  "winRate": 0.77,
  "stats": {
    "pvp": {
      "wins": 30,
      "losses": 8,
      "draws": 3,
      "gamesPlayed": 41
    },
    "pve": {
      "wins": 20,
      "losses": 2,
      "draws": 2,
      "gamesPlayed": 24
    }
  },
  "createdAt": 1234567890,
  "lastActive": 1234567999
}
```

### DELETE /api/leaderboard/player/:name
Usuwa gracza z rankingu.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Player removed from leaderboard"
}
```

## Kody Błędów

### 400 Bad Request
Nieprawidłowe dane wejściowe.

```json
{
  "error": "Invalid board size"
}
```

### 404 Not Found
Zasób nie znaleziony.

```json
{
  "error": "Game not found"
}
```

### 500 Internal Server Error
Błąd serwera.

```json
{
  "error": "Internal Server Error"
}
```

## Przykłady Użycia

### Nowa gra PvP
```bash
curl -X POST http://localhost:3000/api/game/new \
  -H "Content-Type: application/json" \
  -d '{"mode":"pvp","boardSize":3,"playerX":"Alice","playerO":"Bob"}'
```

### Nowa gra z AI
```bash
curl -X POST http://localhost:3000/api/game/new \
  -H "Content-Type: application/json" \
  -d '{"mode":"pve","difficulty":"hard","playerX":"Alice","playerO":"AI"}'
```

### Wykonaj ruch
```bash
curl -X POST http://localhost:3000/api/game/{gameId}/move \
  -H "Content-Type: application/json" \
  -d '{"row":0,"col":0,"player":"X"}'
```

### Pobierz ruch AI
```bash
curl -X POST http://localhost:3000/api/ai/move \
  -H "Content-Type: application/json" \
  -d '{"board":[[null,null,null],[null,null,null],[null,null,null]],"currentPlayer":"X","difficulty":"hard"}'
```

### Pobierz ranking
```bash
curl http://localhost:3000/api/leaderboard?limit=10&mode=pvp
```
