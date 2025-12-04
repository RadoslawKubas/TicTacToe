# Dokumentacja Systemu Animacji

## Przegląd

System animacji TicTacToe składa się z kilku modułów odpowiedzialnych za różne aspekty animacji w grze.

## AnimationEngine

**Plik:** `src/animations/AnimationEngine.js`

### Opis

AnimationEngine jest głównym silnikiem animacji wykorzystującym `requestAnimationFrame` do płynnych animacji.

### Funkcje easing

Dostępne funkcje wygładzania (easing):

- `linear` - Liniowa
- `easeIn` - Przyspieszenie na początku
- `easeOut` - Zwolnienie na końcu
- `easeInOut` - Przyspieszenie i zwolnienie
- `easeInCubic` - Sześcienna przyspieszenie
- `easeOutCubic` - Sześcienna zwolnienie
- `easeInOutCubic` - Sześcienna obustronna
- `easeInQuart`, `easeOutQuart`, `easeInOutQuart` - Czwarta potęga
- `easeInQuint`, `easeOutQuint`, `easeInOutQuint` - Piąta potęga
- `elasticOut` - Elastyczne odbicie
- `bounceOut` - Odbijanie się

### Główne metody

#### `start()`
Uruchamia pętlę animacji.

#### `stop()`
Zatrzymuje pętlę animacji.

#### `add(animation)`
Dodaje nową animację do kolejki.

**Parametry animacji:**
```javascript
{
    duration: 300,        // Czas trwania w ms
    easing: 'easeInOut', // Funkcja easing
    onUpdate: (progress) => {
        // Kod wykonywany w każdej klatce
        // progress: 0-1
    },
    onComplete: () => {
        // Kod wykonywany po zakończeniu
    }
}
```

**Przykład:**
```javascript
const engine = new AnimationEngine();
engine.add({
    duration: 500,
    easing: 'easeOutCubic',
    onUpdate: (progress) => {
        element.style.opacity = progress;
    },
    onComplete: () => {
        console.log('Animacja zakończona');
    }
});
```

#### `fadeIn(element, duration)`
Animacja fade-in elementu.

#### `fadeOut(element, duration)`
Animacja fade-out elementu.

#### `slideIn(element, direction, duration)`
Animacja wsunięcia z kierunku ('left', 'right', 'top', 'bottom').

#### `animateElement(element, properties, duration, easing)`
Uniwersalna metoda animacji właściwości CSS.

## SymbolAnimations

**Plik:** `src/animations/SymbolAnimations.js`

### Opis

Zarządza animacjami symboli X i O na planszy.

### Metody

#### `drawX(cell, onComplete)`
Animuje rysowanie symbolu X w komórce.

#### `drawO(cell, onComplete)`
Animuje rysowanie symbolu O w komórce.

#### `pulseWinning(cell)`
Animacja pulsowania dla wygrywającego symbolu.

#### `fadeOut(cell)`
Zanikanie symbolu.

**Przykład:**
```javascript
const symbolAnims = new SymbolAnimations(animationEngine);
symbolAnims.drawX(cellElement, () => {
    console.log('Symbol X narysowany');
});
```

## BoardAnimations

**Plik:** `src/animations/BoardAnimations.js`

### Opis

Zarządza animacjami planszy gry.

### Metody

#### `entrance(board)`
Animacja wejścia planszy - komórki pojawiają się sekwencyjnie.

**Przykład:**
```javascript
const boardAnims = new BoardAnimations(animationEngine);
boardAnims.entrance(boardElement);
```

#### `highlightWinningLine(winningLine, board)`
Podświetla wygrywającą linię z animacją.

**Parametry:**
- `winningLine` - Tablica współrzędnych `[[row, col], ...]`
- `board` - Element DOM planszy

#### `shake(board)`
Animacja wstrząsów planszy (np. przy błędzie).

#### `reset(board)`
Animacja resetowania planszy.

## ParticleEffects

**Plik:** `src/animations/ParticleEffects.js`

### Opis

System cząsteczek dla efektów wizualnych jak konfetti czy iskry.

### Metody

#### `init()`
Inicjalizuje system cząsteczek i canvas.

#### `createConfetti(x, y)`
Tworzy efekt konfetti w pozycji (x, y).

**Przykład:**
```javascript
const particles = new ParticleEffects();
particles.init();
particles.createConfetti(250, 250);
```

#### `createSparkles(x, y)`
Tworzy efekt iskier w pozycji (x, y).

#### `clear()`
Usuwa wszystkie cząsteczki.

### Struktura cząsteczki

```javascript
{
    x: 100,           // Pozycja X
    y: 100,           // Pozycja Y
    vx: 5,            // Prędkość X
    vy: -10,          // Prędkość Y
    color: '#ff6b6b', // Kolor
    size: 5,          // Rozmiar
    life: 1.0,        // Żywotność (0-1)
    decay: 0.02       // Szybkość zanikania
}
```

## Klasy CSS Animacji

### Podstawowe animacje

Dostępne w `styles/animations.css`:

- `.animate-fadeIn` - Płynne pojawianie się
- `.animate-fadeOut` - Płynne zanikanie
- `.animate-slideInLeft` - Wsunięcie z lewej
- `.animate-slideInRight` - Wsunięcie z prawej
- `.animate-slideOutLeft` - Wysunięcie w lewo
- `.animate-slideOutRight` - Wysunięcie w prawo
- `.animate-scaleIn` - Powiększenie
- `.animate-scaleOut` - Pomniejszenie
- `.animate-pulse` - Pulsowanie
- `.animate-bounce` - Odbijanie
- `.animate-shake` - Trzęsienie
- `.animate-spin` - Obracanie
- `.animate-wiggle` - Kiwanie
- `.animate-flash` - Miganie
- `.animate-glow` - Świecenie

### Użycie

```javascript
element.classList.add('animate-fadeIn');
setTimeout(() => {
    element.classList.remove('animate-fadeIn');
}, 300);
```

## Optymalizacja Wydajności

### Best Practices

1. **Używaj transform zamiast left/top**
```javascript
// ✗ Wolne
element.style.left = x + 'px';

// ✓ Szybkie
element.style.transform = `translateX(${x}px)`;
```

2. **Używaj requestAnimationFrame**
```javascript
// ✗ Wolne
setInterval(() => animate(), 16);

// ✓ Szybkie
requestAnimationFrame(() => animate());
```

3. **Batching DOM updates**
```javascript
// ✗ Wolne - wiele reflows
cells.forEach(cell => {
    cell.style.opacity = '0';
});

// ✓ Szybkie - jeden reflow
requestAnimationFrame(() => {
    cells.forEach(cell => {
        cell.style.opacity = '0';
    });
});
```

4. **Używaj will-change dla często animowanych elementów**
```css
.game-cell {
    will-change: transform, opacity;
}
```

5. **Limit liczby jednoczesnych animacji**
```javascript
const MAX_CONCURRENT_ANIMATIONS = 10;
if (animations.length < MAX_CONCURRENT_ANIMATIONS) {
    animationEngine.add(newAnimation);
}
```

## Accessible Animations

### Respektowanie preferencji użytkownika

```javascript
// Sprawdzenie preferencji reduced motion
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
    // Wyłącz lub uprość animacje
    element.style.transition = 'none';
}
```

### CSS dla reduced motion

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Timing i Synchronizacja

### Sekwencyjne animacje

```javascript
function animateSequence() {
    animationEngine.add({
        duration: 300,
        onUpdate: (p) => { /* Animacja 1 */ },
        onComplete: () => {
            animationEngine.add({
                duration: 300,
                onUpdate: (p) => { /* Animacja 2 */ }
            });
        }
    });
}
```

### Równoległe animacje

```javascript
function animateParallel() {
    elements.forEach((el, i) => {
        animationEngine.add({
            duration: 300,
            onUpdate: (p) => {
                el.style.opacity = p;
            }
        });
    });
}
```

### Staggered animations

```javascript
function animateStaggered() {
    elements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('animate-fadeIn');
        }, i * 100); // 100ms opóźnienie między elementami
    });
}
```

## Debugowanie Animacji

### Performance monitoring

```javascript
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
    const now = performance.now();
    frameCount++;
    
    if (now >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastTime = now;
    }
    
    requestAnimationFrame(measureFPS);
}

measureFPS();
```

### Chrome DevTools

1. Performance tab - nagrywanie animacji
2. Rendering tab - "Paint flashing" i "FPS meter"
3. Layers tab - analiza kompozycji warstw

## Przykładowe Scenariusze

### Animacja wygranej

```javascript
function animateWin(winningLine) {
    // 1. Podświetl wygrywającą linię
    boardAnimations.highlightWinningLine(winningLine, board);
    
    // 2. Konfetti
    particleEffects.createConfetti(centerX, centerY);
    
    // 3. Pulse wygrywających symboli
    winningLine.forEach(([row, col]) => {
        const cell = getCellElement(row, col);
        symbolAnimations.pulseWinning(cell);
    });
}
```

### Animacja resetu

```javascript
function animateReset() {
    boardAnimations.reset(board);
    particleEffects.clear();
    
    setTimeout(() => {
        boardAnimations.entrance(board);
    }, 500);
}
```
