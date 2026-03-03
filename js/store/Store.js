/**
 * @class Store
 * @description Lightweight reactive state container (Observer pattern).
 *
 * Usage:
 *   const store = new Store(character, StorageService);
 *   const unsub = store.subscribe(char => console.log(char));
 *   store.update(char => { char.gold += 10; });
 *   unsub();
 */
class Store {

  /** @type {Character} */
  #character;

  /** @type {Function[]} */
  #listeners = [];

  /** @type {typeof StorageService} */
  #storageService;

  /**
   * @param {Character}           character
   * @param {typeof StorageService} storageService
   */
  constructor(character, storageService) {
    this.#character      = character;
    this.#storageService = storageService;
  }

  // ─── Read ────────────────────────────────────────────

  /**
   * Returns the current character.
   * Components should treat this as read-only outside of `update()`.
   * @returns {Character}
   */
  getCharacter() {
    return this.#character;
  }

  // ─── Write ───────────────────────────────────────────

  /**
   * Mutate the character inside the provided callback, then persist and notify.
   *
   * @param {function(Character): void} mutator
   */
  update(mutator) {
    mutator(this.#character);
    this.#persist();
    this.#notify();
  }

  // ─── Subscriptions ───────────────────────────────────

  /**
   * Register a listener called with the character on every update.
   * @param {function(Character): void} listener
   * @returns {function} Unsubscribe function
   */
  subscribe(listener) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter(l => l !== listener);
    };
  }

  // ─── Private ─────────────────────────────────────────

  #persist() {
    this.#storageService.save(this.#character);
  }

  #notify() {
    const char = this.#character;
    for (const listener of this.#listeners) {
      listener(char);
    }
  }
}
