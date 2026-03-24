class Store {
  #character;
  #listeners = [];
  #storageService;

  constructor(character, storageService) {
    this.#character = character;
    this.#storageService = storageService;
  }

  getCharacter() {
    return this.#character;
  }

  update(mutator) {
    mutator(this.#character);
    this.#persist();
    this.#notify();
  }

  touch() {
    this.#persist();
    this.#notify();
  }

  subscribe(listener) {
    this.#listeners.push(listener);

    return () => {
      this.#listeners = this.#listeners.filter(l => l !== listener);
    };
  }

  #persist() {
    this.#storageService.save(this.#character);
  }

  #notify() {
    const character = this.#character;
    for (const listener of this.#listeners) {
      listener(character);
    }
  }
}
