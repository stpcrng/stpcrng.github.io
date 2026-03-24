
class Confetti {

  static #COLORS  = ['#a855f7','#c084fc','#fbbf24','#60a5fa','#34d399','#f87171','#fb923c'];
  static #COUNT   = 70;
  static #container = null;

  static #getContainer() {
    if (!this.#container) {
      this.#container = document.createElement('div');
      this.#container.className = 'confetti-container';
      document.body.appendChild(this.#container);
    }
    return this.#container;
  }

  static launch(count = this.#COUNT) {
    const container = this.#getContainer();

    for (let i = 0; i < count; i++) {
      const piece = this.#createPiece();
      container.appendChild(piece);

      const duration = parseFloat(piece.style.animationDuration) * 1000;
      const delay    = parseFloat(piece.style.animationDelay) * 1000;
      setTimeout(() => piece.remove(), duration + delay + 200);
    }
  }

  static #createPiece() {
    const el = document.createElement('div');
    el.className = 'confetti-piece';

    const size     = 6 + Math.random() * 7;
    const duration = 1.6 + Math.random() * 2;
    const delay    = Math.random() * 0.6;

    el.style.cssText = [
      `left: ${Math.random() * 100}vw`,
      `width: ${size}px`,
      `height: ${size}px`,
      `background: ${this.#COLORS[Math.floor(Math.random() * this.#COLORS.length)]}`,
      `animation-duration: ${duration}s`,
      `animation-delay: ${delay}s`,
      `transform: rotate(${Math.random() * 360}deg)`,
      `border-radius: ${Math.random() > 0.5 ? '50%' : '2px'}`,
    ].join(';');

    return el;
  }
}
