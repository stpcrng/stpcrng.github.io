
class StorageService {

  static #KEY = 'habithero_v2';

  static save(character) {
    try {
      localStorage.setItem(this.#KEY, JSON.stringify(character.toJSON()));
    } catch (err) {
      console.warn('[StorageService] Failed to save:', err);
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(this.#KEY);
      if (!raw) return null;
      return Character.fromJSON(JSON.parse(raw));
    } catch (err) {
      console.warn('[StorageService] Failed to load:', err);
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(this.#KEY);
    } catch (err) {
      console.warn('[StorageService] Failed to clear:', err);
    }
  }

  static hasData() {
    return Boolean(localStorage.getItem(this.#KEY));
  }
}
