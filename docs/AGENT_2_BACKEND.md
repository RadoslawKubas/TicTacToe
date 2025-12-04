# Plan Pracy - Agent 2: Backend, Logika Gry & AI

## 📋 Informacje Ogólne
- **Rola**: Backend Developer & AI Engineer
- **Odpowiedzialność**: Logika gry, algorytmy AI, API, baza danych, serwer multiplayer
- **Technologie**: Node.js/Express, WebSocket, algorytmy AI (Minimax, Alpha-Beta), SQLite/PostgreSQL

---

## 🎯 Zadania do Wykonania

### Faza 1: Podstawowa Logika Gry

#### 1.1 Silnik Gry
**Plik do utworzenia**: `server/game/GameEngine.js`
```
Opis: Główny silnik gry
- Inicjalizacja planszy (dynamiczny rozmiar NxN)
- Walidacja ruchów
- Sprawdzanie warunków wygranej
- Wykrywanie remisu
- Historia ruchów
- Cofanie ruchów (undo)
```

**Dokumentacja**: `docs/backend/GAME_ENGINE.md`
```markdown
# Silnik Gry - Dokumentacja

## Klasa GameEngine

### Konstruktor
`new GameEngine(size = 3, winCondition = 3)`
- size: rozmiar planszy NxN
- winCondition: ile symboli w rzędzie do wygranej

### Metody Publiczne

#### initBoard()
Inicjalizuje pustą planszę.
Zwraca: Array[size][size] wypełniony null

#### makeMove(row, col, player)
Wykonuje ruch na planszy.
- row: numer wiersza (0 do size-1)
- col: numer kolumny (0 do size-1)
- player: 'X' lub 'O'
Zwraca: { success: boolean, error?: string }

#### checkWin()
Sprawdza czy jest zwycięzca.
Zwraca: { winner: 'X'|'O'|null, line: [[row,col],...] | null }

#### checkDraw()
Sprawdza czy jest remis.
Zwraca: boolean

#### getValidMoves()
Zwraca listę dostępnych ruchów.
Zwraca: [[row, col], ...]

#### undoMove()
Cofa ostatni ruch.
Zwraca: Move | null

#### getGameState()
Zwraca pełny stan gry.
Zwraca: GameState object
```

**Plik do utworzenia**: `server/game/BoardValidator.js`
```
Opis: Walidator planszy
- Sprawdzanie poprawności ruchu
- Wykrywanie nielegalnych stanów
- Walidacja konfiguracji gry
```

**Plik do utworzenia**: `server/game/WinChecker.js`
```
Opis: Sprawdzanie wygranej
- Sprawdzanie wierszy
- Sprawdzanie kolumn
- Sprawdzanie przekątnych
- Optymalizacja dla dużych plansz
- Zwracanie linii wygranej
```

---

### Faza 2: Algorytmy AI

#### 2.1 System AI
**Plik do utworzenia**: `server/ai/AIEngine.js`
```
Opis: Główny silnik AI
- Interfejs dla różnych algorytmów
- Wybór algorytmu na podstawie poziomu trudności
- Zarządzanie czasem myślenia
- Cache dla obliczonych ruchów
```

**Dokumentacja**: `docs/backend/AI_ENGINE.md`
```markdown
# Silnik AI - Dokumentacja

## Poziomy Trudności

### Easy (Łatwy)
- Algorytm: Losowy wybór z dostępnych pól
- Szansa na "głupi" ruch: 100%

### Medium (Średni)
- Algorytm: Podstawowa heurystyka
- Priorytetyzuje: centrum, rogi, blokowanie
- Szansa na optymalny ruch: 50%

### Hard (Trudny)
- Algorytm: Minimax (depth 4)
- Blokuje wygrane przeciwnika
- Szuka własnych wygranych

### Expert (Ekspert)
- Algorytm: Minimax z Alpha-Beta pruning
- Pełna głębokość przeszukiwania
- Optymalizacja kolejności ruchów

### Impossible (Niemożliwy)
- Algorytm: Perfekcyjny Minimax
- Zawsze gra optymalnie
- Nigdy nie przegrywa

## Interfejs AIPlayer

### selectMove(gameState, difficulty)
Zwraca optymalny ruch dla danego poziomu trudności.
```

**Plik do utworzenia**: `server/ai/algorithms/RandomAI.js`
```
Opis: AI losowy (poziom łatwy)
- Losowy wybór z dostępnych pól
- Symulacja "myślenia" (opóźnienie)
```

**Plik do utworzenia**: `server/ai/algorithms/HeuristicAI.js`
```
Opis: AI heurystyczny (poziom średni)
- Ocena pozycji na planszy
- Priorytetyzacja środka i rogów
- Podstawowe blokowanie
- Wykrywanie dwóch w rzędzie
```

**Plik do utworzenia**: `server/ai/algorithms/MinimaxAI.js`
```
Opis: AI Minimax (poziom trudny)
- Klasyczny algorytm Minimax
- Ograniczenie głębokości
- Funkcja oceny stanów
```

**Dokumentacja**: `docs/backend/MINIMAX.md`
```markdown
# Algorytm Minimax - Dokumentacja

## Opis
Minimax to algorytm decyzyjny używany w grach turowych.
Zakłada, że obaj gracze grają optymalnie.

## Pseudokod
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

## Funkcja Oceny
- Wygrana AI: +10
- Wygrana gracza: -10
- Remis: 0
- W trakcie: heurystyczna ocena pozycji

## Optymalizacje
1. Alpha-Beta Pruning - obcina nieistotne gałęzie
2. Iterative Deepening - stopniowe pogłębianie
3. Transposition Table - cache stanów
4. Move Ordering - sortowanie ruchów
```

**Plik do utworzenia**: `server/ai/algorithms/AlphaBetaAI.js`
```
Opis: AI z Alpha-Beta pruning (poziom ekspert)
- Minimax z optymalizacją alpha-beta
- Sortowanie ruchów
- Tablica transpozycji
```

**Plik do utworzenia**: `server/ai/algorithms/PerfectAI.js`
```
Opis: Perfekcyjny AI (poziom niemożliwy)
- Prekalkulowane optymalne ruchy dla 3x3
- Rozszerzony minimax dla większych plansz
- Zero błędów
```

#### 2.2 Heurystyki i Ocena
**Plik do utworzenia**: `server/ai/Evaluator.js`
```
Opis: Funkcje oceny stanu gry
- Ocena linii (ile symboli w rzędzie)
- Ocena pozycji (centrum vs rogi vs krawędzie)
- Ocena mobilności (ile możliwych ruchów)
- Ocena zagrożeń (wykrywanie przyszłych zagrożeń)
```

---

### Faza 3: API REST

#### 3.1 Serwer Express
**Plik do utworzenia**: `server/index.js`
```
Opis: Główny plik serwera
- Inicjalizacja Express
- Middleware (CORS, JSON parser, logging)
- Montowanie routerów
- Obsługa błędów
- Uruchomienie serwera
```

**Plik do utworzenia**: `server/config/config.js`
```
Opis: Konfiguracja serwera
- Port
- Ustawienia CORS
- Połączenie z bazą danych
- Klucze API
- Ustawienia sesji
```

#### 3.2 Endpointy API
**Plik do utworzenia**: `server/routes/gameRoutes.js`
```
Opis: Routing dla gry
- POST /api/game/new - Nowa gra
- GET /api/game/:id - Pobierz grę
- POST /api/game/:id/move - Wykonaj ruch
- POST /api/game/:id/undo - Cofnij ruch
- DELETE /api/game/:id - Usuń grę
```

**Dokumentacja**: `docs/backend/API_REFERENCE.md`
```markdown
# API Reference

## Endpointy Gry

### POST /api/game/new
Tworzy nową grę.

**Request Body:**
```json
{
  "mode": "pvp" | "pve",
  "boardSize": 3,
  "winCondition": 3,
  "difficulty": "easy" | "medium" | "hard" | "expert" | "impossible",
  "playerX": "Player 1",
  "playerO": "Player 2" | "AI"
}
```

**Response:**
```json
{
  "gameId": "uuid-string",
  "board": [["","",""],["","",""],["","",""]],
  "currentPlayer": "X",
  "status": "playing",
  "settings": {...}
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

**Response:**
```json
{
  "success": true,
  "board": [["","X",""],["","",""],["","",""]],
  "currentPlayer": "O",
  "status": "playing",
  "winner": null,
  "winningLine": null,
  "aiMove": null | { "row": 1, "col": 1 }
}
```

### GET /api/game/:id
Pobiera stan gry.

**Response:**
```json
{
  "gameId": "uuid",
  "board": [[...]],
  "currentPlayer": "X",
  "status": "playing" | "won" | "draw",
  "winner": null | "X" | "O",
  "winningLine": null | [[0,0],[0,1],[0,2]],
  "moves": [...],
  "settings": {...},
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Endpointy AI

### POST /api/ai/move
Pobiera ruch AI.

**Request Body:**
```json
{
  "board": [[...]],
  "currentPlayer": "O",
  "difficulty": "hard",
  "boardSize": 3,
  "winCondition": 3
}
```

**Response:**
```json
{
  "row": 1,
  "col": 1,
  "thinkingTime": 150,
  "evaluation": 0.5
}
```

## Endpointy Rankingu

### GET /api/leaderboard
Pobiera ranking graczy.

**Query Parameters:**
- limit: liczba wyników (default: 10)
- offset: przesunięcie (default: 0)
- mode: "pvp" | "pve" | "all"

**Response:**
```json
{
  "players": [
    {
      "rank": 1,
      "name": "Player1",
      "wins": 50,
      "losses": 10,
      "draws": 5,
      "winRate": 0.77,
      "rating": 1850
    }
  ],
  "total": 100
}
```

### POST /api/leaderboard/submit
Zapisuje wynik gry.

**Request Body:**
```json
{
  "playerName": "Player1",
  "opponent": "AI-hard",
  "result": "win" | "loss" | "draw",
  "moves": 7,
  "duration": 45000
}
```
```

**Plik do utworzenia**: `server/routes/aiRoutes.js`
```
Opis: Routing dla AI
- POST /api/ai/move - Pobierz ruch AI
- POST /api/ai/analyze - Analiza pozycji
- GET /api/ai/hint - Podpowiedź dla gracza
```

**Plik do utworzenia**: `server/routes/leaderboardRoutes.js`
```
Opis: Routing dla rankingu
- GET /api/leaderboard - Pobierz ranking
- POST /api/leaderboard/submit - Zapisz wynik
- GET /api/leaderboard/player/:name - Statystyki gracza
```

---

### Faza 4: Multiplayer Online

#### 4.1 WebSocket Server
**Plik do utworzenia**: `server/websocket/WebSocketServer.js`
```
Opis: Serwer WebSocket
- Inicjalizacja Socket.io / ws
- Zarządzanie połączeniami
- Autentykacja
- Heartbeat
- Rooms dla gier
```

**Dokumentacja**: `docs/backend/WEBSOCKET.md`
```markdown
# WebSocket Protocol - Dokumentacja

## Połączenie
URL: `ws://server/ws/game/:gameId`

## Wydarzenia (Events)

### Client -> Server

#### join_game
```json
{
  "type": "join_game",
  "gameId": "uuid",
  "playerName": "Player1",
  "playerId": "uuid"
}
```

#### make_move
```json
{
  "type": "make_move",
  "row": 0,
  "col": 1
}
```

#### chat_message
```json
{
  "type": "chat_message",
  "message": "Good luck!"
}
```

#### request_rematch
```json
{
  "type": "request_rematch"
}
```

### Server -> Client

#### game_state
```json
{
  "type": "game_state",
  "board": [[...]],
  "currentPlayer": "X",
  "players": {...}
}
```

#### move_made
```json
{
  "type": "move_made",
  "row": 0,
  "col": 1,
  "player": "X",
  "nextPlayer": "O"
}
```

#### game_over
```json
{
  "type": "game_over",
  "winner": "X" | null,
  "winningLine": [[0,0],[0,1],[0,2]] | null,
  "isDraw": false
}
```

#### player_joined
```json
{
  "type": "player_joined",
  "playerName": "Player2",
  "symbol": "O"
}
```

#### player_left
```json
{
  "type": "player_left",
  "playerName": "Player2"
}
```

#### error
```json
{
  "type": "error",
  "code": "INVALID_MOVE",
  "message": "Not your turn"
}
```
```

**Plik do utworzenia**: `server/websocket/GameRoom.js`
```
Opis: Pokój gry
- Zarządzanie graczami w pokoju
- Synchronizacja stanu gry
- Obsługa rozłączeń
- Timeout dla nieaktywnych graczy
```

**Plik do utworzenia**: `server/websocket/MatchmakingService.js`
```
Opis: System matchmakingu
- Kolejka graczy oczekujących
- Parowanie graczy o podobnym poziomie
- Tworzenie pokoi gier
- Rating-based matchmaking
```

---

### Faza 5: Baza Danych

#### 5.1 Modele Danych
**Plik do utworzenia**: `server/models/Game.js`
```
Opis: Model gry
- id: UUID
- board: JSON
- currentPlayer: string
- status: enum
- winner: string nullable
- winningLine: JSON nullable
- moves: JSON array
- settings: JSON
- playerX: string
- playerO: string
- createdAt: timestamp
- updatedAt: timestamp
```

**Plik do utworzenia**: `server/models/Player.js`
```
Opis: Model gracza
- id: UUID
- name: string unique
- email: string nullable
- passwordHash: string nullable
- rating: integer
- wins: integer
- losses: integer
- draws: integer
- gamesPlayed: integer
- createdAt: timestamp
- lastActive: timestamp
```

**Plik do utworzenia**: `server/models/GameHistory.js`
```
Opis: Historia gier
- id: UUID
- gameId: UUID
- playerXId: UUID
- playerOId: UUID
- winner: string nullable
- duration: integer (ms)
- movesCount: integer
- replay: JSON
- playedAt: timestamp
```

#### 5.2 Migracje i Seeders
**Plik do utworzenia**: `server/database/migrations/`
```
Opis: Migracje bazy danych
- 001_create_players_table.js
- 002_create_games_table.js
- 003_create_game_history_table.js
- 004_add_indexes.js
```

**Plik do utworzenia**: `server/database/seeders/`
```
Opis: Dane testowe
- 001_seed_players.js
- 002_seed_sample_games.js
```

---

### Faza 6: Zaawansowane Funkcje

#### 6.1 System Replay
**Plik do utworzenia**: `server/services/ReplayService.js`
```
Opis: Serwis replay
- Zapisywanie pełnej historii gry
- Odtwarzanie gier krok po kroku
- Eksport do JSON/PGN-like format
- Analiza gier
```

#### 6.2 System Analizy
**Plik do utworzenia**: `server/services/AnalysisService.js`
```
Opis: Analiza pozycji
- Ocena aktualnej pozycji
- Najlepszy ruch z wyjaśnieniem
- Błędy w grze
- Statystyki ruchu
```

#### 6.3 System Osiągnięć
**Plik do utworzenia**: `server/services/AchievementService.js`
```
Opis: System osiągnięć
- Definicje osiągnięć
- Sprawdzanie warunków
- Przyznawanie osiągnięć
- Powiadomienia
```

**Dokumentacja**: `docs/backend/ACHIEVEMENTS.md`
```markdown
# System Osiągnięć

## Lista Osiągnięć

### Dla Początkujących
- **First Win** - Wygraj pierwszą grę
- **First Online Win** - Wygraj pierwszą grę online
- **Tutorial Complete** - Ukończ tutorial

### Umiejętności
- **Speed Demon** - Wygraj grę w mniej niż 30 sekund
- **Perfectionist** - Wygraj bez straty ani jednej tury
- **Comeback King** - Wygraj będąc w niekorzystnej pozycji

### Doświadczenie
- **Veteran** - Rozegraj 100 gier
- **Master** - Wygraj 50 gier
- **Unbeatable** - Wygraj 10 gier z rzędu

### Specjalne
- **AI Hunter** - Pokonaj AI na poziomie Impossible
- **Social Butterfly** - Rozegraj 10 gier z różnymi graczami
- **Night Owl** - Graj o 3 w nocy
```

---

## 📁 Struktura Katalogów Backend

```
server/
├── index.js
├── config/
│   └── config.js
├── game/
│   ├── GameEngine.js
│   ├── BoardValidator.js
│   └── WinChecker.js
├── ai/
│   ├── AIEngine.js
│   ├── Evaluator.js
│   └── algorithms/
│       ├── RandomAI.js
│       ├── HeuristicAI.js
│       ├── MinimaxAI.js
│       ├── AlphaBetaAI.js
│       └── PerfectAI.js
├── routes/
│   ├── gameRoutes.js
│   ├── aiRoutes.js
│   └── leaderboardRoutes.js
├── websocket/
│   ├── WebSocketServer.js
│   ├── GameRoom.js
│   └── MatchmakingService.js
├── models/
│   ├── Game.js
│   ├── Player.js
│   └── GameHistory.js
├── services/
│   ├── ReplayService.js
│   ├── AnalysisService.js
│   └── AchievementService.js
├── database/
│   ├── connection.js
│   ├── migrations/
│   └── seeders/
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
└── utils/
    ├── logger.js
    └── helpers.js
```

---

## 🔗 Punkty Integracji z Agentem 1

### API Endpoints (do wystawienia):
1. `POST /api/game/new` - Nowa gra
2. `POST /api/game/:id/move` - Wykonanie ruchu
3. `GET /api/game/:id` - Pobranie stanu gry
4. `POST /api/ai/move` - Ruch AI
5. `GET /api/leaderboard` - Ranking
6. `WS /ws/game/:id` - WebSocket dla gry online

### Formaty Danych (uzgodnione z Agentem 1):
```javascript
// Stan gry
{
  gameId: string,
  board: string[][], // 'X', 'O', ''
  currentPlayer: 'X' | 'O',
  status: 'playing' | 'won' | 'draw',
  winner: 'X' | 'O' | null,
  winningLine: number[][] | null,
  moves: Move[],
  settings: GameSettings
}

// Ruch
{
  player: 'X' | 'O',
  row: number,
  col: number,
  timestamp: number
}

// Ustawienia gry
{
  boardSize: number,
  winCondition: number,
  mode: 'pvp' | 'pve' | 'online',
  difficulty: string | null,
  timeLimit: number | null
}
```

---

## ✅ Checklist Ukończenia

- [ ] Silnik gry (GameEngine)
- [ ] Walidacja i sprawdzanie wygranej
- [ ] AI - poziom łatwy (Random)
- [ ] AI - poziom średni (Heurystyka)
- [ ] AI - poziom trudny (Minimax)
- [ ] AI - poziom ekspert (Alpha-Beta)
- [ ] AI - poziom niemożliwy (Perfect)
- [ ] API REST - CRUD gry
- [ ] API REST - AI endpoints
- [ ] API REST - Leaderboard
- [ ] WebSocket - podstawowa komunikacja
- [ ] WebSocket - pokoje gier
- [ ] Matchmaking
- [ ] Baza danych - modele
- [ ] Baza danych - migracje
- [ ] System replay
- [ ] System osiągnięć
- [ ] Testy jednostkowe
- [ ] Testy integracyjne

---

## 📝 Dokumentacja do Utworzenia

1. `docs/backend/GAME_ENGINE.md` - Dokumentacja silnika gry
2. `docs/backend/AI_ENGINE.md` - Dokumentacja AI
3. `docs/backend/MINIMAX.md` - Szczegóły algorytmu Minimax
4. `docs/backend/API_REFERENCE.md` - Pełna dokumentacja API
5. `docs/backend/WEBSOCKET.md` - Protokół WebSocket
6. `docs/backend/DATABASE.md` - Schema bazy danych
7. `docs/backend/ACHIEVEMENTS.md` - System osiągnięć

---

## ⚠️ Uwagi dla Agenta 2

1. **Synchronizacja z Agentem 1**: Formaty danych API muszą być zgodne z dokumentacją
2. **Testy AI**: Każdy algorytm AI musi być dokładnie przetestowany
3. **Wydajność**: Minimax musi być zoptymalizowany - timeout max 2 sekundy
4. **Bezpieczeństwo**: Walidacja wszystkich danych wejściowych
5. **Logging**: Szczegółowe logi dla debugowania
6. **Error handling**: Graceful handling wszystkich błędów

---

## 🧪 Testy do Napisania

**Plik**: `server/tests/game/GameEngine.test.js`
```
- Test inicjalizacji planszy
- Test wykonywania ruchów
- Test wykrywania wygranej (wszystkie kierunki)
- Test wykrywania remisu
- Test cofania ruchów
- Test walidacji nielegalnych ruchów
```

**Plik**: `server/tests/ai/MinimaxAI.test.js`
```
- Test wygrywającego ruchu
- Test blokującego ruchu
- Test optymalnej gry
- Test wydajności (timeout)
```

**Plik**: `server/tests/api/gameRoutes.test.js`
```
- Test tworzenia nowej gry
- Test wykonywania ruchu
- Test pobierania stanu gry
- Test błędnych requestów
```

