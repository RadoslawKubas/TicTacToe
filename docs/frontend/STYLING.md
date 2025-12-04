# Przewodnik po Stylach CSS

## Struktura Plików CSS

```
src/styles/
├── main.css           # Główne style
├── responsive.css     # Style responsywne
├── animations.css     # Definicje animacji
└── themes/
    ├── light.css      # Motyw jasny
    ├── dark.css       # Motyw ciemny
    ├── neon.css       # Motyw neonowy
    └── retro.css      # Motyw retro
```

## Zmienne CSS

### Podstawowe zmienne (`:root`)

```css
:root {
    /* Kolory */
    --primary-color: #2196F3;
    --secondary-color: #FF9800;
    --background-color: #f5f5f5;
    --surface-color: #ffffff;
    --text-color: #333333;
    --text-secondary: #666666;
    --border-color: #dddddd;
    
    /* Kolory statusów */
    --success-color: #4CAF50;
    --error-color: #f44336;
    --warning-color: #FF9800;
    
    /* Kolory symboli */
    --x-color: #e91e63;
    --o-color: #2196F3;
    
    /* Odstępy */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* Typografia */
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 20px;
    --font-size-xl: 28px;
    --font-size-xxl: 48px;
    
    /* Zaokrąglenia */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-round: 50%;
    
    /* Cienie */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
    --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.25);
    
    /* Przejścia */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Z-index */
    --z-base: 1;
    --z-dropdown: 100;
    --z-modal: 1000;
    --z-tooltip: 2000;
}
```

## Motywy

### Tworzenie nowego motywu

1. Utwórz plik w `src/styles/themes/nazwamotywu.css`
2. Nadpisz zmienne CSS:

```css
:root {
    --primary-color: #YOUR_COLOR;
    --background-color: #YOUR_COLOR;
    /* ... */
}
```

3. Dodaj specyficzne style motywu:

```css
body {
    background: linear-gradient(135deg, #COLOR1, #COLOR2);
}

.game-board {
    border: 2px solid var(--primary-color);
    box-shadow: 0 0 10px var(--primary-color);
}
```

### Zmiana motywu dynamicznie

```javascript
function changeTheme(themeName) {
    const themeLink = document.getElementById('theme-stylesheet');
    themeLink.href = `styles/themes/${themeName}.css`;
}
```

## Komponenty CSS

### Przyciski

```css
.btn {
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.btn.primary {
    background: var(--primary-color);
    color: white;
}

.btn.secondary {
    background: var(--surface-color);
    color: var(--text-color);
    border: 2px solid var(--border-color);
}
```

### Karty

```css
.card {
    background: var(--surface-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}
```

### Modalne

```css
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
}

.modal-content {
    background: var(--surface-color);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    max-width: 600px;
    width: 90%;
    box-shadow: var(--shadow-xl);
}
```

## Responsive Design

### Breakpointy

```css
/* Mobile first approach */

/* Small phones (up to 480px) */
@media (max-width: 480px) {
    .container {
        padding: var(--spacing-sm);
    }
}

/* Medium phones (481px - 767px) */
@media (min-width: 481px) and (max-width: 767px) {
    /* Styles */
}

/* Tablets (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
    /* Styles */
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) {
    /* Styles */
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
    /* Styles */
}
```

### Touch-friendly

```css
@media (hover: none) and (pointer: coarse) {
    /* Touch device styles */
    .btn {
        min-height: 48px;
        padding: var(--spacing-md) var(--spacing-lg);
    }
}
```

## Grid System

### Plansza gry

```css
.game-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    aspect-ratio: 1;
}

/* Dynamiczny rozmiar */
.game-board[data-size="4"] {
    grid-template-columns: repeat(4, 1fr);
}

.game-board[data-size="5"] {
    grid-template-columns: repeat(5, 1fr);
}
```

### Flexbox Layout

```css
.players-container {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 767px) {
    .players-container {
        flex-direction: column;
    }
}
```

## Utility Classes

### Odstępy

```css
.mt-1 { margin-top: var(--spacing-sm); }
.mt-2 { margin-top: var(--spacing-md); }
.mt-3 { margin-top: var(--spacing-lg); }

.mb-1 { margin-bottom: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }
.mb-3 { margin-bottom: var(--spacing-lg); }

.p-1 { padding: var(--spacing-sm); }
.p-2 { padding: var(--spacing-md); }
.p-3 { padding: var(--spacing-lg); }
```

### Widoczność

```css
.hidden {
    display: none !important;
}

.invisible {
    visibility: hidden;
}

.sr-only {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
```

### Tekst

```css
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-bold { font-weight: bold; }
.text-uppercase { text-transform: uppercase; }
```

## Dostępność (A11y)

### Focus styles

```css
button:focus,
input:focus,
select:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Widoczne tylko przy nawigacji klawiaturą */
button:focus:not(:focus-visible) {
    outline: none;
}

button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}
```

### High contrast mode

```css
@media (prefers-contrast: high) {
    :root {
        --border-color: #000000;
    }
    
    .game-cell {
        border-width: 3px;
    }
}
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Optymalizacja Wydajności

### CSS zawierający

```css
.game-board {
    contain: layout style paint;
}
```

### Will-change

```css
.game-cell {
    will-change: transform, opacity;
}

/* Usuń po zakończeniu animacji */
.game-cell.animating {
    will-change: transform, opacity;
}
```

### Transform zamiast left/top

```css
/* ✗ Wolne */
.element {
    left: 100px;
    top: 100px;
}

/* ✓ Szybkie */
.element {
    transform: translate(100px, 100px);
}
```

## Dark Mode

### Automatyczna detekcja

```css
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #1a1a1a;
        --surface-color: #2a2a2a;
        --text-color: #e0e0e0;
    }
}
```

### Manualne przełączanie

```javascript
document.body.classList.toggle('dark-mode');
```

```css
body.dark-mode {
    --background-color: #1a1a1a;
    --surface-color: #2a2a2a;
    --text-color: #e0e0e0;
}
```

## Best Practices

1. **Używaj zmiennych CSS** dla wartości powtarzających się
2. **Mobile-first approach** - zacznij od małych ekranów
3. **BEM naming convention** (opcjonalnie):
   ```css
   .block__element--modifier {}
   ```
4. **Grupuj powiązane style** razem
5. **Komentuj złożone style**
6. **Unikaj !important** jeśli to możliwe
7. **Testuj na prawdziwych urządzeniach**
8. **Waliduj CSS** z użyciem narzędzi jak stylelint

## Narzędzia

### CSS Reset

Używamy prostego resetu w `main.css`:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### Autoprefixer

Dla produkcji, użyj Autoprefixer do dodania vendor prefixes:

```bash
npm install autoprefixer postcss-cli
postcss src/styles/*.css --use autoprefixer -d dist/styles/
```

### Minifikacja

```bash
npm install cssnano
postcss src/styles/*.css --use cssnano -d dist/styles/
```
