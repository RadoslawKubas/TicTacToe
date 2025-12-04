# Dokumentacja Komponentów Frontend

## Przegląd

Aplikacja TicTacToe wykorzystuje modułową architekturę komponentów, gdzie każdy komponent jest odpowiedzialny za konkretną funkcjonalność UI.

## Komponenty Gry

### GameBoard

**Plik:** `src/components/GameBoard.js`

**Odpowiedzialność:** Zarządzanie planszą gry i polami

**Główne metody:**
- `init()` - Inicjalizacja planszy
- `render()` - Renderowanie planszy z aktualnym stanem
- `updateCell(row, col, symbol)` - Aktualizacja pojedynczej komórki
- `highlightWinningCells(winningLine)` - Podświetlenie wygrywającej linii
- `animateEntrance()` - Animacja wejścia planszy
- `animateReset()` - Animacja resetu planszy

**Zdarzenia:**
- `onCellClick(row, col)` - Callback wywoływany przy kliknięciu komórki

**Przykład użycia:**
```javascript
const gameBoard = new GameBoard(gameState, audioManager, animationEngine);
gameBoard.init();
gameBoard.onCellClick = (row, col) => {
    console.log(`Kliknięto pole [${row}, ${col}]`);
};
```

### GameCell

**Plik:** `src/components/GameCell.js`

**Odpowiedzialność:** Reprezentacja pojedynczej komórki planszy

**Główne metody:**
- `createElement()` - Tworzenie elementu DOM komórki
- `setValue(value, animate)` - Ustawianie wartości komórki
- `clear()` - Czyszczenie komórki
- `highlight()` - Podświetlenie jako wygrywająca
- `shake()` - Animacja wstrząsów (błąd)

### ScoreBoard

**Plik:** `src/components/ScoreBoard.js`

**Odpowiedzialność:** Wyświetlanie i aktualizacja wyników

**Główne metody:**
- `init()` - Inicjalizacja
- `update()` - Aktualizacja wyświetlanych wyników
- `highlightWinner(winner)` - Podświetlenie wyniku zwycięzcy
- `highlightDraw()` - Podświetlenie remisu
- `reset()` - Reset wyników

### PlayerPanel

**Plik:** `src/components/PlayerPanel.js`

**Odpowiedzialność:** Wyświetlanie informacji o graczach

**Główne metody:**
- `init()` - Inicjalizacja
- `update()` - Aktualizacja paneli graczy
- `updateActivePlayer()` - Aktualizacja wskaźnika aktywnego gracza
- `showWinner(winner)` - Pokazanie zwycięzcy
- `setPlayerNames(player1Name, player2Name)` - Ustawienie nazw graczy
- `setPlayer2AI(isAI)` - Ustawienie drugiego gracza jako AI

## Komponenty Menu

### MainMenu

**Plik:** `src/components/MainMenu.js`

**Odpowiedzialność:** Główne menu gry

**Główne metody:**
- `init()` - Inicjalizacja
- `show()` - Pokazanie menu
- `hide()` - Ukrycie menu
- `checkContinueButton()` - Sprawdzenie czy przycisk "Kontynuuj" powinien być aktywny

**Zdarzenia:**
- `onNewGame` - Callback dla nowej gry
- `onContinue` - Callback dla kontynuacji
- `onSettings` - Callback dla ustawień
- `onTutorial` - Callback dla tutorialu

### GameModeSelector

**Plik:** `src/components/GameModeSelector.js`

**Odpowiedzialność:** Wybór trybu gry

**Główne metody:**
- `init()` - Inicjalizacja
- `show()` - Pokazanie selektora
- `hide()` - Ukrycie selektora
- `selectMode(mode)` - Wybór trybu

**Zdarzenia:**
- `onModeSelect(mode)` - Callback po wyborze trybu
- `onBack` - Callback powrotu

**Dostępne tryby:**
- `local` - Gracz vs Gracz (lokalnie)
- `ai` - Gracz vs AI
- `online` - Multiplayer Online
- `tournament` - Tryb turniejowy
- `training` - Tryb treningowy

### DifficultySelector

**Plik:** `src/components/DifficultySelector.js`

**Odpowiedzialność:** Wybór poziomu trudności AI

**Główne metody:**
- `init()` - Inicjalizacja
- `show()` - Pokazanie selektora
- `hide()` - Ukrycie selektora
- `selectDifficulty(difficulty)` - Wybór poziomu

**Zdarzenia:**
- `onDifficultySelect(difficulty)` - Callback po wyborze poziomu
- `onBack` - Callback powrotu

**Poziomy trudności:**
- `easy` - Łatwy (losowe ruchy)
- `medium` - Średni (podstawowa strategia)
- `hard` - Trudny (Minimax)
- `expert` - Ekspert (Minimax z Alpha-Beta)
- `impossible` - Niemożliwy (perfekcyjna gra)

### SettingsPanel

**Plik:** `src/components/SettingsPanel.js`

**Odpowiedzialność:** Panel ustawień gry

**Główne metody:**
- `init()` - Inicjalizacja
- `show()` - Pokazanie panelu
- `hide()` - Ukrycie panelu
- `loadSettings()` - Wczytanie aktualnych ustawień
- `changeTheme(theme)` - Zmiana motywu
- `toggleAnimations(enabled)` - Przełączenie animacji
- `resetToDefaults()` - Reset do wartości domyślnych

**Dostępne ustawienia:**
- Motyw (light, dark, neon, retro)
- Rozmiar planszy (3x3, 4x4, 5x5)
- Język (pl, en, de, es)
- Dźwięk (włącz/wyłącz, głośność)
- Animacje (włącz/wyłącz)

### Tutorial

**Plik:** `src/components/Tutorial.js`

**Odpowiedzialność:** Interaktywny tutorial

**Główne metody:**
- `init()` - Inicjalizacja
- `show()` - Pokazanie tutorialu
- `hide()` - Ukrycie tutorialu
- `showStep(stepNumber)` - Pokazanie konkretnego kroku
- `nextStep()` - Następny krok
- `previousStep()` - Poprzedni krok
- `reset()` - Reset do pierwszego kroku

**Nawigacja klawiszowa:**
- `ArrowLeft` - Poprzedni krok
- `ArrowRight` - Następny krok
- `Escape` - Zamknięcie tutorialu

### HelpModal

**Plik:** `src/components/HelpModal.js`

**Odpowiedzialność:** Modal z pomocą i FAQ

**Główne metody:**
- `init()` - Inicjalizacja
- `show()` - Pokazanie modalu
- `hide()` - Ukrycie modalu
- `toggle()` - Przełączenie widoczności
- `addFAQItem(question, answer)` - Dodanie pytania do FAQ
- `updateShortcuts(shortcuts)` - Aktualizacja skrótów klawiszowych

**Skróty klawiszowe:**
- `F1` lub `Shift+?` - Otworzenie pomocy
- `Escape` - Zamknięcie pomocy

## Struktura Komponentu

Każdy komponent powinien implementować następującą strukturę:

```javascript
class ComponentName {
    constructor(dependencies) {
        // Inicjalizacja zależności
        this.dependency = dependency;
        
        // Referencje do elementów DOM
        this.element = document.getElementById('element-id');
        
        // Callbacki
        this.onEvent = null;
    }

    /**
     * Inicjalizacja komponentu
     */
    init() {
        this.attachEventListeners();
        this.render();
    }

    /**
     * Podpięcie event listenerów
     */
    attachEventListeners() {
        // Event listeners
    }

    /**
     * Renderowanie komponentu
     */
    render() {
        // Rendering logic
    }

    /**
     * Pokazanie komponentu
     */
    show() {
        // Show logic
    }

    /**
     * Ukrycie komponentu
     */
    hide() {
        // Hide logic
    }
}
```

## Konwencje Nazewnictwa

- Komponenty - PascalCase: `GameBoard`, `MainMenu`
- Metody - camelCase: `init()`, `showWinner()`
- Prywatne metody - z prefiksem `_`: `_privateMethod()`
- Callbacki - z prefiksem `on`: `onCellClick`, `onModeSelect`
- Stałe - UPPER_SNAKE_CASE: `MAX_BOARD_SIZE`

## Best Practices

1. **Separacja odpowiedzialności** - Każdy komponent powinien mieć jedną, jasno określoną odpowiedzialność
2. **Dependency Injection** - Zależności przekazywane przez konstruktor
3. **Event-driven architecture** - Komunikacja między komponentami przez callbacki
4. **Defensive programming** - Sprawdzanie istnienia elementów DOM przed użyciem
5. **Dokumentacja** - Każda publiczna metoda powinna mieć JSDoc

## Cykl życia komponentu

1. Konstrukcja (`new Component()`)
2. Inicjalizacja (`init()`)
3. Renderowanie (`render()`)
4. Pokazanie (`show()`)
5. Interakcje użytkownika
6. Ukrycie (`hide()`)
7. Opcjonalnie: Zniszczenie (`destroy()`)

## Testowanie

Komponenty powinny być testowalne jednostkowo. Przykład:

```javascript
// Test GameBoard
const mockGameState = new GameState();
const mockAudioManager = new AudioManager();
const mockAnimationEngine = new AnimationEngine();

const gameBoard = new GameBoard(mockGameState, mockAudioManager, mockAnimationEngine);
gameBoard.init();

// Test funkcjonalności
gameBoard.updateCell(0, 0, 'X');
console.assert(gameBoard.getCellElement(0, 0).textContent === 'X');
```
