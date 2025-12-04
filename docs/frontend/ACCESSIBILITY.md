# Wytyczne Dostępności (Accessibility - A11y)

## Przegląd

Aplikacja TicTacToe została zaprojektowana z myślą o dostępności dla wszystkich użytkowników, w tym osób z niepełnosprawnościami.

## AccessibilityManager

**Plik:** `src/utils/AccessibilityManager.js`

### Funkcje

#### Nawigacja klawiaturą

Aplikacja w pełni obsługuje nawigację klawiaturą:

- `Tab` / `Shift+Tab` - Nawigacja między elementami
- `Enter` / `Space` - Aktywacja elementów
- `Escape` - Zamknięcie modali
- `Arrow keys` - Nawigacja po planszy gry
- `1-9` - Wybór pola na planszy 3x3
- `R` - Restart gry
- `U` - Cofnij ruch
- `H` - Podpowiedź
- `F1` - Pomoc

#### Screen Reader Support

```javascript
// Ogłoszenie dla czytników ekranu
accessibilityManager.announce('Gracz X wykonał ruch');
accessibilityManager.announce('Wygrana! Gracz X wygrał!', 'assertive');
```

**Poziomy priorytetu:**
- `polite` - Ogłoszenie gdy czytnik jest gotowy
- `assertive` - Natychmiastowe ogłoszenie

#### Focus Management

```javascript
// Automatyczne zarządzanie focus
accessibilityManager.trapFocus(modalElement);
```

## ARIA Atrybuty

### ARIA Labels

Wszystkie interaktywne elementy mają odpowiednie etykiety:

```html
<button aria-label="Nowa gra">
    <span class="icon">🎮</span>
</button>

<div class="game-cell" 
     role="button" 
     aria-label="Pole 1, puste"
     tabindex="0">
</div>
```

### ARIA Live Regions

```html
<div id="screen-reader-announcer" 
     aria-live="polite" 
     aria-atomic="true" 
     class="sr-only">
    <!-- Dynamiczne ogłoszenia -->
</div>
```

### ARIA States

```html
<button aria-pressed="true">Dźwięk</button>
<button aria-expanded="false" aria-controls="menu">Menu</button>
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Wynik gry</h2>
</div>
```

## Nawigacja Klawiaturą

### Focus Indicators

```css
/* Wyraźne wskaźniki focus */
button:focus,
input:focus,
select:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Focus tylko przy nawigacji klawiaturą */
button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

button:focus:not(:focus-visible) {
    outline: none;
}
```

### Tab Order

```html
<!-- Logiczna kolejność tabulacji -->
<button tabindex="0">Pierwszy</button>
<button tabindex="0">Drugi</button>
<button tabindex="-1">Pominięty</button>

<!-- Plansza gry -->
<div class="game-board">
    <div class="game-cell" tabindex="0" data-row="0" data-col="0"></div>
    <div class="game-cell" tabindex="0" data-row="0" data-col="1"></div>
    <!-- ... -->
</div>
```

### Skip Links

```html
<a href="#main-content" class="skip-link">
    Przejdź do głównej treści
</a>

<main id="main-content">
    <!-- Główna treść -->
</main>
```

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
```

## Semantic HTML

### Poprawna struktura

```html
<!-- ✓ Dobry przykład -->
<header>
    <h1>TicTacToe</h1>
    <nav>
        <ul>
            <li><a href="#game">Gra</a></li>
            <li><a href="#settings">Ustawienia</a></li>
        </ul>
    </nav>
</header>

<main>
    <section aria-labelledby="game-title">
        <h2 id="game-title">Gra</h2>
        <!-- Zawartość gry -->
    </section>
</main>

<footer>
    <p>&copy; 2024 TicTacToe</p>
</footer>
```

### Role Landmarks

```html
<div role="main">Główna treść</div>
<div role="navigation">Menu</div>
<div role="complementary">Dodatkowe informacje</div>
<div role="contentinfo">Stopka</div>
```

## Kontrast Kolorów

### WCAG 2.1 Guidelines

- **Poziom AA:** Kontrast 4.5:1 dla normalnego tekstu
- **Poziom AA:** Kontrast 3:1 dla dużego tekstu (18pt+)
- **Poziom AAA:** Kontrast 7:1 dla normalnego tekstu

### Sprawdzanie kontrastu

```javascript
// Funkcja do obliczania kontrastu
function getContrastRatio(color1, color2) {
    const l1 = getRelativeLuminance(color1);
    const l2 = getRelativeLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

// Sprawdź kontrast
const ratio = getContrastRatio('#2196F3', '#FFFFFF');
console.log(`Kontrast: ${ratio.toFixed(2)}:1`);
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
    :root {
        --primary-color: #0000FF;
        --background-color: #FFFFFF;
        --text-color: #000000;
        --border-color: #000000;
    }
    
    .game-cell {
        border: 3px solid #000000;
    }
    
    button {
        border: 2px solid #000000;
    }
}
```

## Preferencje Użytkownika

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

```javascript
// JavaScript check
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
    // Wyłącz lub uprość animacje
    animationEngine.stop();
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #1a1a1a;
        --surface-color: #2a2a2a;
        --text-color: #e0e0e0;
    }
}
```

### Font Size

```javascript
// Respektowanie ustawień rozmiaru czcionki
html {
    font-size: 100%; // Nie używaj px dla font-size
}

.text {
    font-size: 1rem; // Używaj rem
}
```

## Formularze

### Etykiety

```html
<!-- ✓ Dobry przykład -->
<label for="player-name">Nazwa gracza:</label>
<input type="text" id="player-name" name="playerName">

<!-- ✓ Alternatywnie -->
<label>
    Nazwa gracza:
    <input type="text" name="playerName">
</label>

<!-- ✗ Zły przykład -->
<input type="text" placeholder="Nazwa gracza">
```

### Walidacja

```html
<input 
    type="text" 
    id="username"
    required
    aria-required="true"
    aria-invalid="false"
    aria-describedby="username-error">

<span id="username-error" role="alert" class="hidden">
    Nazwa użytkownika jest wymagana
</span>
```

```javascript
// Pokaż błąd
input.setAttribute('aria-invalid', 'true');
errorSpan.classList.remove('hidden');

// Ukryj błąd
input.setAttribute('aria-invalid', 'false');
errorSpan.classList.add('hidden');
```

## Modalne i Dialogi

### Struktura

```html
<div 
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="dialog-title"
    aria-describedby="dialog-desc">
    
    <h2 id="dialog-title">Wynik gry</h2>
    <p id="dialog-desc">Gracz X wygrał!</p>
    
    <button>OK</button>
    <button>Anuluj</button>
</div>
```

### Focus Trap

```javascript
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    firstElement.focus();
}
```

## Obrazy i Multimedia

### Alt Text

```html
<!-- Obrazy informacyjne -->
<img src="tutorial.png" alt="Tutorial gry TicTacToe pokazujący jak grać">

<!-- Obrazy dekoracyjne -->
<img src="decoration.png" alt="" role="presentation">

<!-- Ikony z tekstem -->
<button>
    <img src="settings.svg" alt="">
    Ustawienia
</button>
```

### Video i Audio

```html
<video controls>
    <source src="tutorial.mp4" type="video/mp4">
    <track kind="captions" src="captions.vtt" srclang="pl" label="Polski">
    Twoja przeglądarka nie obsługuje wideo.
</video>
```

## Testowanie Dostępności

### Automated Testing

```javascript
// axe-core
import axe from 'axe-core';

axe.run().then(results => {
    if (results.violations.length) {
        console.error('Znaleziono problemy z dostępnością:', results.violations);
    }
});
```

### Manual Testing

1. **Nawigacja klawiaturą** - Sprawdź czy można wszystko osiągnąć bez myszy
2. **Screen reader** - Przetestuj z NVDA/JAWS (Windows) lub VoiceOver (macOS)
3. **Zoom** - Sprawdź przy powiększeniu 200%
4. **Kontrast** - Użyj narzędzi jak Contrast Checker
5. **Różne urządzenia** - Przetestuj na mobilnych i desktop

### Checklist

- [ ] Wszystkie interaktywne elementy dostępne z klawiatury
- [ ] Wyraźne wskaźniki focus
- [ ] Sensowna kolejność tabulacji
- [ ] ARIA labels dla wszystkich elementów
- [ ] Kontrast kolorów zgodny z WCAG AA
- [ ] Semantyczny HTML
- [ ] Alt text dla obrazów
- [ ] Obsługa screen readerów
- [ ] Respektowanie preferencji użytkownika
- [ ] Focus trap w modalach
- [ ] Skip links
- [ ] Brak polegania tylko na kolorze
- [ ] Responsywność i zoom

## Zasoby

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [a11y Project](https://www.a11yproject.com/)
