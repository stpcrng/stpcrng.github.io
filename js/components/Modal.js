
class Modal {

  static #overlay   = null;
  static #queue     = [];
  static #isShowing = false;

  static init() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.#html();
    document.body.appendChild(wrapper.firstElementChild);

    this.#overlay = document.getElementById('modal-overlay');

    this.#overlay.addEventListener('click', e => {
      if (e.target === this.#overlay) this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.#isShowing) this.close();
    });

    this.#overlay.addEventListener('click', e => {
      if (e.target.closest('[data-modal-close]')) this.close();
    });
  }

  static showLevelUp(level) {
    this.#enqueue(() => {
      document.getElementById('modal-icon').textContent   = '⚔️';
      document.getElementById('modal-title').textContent  = 'НОВЫЙ УРОВЕНЬ!';
      document.getElementById('modal-level').textContent  = level;
      document.getElementById('modal-level').style.display = 'block';
      document.getElementById('modal-subtitle').textContent = 'Ты стал сильнее, герой!';
      document.getElementById('modal-bonus').style.display  = 'flex';
      document.getElementById('modal-ach-name').style.display = 'none';
      this.#show();
    });
  }

  static showAchievement(def) {
    this.#enqueue(() => {
      const isSecret = def.secret;
      document.getElementById('modal-icon').textContent  = isSecret ? '🌌' : def.icon;
      document.getElementById('modal-title').textContent = 'Достижение открыто!';
      document.getElementById('modal-level').style.display = 'none';
      document.getElementById('modal-bonus').style.display  = 'none';
      document.getElementById('modal-subtitle').textContent = def.revealedDesc ?? def.desc;

      const nameEl = document.getElementById('modal-ach-name');
      nameEl.textContent   = def.revealedName ?? def.name;
      nameEl.style.display = 'block';

      this.#show();
    });
  }

  static close() {
    this.#overlay.classList.remove('modal-overlay--visible');
    this.#isShowing = false;
    setTimeout(() => this.#processQueue(), 350);
  }

  static #enqueue(fn) {
    this.#queue.push(fn);
    if (!this.#isShowing) this.#processQueue();
  }

  static #processQueue() {
    if (this.#queue.length === 0) return;
    const fn = this.#queue.shift();
    fn();
  }

  static #show() {
    this.#isShowing = true;
    this.#overlay.classList.add('modal-overlay--visible');
  }

  static #html() {
    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal">
          <div class="modal__icon" id="modal-icon">⚔️</div>
          <h2 class="modal__title" id="modal-title">НОВЫЙ УРОВЕНЬ!</h2>
          <div class="modal__level-number" id="modal-level">2</div>
          <div class="modal__ach-name" id="modal-ach-name" style="display:none"></div>
          <p class="modal__subtitle" id="modal-subtitle"></p>
          <div class="modal__bonus" id="modal-bonus">🪙 +50 золота</div>
          <button class="btn btn--close" data-modal-close>ПРОДОЛЖИТЬ →</button>
        </div>
      </div>
    `;
  }
}
