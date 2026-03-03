/**
 * @class StorageService
 * @description Thin wrapper around localStorage.
 * All persistence goes through here — a single place to swap storage backends.
 */
class StorageService {

  static #KEY = 'habithero_v2';

  /**
   * Persist a Character instance.
   * @param {Character} character
   */
  static save(character) {
    try {
      localStorage.setItem(this.#KEY, JSON.stringify(character.toJSON()));
    } catch (err) {
      console.warn('[StorageService] Failed to save:', err);
    }
  }

  /**
   * Load and deserialise the stored character.
   * @returns {Character|null} null if nothing stored yet
   */
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

  /**
   * Wipe all stored data for this app.
   */
  static clear() {
    try {
      localStorage.removeItem(this.#KEY);
    } catch (err) {
      console.warn('[StorageService] Failed to clear:', err);
    }
  }

  /**
   * Check whether persisted data exists.
   * @returns {boolean}
   */
  static hasData() {
    return Boolean(localStorage.getItem(this.#KEY));
  }
}
