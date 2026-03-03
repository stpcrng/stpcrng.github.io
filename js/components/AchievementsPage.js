/**
 * @class AchievementsPage
 * @extends Component
 * @description Displays all achievements, locked and unlocked.
 */
class AchievementsPage extends Component {

  /** @param {string} container @param {Store} store */
  constructor(container, store) {
    super(container);
    this._store = store;
  }

  template() {
    const char    = this._store.getCharacter();
    const total   = ACHIEVEMENTS_DATA.length;
    const unlocked = AchievementService.unlockedCount(char);

    return /* html */`
      <div class="page-header">
        <h2 class="page-header__title">Достижения</h2>
        <span style="color:var(--text-2);font-size:14px">${unlocked} из ${total} открыто</span>
      </div>
      <div class="achievements-grid">
        ${ACHIEVEMENTS_DATA.map(a => this.#cardHTML(a, char)).join('')}
      </div>
    `;
  }

  #cardHTML(def, char) {
    const isUnlocked = AchievementService.isUnlocked(char, def.id);
    const isSecret   = def.secret && !isUnlocked;

    return /* html */`
      <article
        class="achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}"
        aria-label="${isSecret ? 'Секретное достижение' : def.name}"
      >
        <span class="achievement-card__icon" role="img">${isSecret ? '🔒' : def.icon}</span>
        <div class="achievement-card__name">${isSecret ? '???' : (isUnlocked && def.revealedName ? def.revealedName : def.name)}</div>
        <p class="achievement-card__desc">${isSecret ? 'Секретное достижение' : (isUnlocked && def.revealedDesc ? def.revealedDesc : def.desc)}</p>
      </article>
    `;
  }
}
