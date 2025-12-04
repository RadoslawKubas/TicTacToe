# 🎮 TicTacToe Frontend

Zaawansowana implementacja frontendu gry Kółko i Krzyżyk zgodnie z instrukcjami AGENT_1_FRONTEND.md.

## ✨ Zaimplementowane Funkcje

### 🎯 Tryby Gry
- ✅ Gracz vs Gracz (lokalnie)
- ✅ Gracz vs AI (5 poziomów trudności)
- ✅ Multiplayer Online (WebSocket)
- ✅ Tryb Turniejowy
- ✅ Tryb Treningowy

### 🤖 Sztuczna Inteligencja
- ✅ Łatwy - Losowe ruchy
- ✅ Średni - Podstawowa strategia
- ✅ Trudny - Algorytm Minimax
- ✅ Ekspert - Minimax z Alpha-Beta
- ✅ Niemożliwy - Perfekcyjna gra

### 🎨 Interfejs
- ✅ 4 motywy kolorystyczne (Light, Dark, Neon, Retro)
- ✅ Płynne animacje i efekty cząsteczkowe
- ✅ Pełna responsywność (mobile, tablet, desktop)
- ✅ Dostępność (ARIA, nawigacja klawiaturą)
- ✅ System dźwięków (AudioManager)

### 🌍 Wielojęzyczność
- ✅ Polski (pl)
- ✅ Angielski (en)
- ✅ Niemiecki (de)
- ✅ Hiszpański (es)

### 📊 Dodatkowe Funkcje
- ✅ System wyników i statystyk
- ✅ Zarządzanie stanami (GameState, UserState)
- ✅ Tutorial interaktywny
- ✅ Panel pomocy z FAQ
- ✅ Konfigurowalna wielkość planszy (3x3, 4x4, 5x5)
- ✅ LocalStorage dla trwałości danych

## 🚀 Szybki Start

### Wymagania
- Node.js >= 14.x
- npm >= 6.x

### Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/RadoslawKubas/TicTacToe.git
cd TicTacToe

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:8080`

### Alternatywnie (bez instalacji npm)

Możesz otworzyć `src/index.html` bezpośrednio w przeglądarce, ale niektóre funkcje (np. lokalizacja) mogą nie działać poprawnie z powodu ograniczeń CORS.

## 📁 Struktura Projektu

```
src/
├── index.html                  # Główny plik HTML
├── app.js                      # Główna logika aplikacji
├── styles/
│   ├── main.css               # Główne style
│   ├── responsive.css         # Style responsywne
│   ├── animations.css         # Definicje animacji
│   └── themes/
│       ├── light.css          # Motyw jasny
│       ├── dark.css           # Motyw ciemny
│       ├── neon.css           # Motyw neonowy
│       └── retro.css          # Motyw retro
├── components/
│   ├── GameBoard.js           # Komponent planszy
│   ├── GameCell.js            # Komponent komórki
│   ├── ScoreBoard.js          # Tablica wyników
│   ├── PlayerPanel.js         # Panel gracza
│   ├── MainMenu.js            # Menu główne
│   ├── SettingsPanel.js       # Panel ustawień
│   ├── GameModeSelector.js    # Wybór trybu gry
│   ├── DifficultySelector.js  # Wybór trudności
│   ├── Tutorial.js            # Tutorial
│   └── HelpModal.js           # Modal pomocy
├── animations/
│   ├── AnimationEngine.js     # Silnik animacji
│   ├── SymbolAnimations.js    # Animacje symboli
│   ├── BoardAnimations.js     # Animacje planszy
│   └── ParticleEffects.js     # Efekty cząsteczkowe
├── audio/
│   └── AudioManager.js        # Zarządzanie dźwiękiem
├── services/
│   ├── ApiService.js          # Serwis API
│   ├── GameService.js         # Serwis gry
│   └── WebSocketService.js    # Serwis WebSocket
├── state/
│   ├── GameState.js           # Stan gry
│   └── UserState.js           # Stan użytkownika
├── utils/
│   ├── DeviceDetector.js      # Detekcja urządzenia
│   └── AccessibilityManager.js # Zarządzanie dostępnością
├── i18n/
│   ├── LanguageManager.js     # Zarządzanie językami
│   └── locales/
│       ├── en.json            # Tłumaczenia angielskie
│       ├── pl.json            # Tłumaczenia polskie
│       ├── de.json            # Tłumaczenia niemieckie
│       └── es.json            # Tłumaczenia hiszpańskie
└── assets/
    ├── images/                # Obrazy
    ├── sounds/                # Pliki dźwiękowe
    └── fonts/                 # Czcionki
```

## 🎮 Jak Grać

### Rozpoczęcie Gry

1. Kliknij "Nowa Gra" w menu głównym
2. Wybierz tryb gry
3. Dla trybu AI - wybierz poziom trudności
4. Graj!

### Sterowanie

#### Mysz
- Kliknij na puste pole, aby wykonać ruch

#### Klawiatura
- `1-9` - Wybór pola (dla planszy 3x3)
- `Arrow keys` - Nawigacja po planszy
- `Enter` - Wybór pola
- `R` - Restart gry
- `U` - Cofnij ruch
- `H` - Podpowiedź
- `ESC` - Wyjście do menu
- `F1` - Pomoc

## ⚙️ Konfiguracja

### Ustawienia Gry

Dostępne w panelu "Ustawienia":
- **Motyw** - Wybór spośród 4 motywów
- **Rozmiar planszy** - 3x3, 4x4 lub 5x5
- **Język** - Polski, Angielski, Niemiecki, Hiszpański
- **Dźwięk** - Włącz/wyłącz, kontrola głośności
- **Animacje** - Włącz/wyłącz

### LocalStorage

Aplikacja automatycznie zapisuje:
- Stan gry (do funkcji "Kontynuuj")
- Preferencje użytkownika
- Statystyki i osiągnięcia

## 🎨 Motywy

### Light (Jasny)
Klasyczny jasny motyw z niebieskimi akcentami.

### Dark (Ciemny)
Nowoczesny ciemny motyw przyjazny dla oczu.

### Neon (Neonowy)
Futurystyczny motyw z efektami świecenia neonowego.

### Retro (Retro)
Nostalgiczny motyw w stylu lat 80-tych.

## 🔧 Dla Deweloperów

### Skrypty npm

```bash
# Uruchomienie serwera deweloperskiego
npm run dev

# Uruchomienie (alias dla dev)
npm start

# Testy
npm test
```

### Dokumentacja

Szczegółowa dokumentacja dostępna w katalogu `docs/frontend/`:

- [COMPONENTS.md](docs/frontend/COMPONENTS.md) - Dokumentacja komponentów
- [ANIMATIONS.md](docs/frontend/ANIMATIONS.md) - System animacji
- [STYLING.md](docs/frontend/STYLING.md) - Przewodnik po stylach
- [API_INTEGRATION.md](docs/frontend/API_INTEGRATION.md) - Integracja z backend
- [ACCESSIBILITY.md](docs/frontend/ACCESSIBILITY.md) - Wytyczne dostępności

### Architektura

Aplikacja wykorzystuje modułową architekturę z separacją odpowiedzialności:

- **Components** - Komponenty UI
- **State** - Zarządzanie stanem
- **Services** - Logika biznesowa i komunikacja
- **Utils** - Narzędzia pomocnicze
- **Animations** - System animacji

### Wzorce Projektowe

- **Dependency Injection** - Komponenty otrzymują zależności przez konstruktor
- **Observer Pattern** - Callbacki dla zdarzeń
- **State Pattern** - Zarządzanie stanami gry
- **Singleton** - Dla managerów (Audio, Accessibility)

## 🌐 Integracja z Backend

### REST API

```javascript
// Nowa gra
POST /api/game/new
Body: { mode: 'ai', difficulty: 'hard' }

// Wykonanie ruchu
POST /api/game/move
Body: { gameId: '123', move: { player: 'X', row: 0, col: 0 } }

// Pobranie stanu gry
GET /api/game/:id

// Ruch AI
POST /api/ai/move
Body: { gameState: {...}, difficulty: 'hard' }
```

### WebSocket

```javascript
// Połączenie
WS /ws/game/:id

// Wysyłanie ruchu
{ type: 'move', data: { player: 'X', row: 0, col: 0 } }

// Odbieranie ruchu przeciwnika
{ type: 'move', data: { player: 'O', row: 1, col: 1 } }
```

## ♿ Dostępność

Aplikacja została zaprojektowana zgodnie z wytycznymi WCAG 2.1 AA:

- ✅ Pełna nawigacja klawiaturą
- ✅ ARIA labels i role
- ✅ Screen reader support
- ✅ Kontrast kolorów
- ✅ Focus indicators
- ✅ Reduced motion support
- ✅ High contrast mode

## 📱 Responsywność

Aplikacja działa na:
- 📱 Telefonach (320px+)
- 📱 Tabletach (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🐛 Znane Problemy

- Pliki dźwiękowe nie są dołączone (folder `assets/sounds/` jest pusty)
- Obrazy dla tutorialu wymagają dodania
- Backend API nie jest zaimplementowany (używany jest mock lokalny)

## 🤝 Współpraca

Plan pracy dla Agenta 2 (Backend) znajduje się w:
- [docs/AGENT_2_BACKEND.md](docs/AGENT_2_BACKEND.md)

## 📄 Licencja

MIT License

## 🙏 Podziękowania

Projekt stworzony zgodnie ze specyfikacją AGENT_1_FRONTEND.md jako część większego projektu TicTacToe.

---

*Stworzone z ❤️ dla miłośników klasycznych gier*
