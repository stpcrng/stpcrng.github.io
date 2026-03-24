
class CharacterCreation extends Component {

  #selectedAvatar = 'warrior';

  constructor(container) {
    super(container);
  }

  template() {
    return `
      <div class="create-box anim-fade-in">
        <h1 class="create-box__title">HabitHero</h1>
        <p class="create-box__subtitle">⚔️ Начни свою легенду ⚔️</p>

        <div class="form-group">
          <label class="form-group__label" for="hero-name-input">Имя героя</label>
          <input
            class="form-group__input"
            id="hero-name-input"
            type="text"
            placeholder="Введите имя..."
            maxlength="20"
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label class="form-group__label">Выберите класс</label>
          <div class="avatar-grid" id="avatar-grid">
            ${this.#avatarOptions()}
          </div>
        </div>

        <button class="btn btn--primary" id="btn-start">
          ⚔️ НАЧАТЬ ПУТЬ
        </button>
      </div>
    `;
  }

  #avatarOptions() {
    const options = [
      { id: 'warrior', emoji: '⚔️', label: 'Воин'        },
      { id: 'mage',    emoji: '🧙', label: 'Маг'         },
      { id: 'ninja',   emoji: '🥷', label: 'Ниндзя'      },
      { id: 'dev',     emoji: '💻', label: 'Разработчик' },
    ];

    return options.map(o => `
      <div
        class="avatar-option ${o.id === this.#selectedAvatar ? 'avatar-option--selected' : ''}"
        data-avatar="${o.id}"
        role="button"
        tabindex="0"
        aria-label="Класс ${o.label}"
      >
        <span class="avatar-option__emoji">${o.emoji}</span>
        <span class="avatar-option__label">${o.label}</span>
      </div>
    `).join('');
  }

  bindEvents() {
    this.$$('[data-avatar]').forEach(el => {
      el.addEventListener('click', () => this.#selectAvatar(el.dataset.avatar));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') this.#selectAvatar(el.dataset.avatar);
      });
    });

    const btn = this.$('#btn-start');
    if (btn) btn.addEventListener('click', () => this.#handleSubmit());

    const input = this.$('#hero-name-input');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.#handleSubmit();
      });
      setTimeout(() => input.focus(), 100);
    }
  }

  #selectAvatar(id) {
    this.#selectedAvatar = id;
    this.$$('[data-avatar]').forEach(el => {
      el.classList.toggle('avatar-option--selected', el.dataset.avatar === id);
    });
  }

  #handleSubmit() {
    const input = this.$('#hero-name-input');
    const name  = input?.value.trim();

    if (!name) {
      Toast.show('⚠️ Введите имя героя!', 'err');
      input?.focus();
      return;
    }

    this.emit('character:created', { name, avatar: this.#selectedAvatar });
  }
}
