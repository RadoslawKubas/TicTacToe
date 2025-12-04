/**
 * Helpers - Funkcje pomocnicze
 */

/**
 * Generuje losowy identyfikator
 */
function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Opóźnienie (dla async/await)
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Głęboka kopia obiektu
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sprawdza czy wartość jest pusta
 */
function isEmpty(value) {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Formatuje czas w ms do czytelnego formatu
 */
function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

/**
 * Losuje element z tablicy
 */
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Miesza tablicę (Fisher-Yates shuffle)
 */
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

module.exports = {
  generateId,
  delay,
  deepClone,
  isEmpty,
  formatTime,
  randomElement,
  shuffle
};
