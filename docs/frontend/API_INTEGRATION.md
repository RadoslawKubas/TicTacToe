# Integracja z Backend API

## Przegląd

Aplikacja komunikuje się z backendem poprzez REST API oraz WebSocket dla gry online w czasie rzeczywistym.

## ApiService

**Plik:** `src/services/ApiService.js`

### Konfiguracja

```javascript
const apiService = new ApiService();
apiService.baseURL = 'https://api.example.com';
apiService.timeout = 10000; // 10 sekund
```

### Metody

#### `request(endpoint, options)`

Podstawowa metoda do wykonywania żądań HTTP.

```javascript
const data = await apiService.request('/game/new', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer TOKEN'
    },
    body: JSON.stringify({ mode: 'ai' })
});
```

#### `createGame(settings)`

Tworzy nową grę na serwerze.

**Request:**
```javascript
const game = await apiService.createGame({
    mode: 'ai',
    difficulty: 'hard',
    boardSize: 3
});
```

**Response:**
```json
{
    "gameId": "game_123456",
    "status": "created",
    "board": [["", "", ""], ["", "", ""], ["", "", ""]],
    "currentPlayer": "X"
}
```

#### `makeMove(gameId, move)`

Wykonuje ruch w grze.

**Request:**
```javascript
const result = await apiService.makeMove('game_123456', {
    player: 'X',
    row: 0,
    col: 0
});
```

**Response:**
```json
{
    "success": true,
    "board": [["X", "", ""], ["", "", ""], ["", "", ""]],
    "currentPlayer": "O",
    "status": "playing"
}
```

#### `getGameState(gameId)`

Pobiera aktualny stan gry.

**Request:**
```javascript
const state = await apiService.getGameState('game_123456');
```

**Response:**
```json
{
    "gameId": "game_123456",
    "board": [["X", "O", ""], ["", "X", ""], ["", "", ""]],
    "currentPlayer": "O",
    "status": "playing",
    "moves": [
        {"player": "X", "row": 0, "col": 0, "timestamp": 1234567890},
        {"player": "O", "row": 0, "col": 1, "timestamp": 1234567891}
    ]
}
```

#### `getAIMove(gameState, difficulty)`

Pobiera ruch AI z serwera.

**Request:**
```javascript
const aiMove = await apiService.getAIMove({
    board: [["X", "", ""], ["", "", ""], ["", "", ""]],
    currentPlayer: "O"
}, 'hard');
```

**Response:**
```json
{
    "move": {
        "row": 1,
        "col": 1
    },
    "reasoning": "Blocking opponent's potential win"
}
```

#### `getLeaderboard(limit)`

Pobiera ranking graczy.

**Request:**
```javascript
const leaderboard = await apiService.getLeaderboard(10);
```

**Response:**
```json
{
    "entries": [
        {
            "rank": 1,
            "username": "Player1",
            "wins": 150,
            "losses": 20,
            "draws": 10,
            "winRate": 83.3
        }
    ]
}
```

## GameService

**Plik:** `src/services/GameService.js`

### Opis

GameService zarządza logiką gry i koordynuje komunikację między frontendem a backendem.

### Metody

#### `startNewGame(settings)`

Rozpoczyna nową grę.

```javascript
await gameService.startNewGame({
    mode: 'ai',
    difficulty: 'hard',
    boardSize: 3
});
```

#### `makeMove(row, col)`

Wykonuje ruch.

```javascript
const success = gameService.makeMove(0, 0);
if (success) {
    // Ruch wykonany pomyślnie
}
```

#### `getAIMove()`

Pobiera ruch AI (lokalnie lub z serwera).

```javascript
const [row, col] = await gameService.getAIMove();
```

#### `undoMove()`

Cofa ostatni ruch.

```javascript
const success = gameService.undoMove();
```

#### `getHint()`

Pobiera podpowiedź.

```javascript
const [row, col] = gameService.getHint();
```

## WebSocketService

**Plik:** `src/services/WebSocketService.js`

### Opis

Zarządza połączeniem WebSocket dla gry online w czasie rzeczywistym.

### Inicjalizacja

```javascript
const wsService = new WebSocketService();

wsService.onConnect = () => {
    console.log('Connected to server');
};

wsService.onDisconnect = () => {
    console.log('Disconnected from server');
};

wsService.onMessage = (data) => {
    console.log('Received:', data);
};

wsService.connect('game_123456');
```

### Wysyłanie wiadomości

#### `sendMove(move)`

```javascript
wsService.sendMove({
    player: 'X',
    row: 0,
    col: 0,
    timestamp: Date.now()
});
```

#### `sendChat(message)`

```javascript
wsService.sendChat('Dobra gra!');
```

### Odbieranie wiadomości

**Struktura wiadomości:**

```json
{
    "type": "move",
    "data": {
        "player": "O",
        "row": 1,
        "col": 1
    }
}
```

**Typy wiadomości:**
- `move` - Ruch przeciwnika
- `game_over` - Koniec gry
- `chat` - Wiadomość czatu
- `player_joined` - Gracz dołączył
- `player_left` - Gracz wyszedł
- `ping` - Heartbeat

**Przykład obsługi:**

```javascript
wsService.onMessage = (message) => {
    switch (message.type) {
        case 'move':
            handleOpponentMove(message.data);
            break;
        case 'game_over':
            handleGameOver(message.data);
            break;
        case 'chat':
            displayChatMessage(message.data);
            break;
    }
};
```

### Reconnection

WebSocketService automatycznie próbuje ponownie nawiązać połączenie:

```javascript
wsService.maxReconnectAttempts = 5;
wsService.reconnectDelay = 1000; // ms
```

## Formaty Danych

### GameState

```typescript
interface GameState {
    gameId: string;
    board: string[][];
    currentPlayer: 'X' | 'O';
    status: 'waiting' | 'playing' | 'won' | 'draw';
    winner: 'X' | 'O' | null;
    winningLine: number[][] | null;
    moves: Move[];
    settings: GameSettings;
}
```

### Move

```typescript
interface Move {
    player: 'X' | 'O';
    row: number;
    col: number;
    timestamp: number;
}
```

### GameSettings

```typescript
interface GameSettings {
    mode: 'local' | 'ai' | 'online' | 'tournament' | 'training';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'impossible';
    boardSize: 3 | 4 | 5;
    soundEnabled: boolean;
    volume: number;
    animationsEnabled: boolean;
    theme: string;
    language: string;
}
```

## Obsługa Błędów

### Try-Catch

```javascript
try {
    const result = await apiService.makeMove(gameId, move);
    // Handle success
} catch (error) {
    console.error('Failed to make move:', error);
    // Show error to user
    showErrorNotification('Nie udało się wykonać ruchu');
}
```

### Retry Logic

```javascript
async function makeMoviWithRetry(gameId, move, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiService.makeMove(gameId, move);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### Timeout

```javascript
async function requestWithTimeout(promise, timeout = 5000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

const result = await requestWithTimeout(
    apiService.getGameState(gameId),
    5000
);
```

## Caching

### Lokalny cache

```javascript
class CachedApiService extends ApiService {
    constructor() {
        super();
        this.cache = new Map();
    }

    async getGameState(gameId) {
        const cached = this.cache.get(gameId);
        if (cached && Date.now() - cached.timestamp < 5000) {
            return cached.data;
        }

        const data = await super.getGameState(gameId);
        this.cache.set(gameId, {
            data,
            timestamp: Date.now()
        });

        return data;
    }
}
```

## Autentykacja

### Token-based auth

```javascript
class AuthenticatedApiService extends ApiService {
    setAuthToken(token) {
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const authOptions = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${this.token}`
            }
        };

        return super.request(endpoint, authOptions);
    }
}
```

## Testing

### Mock API

```javascript
class MockApiService extends ApiService {
    async createGame(settings) {
        return {
            gameId: 'mock_game_123',
            status: 'created',
            board: [['', '', ''], ['', '', ''], ['', '', '']],
            currentPlayer: 'X'
        };
    }

    async makeMove(gameId, move) {
        return {
            success: true,
            board: [['X', '', ''], ['', '', ''], ['', '', '']],
            currentPlayer: 'O',
            status: 'playing'
        };
    }
}
```

### Integration tests

```javascript
describe('ApiService', () => {
    let apiService;

    beforeEach(() => {
        apiService = new ApiService();
    });

    it('should create a new game', async () => {
        const game = await apiService.createGame({
            mode: 'ai',
            difficulty: 'easy'
        });

        expect(game.gameId).toBeDefined();
        expect(game.status).toBe('created');
    });

    it('should make a move', async () => {
        const game = await apiService.createGame({ mode: 'local' });
        const result = await apiService.makeMove(game.gameId, {
            player: 'X',
            row: 0,
            col: 0
        });

        expect(result.success).toBe(true);
    });
});
```

## Environment Variables

```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const WS_BASE_URL = process.env.WS_BASE_URL || 'ws://localhost:3000/ws';

const apiService = new ApiService();
apiService.baseURL = API_BASE_URL;
```

## CORS Configuration

Backend powinien być skonfigurowany do obsługi CORS:

```javascript
// Backend (Node.js/Express)
app.use(cors({
    origin: ['http://localhost:8080', 'https://yourdomain.com'],
    credentials: true
}));
```
