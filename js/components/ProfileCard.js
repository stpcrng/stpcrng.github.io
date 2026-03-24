
class ProfileCard extends Component {

  constructor(container, store) {
    super(container);
    this._store = store;
  }

  template() {
    const char  = this._store.getCharacter();
    const xpPct = XPService.progressPercent(char.xp);
    const xpLbl = XPService.progressLabel(char.xp);

    return `
      <div class="profile-card">
        <div class="profile-card__avatar" aria-label="Аватар персонажа">
          ${char.avatarEmoji}
        </div>
        <div class="profile-card__info">
          <div class="profile-card__name">${this.#escape(char.name)}</div>
          <div class="profile-card__level">⬡ Уровень ${char.level} ${char.className}</div>
          <div class="xp-bar" title="${xpLbl}">
            <div
              class="xp-bar__fill"
              id="xp-bar-fill"
              style="width: ${xpPct}%"
              role="progressbar"
              aria-valuenow="${xpPct}"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="xp-bar__text">${xpLbl}</div>
        </div>
        <div class="profile-card__stats">
          <div class="stat-badge stat-badge--gold" title="Золото">
            <span class="stat-badge__icon">🪙</span>
            <span id="stat-gold">${char.gold}</span>
          </div>
          <div class="stat-badge stat-badge--streak" title="Текущая серия">
            <span class="stat-badge__icon">🔥</span>
            <span id="stat-streak">${char.streak}</span>&nbsp;дн.
          </div>
        </div>
      </div>
    `;
  }

  onMount() {
    const fill = this.$('#xp-bar-fill');
    if (fill) {
      const target = fill.style.width;
      fill.style.width = '0%';
      requestAnimationFrame(() => {
        fill.style.width = target;
      });
    }
  }

  #escape(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
}
