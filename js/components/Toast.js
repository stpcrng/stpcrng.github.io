/**
 * @class Toast
 * @description Singleton toast notification manager.
 * Creates a fixed overlay container and queues notifications.
 *
 * Usage:
 *   Toast.show('You did it! +20 XP', 'xp');
 */
class Toast {

  static #container = null;
  static #DURATION  = 2800;

  /** Lazily create the container once. */
  static #getContainer() {
    if (!this.#container) {
      this.#container = document.createElement('div');
      this.#container.className = 'toast-container';
      document.body.appendChild(this.#container);
    }
    return this.#container;
  }

  /**
   * Show a toast message.
   * @param {string} message
   * @param {'xp'|'gold'|'ach'|'err'|''} type
   * @param {number} [delay=0] ms before showing (for sequential toasts)
   */
  static show(message, type = '', delay = 0) {
    setTimeout(() => this.#create(message, type), delay);
  }

  static #create(message, type) {
    const container = this.#getContainer();

    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = message;

    container.appendChild(el);

    // Auto-dismiss
    const timer = setTimeout(() => this.#dismiss(el), this.#DURATION);

    el.addEventListener('click', () => {
      clearTimeout(timer);
      this.#dismiss(el);
    });
  }

  static #dismiss(el) {
    el.classList.add('toast--out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}
