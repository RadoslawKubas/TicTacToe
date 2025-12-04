# 🎮 TicTacToe - Zaawansowana Gra Web

Rozbudowana implementacja klasycznej gry Kółko i Krzyżyk w wersji webowej z wieloma trybami gry, zaawansowaną sztuczną inteligencją i grą multiplayer online.

## ✨ Funkcje

### Tryby Gry
- 🎯 **Gracz vs Gracz** (lokalnie)
- 🤖 **Gracz vs AI** (5 poziomów trudności)
- 🌐 **Multiplayer Online** (WebSocket)
- 🏆 **Tryb Turniejowy**
- 📚 **Tryb Treningowy**

### Sztuczna Inteligencja
- **Łatwy** - Losowe ruchy
- **Średni** - Podstawowa heurystyka
- **Trudny** - Algorytm Minimax
- **Ekspert** - Minimax z Alpha-Beta pruning
- **Niemożliwy** - Perfekcyjna gra (nigdy nie przegrywa)

### Funkcje UI/UX
- 🎨 4 motywy kolorystyczne (Light, Dark, Neon, Retro)
- 🔊 Efekty dźwiękowe i muzyka w tle
- ✨ Płynne animacje i efekty cząsteczkowe
- 📱 Pełna responsywność (mobile, tablet, desktop)
- ♿ Dostępność (ARIA, nawigacja klawiaturą)
- 🌍 Wielojęzyczność (PL, EN, DE, ES)

### Dodatkowe
- 📊 System rankingowy i statystyki
- 🏅 System osiągnięć
- 🔄 Replay i analiza gier
- 📐 Konfigurowalna wielkość planszy (3x3, 4x4, 5x5)
- 💬 Chat w grze online

## 🛠️ Technologie

### Frontend
- HTML5, CSS3, JavaScript/TypeScript
- Canvas API (animacje)
- WebSocket (gra online)

### Backend
- Node.js / Express
- WebSocket (Socket.io)
- SQLite / PostgreSQL
- Algorytmy AI (Minimax, Alpha-Beta)

## 📁 Struktura Projektu

```
TicTacToe/
├── docs/                          # Dokumentacja
│   ├── AGENT_1_FRONTEND.md        # Plan dla zespołu Frontend
│   ├── AGENT_2_BACKEND.md         # Plan dla zespołu Backend
│   ├── frontend/                  # Dokumentacja Frontend
│   └── backend/                   # Dokumentacja Backend
├── src/                           # Kod źródłowy Frontend
│   ├── components/
│   ├── styles/
│   ├── animations/
│   ├── services/
│   └── assets/
└── server/                        # Kod źródłowy Backend
    ├── game/
    ├── ai/
    ├── routes/
    ├── websocket/
    └── models/
```

## 🚀 Rozpoczęcie Pracy

### Wymagania
- Node.js >= 18.x
- npm lub yarn

### Instalacja
```bash
# Klonowanie repozytorium
git clone https://github.com/[username]/TicTacToe.git
cd TicTacToe

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

## 👥 Zespół Deweloperski

Projekt jest rozwijany przez dwa równoległe zespoły:

- **Agent 1 (Frontend)** - Interfejs użytkownika, animacje, integracja
- **Agent 2 (Backend)** - Logika gry, AI, API, multiplayer

Szczegółowe plany pracy znajdują się w:
- [`docs/AGENT_1_FRONTEND.md`](docs/AGENT_1_FRONTEND.md)
- [`docs/AGENT_2_BACKEND.md`](docs/AGENT_2_BACKEND.md)

## 📄 Licencja

MIT License

## 🤝 Współpraca

Zapraszamy do współpracy! Sprawdź plany pracy w katalogu `docs/` i wybierz zadanie do realizacji.

---

*Stworzono z ❤️ dla miłośników klasycznych gier*
