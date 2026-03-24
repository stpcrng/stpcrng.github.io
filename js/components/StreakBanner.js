
class StreakBanner extends Component {

  constructor(container, store) {
    super(container);
    this._store = store;
  }

  template() {
    const { streak } = this._store.getCharacter();

    const label = streak > 0
      ? `Так держать! Ты на подъеме! 🔥`
      : 'Выполни квест, чтобы начать серию!';

    return `
      <div class="streak-banner">
        <span class="streak-banner__fire">🔥</span>
        <div class="streak-banner__body">
          <div class="streak-banner__count">Серия: ${streak} дн.</div>
          <div class="streak-banner__label">${label}</div>
          <div class="streak-milestones">
            ${this.#milestone('🔥 3 дня',  streak >= 3)}
            ${this.#milestone('⚡ 7 дней',  streak >= 7)}
            ${this.#milestone('👑 30 дней', streak >= 30)}
          </div>
        </div>
      </div>
    `;
  }

  #milestone(text, reached) {
    return `<span class="milestone ${reached ? 'milestone--reached' : ''}">${text}</span>`;
  }
}
