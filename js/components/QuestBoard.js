/**
 * @class QuestBoard
 * @extends Component
 * @description Renders the daily quests grid and handles completion.
 * Emits 'quest:completed' with { habitId } on the root element.
 */
class QuestBoard extends Component {

  /** @param {string} container @param {Store} store */
  constructor(container, store) {
    super(container);
    this._store = store;
  }

  template() {
    const { completedToday } = this._store.getCharacter();

    const cards = HABITS_DATA.map(habit => {
      const done = completedToday.includes(habit.id);
      return this.#cardHTML(habit, done);
    }).join('');

    return /* html */`
      <div class="section-title">⚔️ Ежедневные квесты</div>
      <div class="quests-grid">${cards}</div>
    `;
  }

  #cardHTML(habit, done) {
    return /* html */`
      <article
        class="quest-card ${done ? 'quest-card--completed' : ''}"
        id="quest-card-${habit.id}"
        aria-label="Квест «${habit.name}»"
      >
        <span class="quest-card__icon" role="img" aria-label="${habit.name}">${habit.icon}</span>
        <div class="quest-card__name">${habit.name}</div>
        <p class="quest-card__desc">${habit.desc}</p>
        <div class="quest-card__rewards">
          <span class="reward-tag reward-tag--xp">+${habit.xp} XP</span>
          <span class="reward-tag reward-tag--gold">+${habit.gold} 🪙</span>
        </div>
        <button
          class="btn btn--quest ${done ? 'btn--quest--done' : ''}"
          data-habit="${habit.id}"
          ${done ? 'disabled aria-disabled="true"' : ''}
        >
          ${done ? '✓ ВЫПОЛНЕНО' : '⚔️ ВЫПОЛНИТЬ'}
        </button>
      </article>
    `;
  }

  bindEvents() {
    this.$$('[data-habit]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        this.emit('quest:completed', { habitId: btn.dataset.habit });
      });
    });
  }

  /**
   * Mark a quest card as completed without a full re-render.
   * @param {string} habitId
   */
  markCompleted(habitId) {
    const card = this.$(`#quest-card-${habitId}`);
    const btn  = this.$(`[data-habit="${habitId}"]`);
    if (!card || !btn) return;

    card.classList.add('quest-card--completing');
    setTimeout(() => card.classList.remove('quest-card--completing'), 700);
    setTimeout(() => {
      card.classList.add('quest-card--completed');
      btn.disabled   = true;
      btn.className  = 'btn btn--quest btn--quest--done';
      btn.textContent = '✓ ВЫПОЛНЕНО';
    }, 300);
  }
}
