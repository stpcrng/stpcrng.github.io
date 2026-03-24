class QuestBoard extends Component {
  #editingHabitId = null;

  constructor(container, store) {
    super(container);
    this._store = store;
  }

  template() {
    const character = this._store.getCharacter();
    const customHabits = character.customHabits || [];

    const defaultCards = HABITS_DATA.map(habit => this.#cardHTML(habit, character, false)).join('');
    const customCards = customHabits.length
      ? customHabits.map(habit => this.#cardHTML(habit, character, true)).join('')
      : '<p class="quest-board__empty">Пока нет пользовательских привычек. Добавь первую ниже 👇</p>';

    return `
      <section class="quest-board">
        <div class="quest-board__head">
          <div class="section-title">⚔️ Ежедневные квесты</div>
          <span class="quest-board__counter">Выполнено сегодня: ${character.completedToday.length}</span>
        </div>

        <div class="quest-board__add-title">➕ Добавь свою привычку</div>
        ${this.#habitForm(character)}

        <div class="quests-grid">${defaultCards}</div>

        <div class="quest-board__head quest-board__head--custom">
          <div class="section-title">🛠️ Мои привычки</div>
        </div>
        <div class="quests-grid quests-grid--custom">${customCards}</div>
      </section>
    `;
  }

  #habitForm(character) {
    const editing = (character.customHabits || []).find(habit => habit.id === this.#editingHabitId);

    return `
      <form class="habit-form" id="habit-form">
        <h3 class="habit-form__title">${editing ? 'Редактирование привычки' : 'Создать свою привычку'}</h3>
        <div class="habit-form__grid">
          <label class="habit-form__field">
            <span>Название</span>
            <input type="text" name="name" maxlength="40" required value="${editing ? this.#escape(editing.name) : ''}" />
          </label>

          <label class="habit-form__field">
            <span>Иконка (emoji)</span>
            <input type="text" name="icon" maxlength="3" required value="${editing ? this.#escape(editing.icon) : '✨'}" />
          </label>

          <label class="habit-form__field">
            <span>XP</span>
            <input type="number" name="xp" min="1" max="500" required value="${editing ? editing.xp : 20}" />
          </label>

          <label class="habit-form__field">
            <span>Золото</span>
            <input type="number" name="gold" min="0" max="500" required value="${editing ? editing.gold : 10}" />
          </label>

          <label class="habit-form__field habit-form__field--wide">
            <span>Описание</span>
            <textarea name="desc" maxlength="140" rows="2" required>${editing ? this.#escape(editing.desc) : ''}</textarea>
          </label>
        </div>

        <div class="habit-form__actions">
          <button class="btn btn--primary" type="submit">
            ${editing ? '💾 СОХРАНИТЬ ИЗМЕНЕНИЯ' : '➕ ДОБАВИТЬ ПРИВЫЧКУ'}
          </button>
          ${editing ? '<button class="btn btn--ghost" type="button" id="habit-cancel-edit">Отменить редактирование</button>' : ''}
        </div>
      </form>
    `;
  }

  #cardHTML(habit, character, isCustom) {
    const done = character.completedToday.includes(habit.id);
    return `
      <article class="quest-card ${done ? 'quest-card--completed' : ''}" id="quest-card-${habit.id}" aria-label="Квест «${habit.name}»">
        <span class="quest-card__icon" role="img" aria-label="${habit.name}">${habit.icon}</span>
        <div class="quest-card__name">${this.#escape(habit.name)}</div>
        <p class="quest-card__desc">${this.#escape(habit.desc)}</p>
        <div class="quest-card__rewards">
          <span class="reward-tag reward-tag--xp">+${habit.xp} XP</span>
          <span class="reward-tag reward-tag--gold">+${habit.gold} 🪙</span>
        </div>
        <div class="quest-card__actions">
          <button class="btn btn--quest ${done ? 'btn--quest--done' : ''}" data-habit="${habit.id}" ${done ? 'disabled aria-disabled="true"' : ''}>
            ${done ? '✓ ВЫПОЛНЕНО' : '⚔️ ВЫПОЛНИТЬ'}
          </button>
          ${isCustom ? `
            <div class="quest-card__custom-actions">
              <button class="btn btn--tiny" type="button" data-habit-edit="${habit.id}">Редактировать</button>
              <button class="btn btn--tiny btn--danger" type="button" data-habit-delete="${habit.id}">Удалить</button>
            </div>
          ` : ''}
        </div>
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

    this.$$('[data-habit-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.#editingHabitId = btn.dataset.habitEdit;
        this.render();
      });
    });

    this.$$('[data-habit-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.emit('habit:delete', { habitId: btn.dataset.habitDelete });
      });
    });

    const form = this.$('#habit-form');
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        this.#handleSubmit(new FormData(form));
      });
    }

    const cancelEdit = this.$('#habit-cancel-edit');
    if (cancelEdit) {
      cancelEdit.addEventListener('click', () => {
        this.#editingHabitId = null;
        this.render();
      });
    }
  }

  #handleSubmit(formData) {
    const habit = {
      id: this.#editingHabitId || `custom_${Date.now()}`,
      name: (formData.get('name') || '').toString().trim(),
      icon: (formData.get('icon') || '✨').toString().trim(),
      desc: (formData.get('desc') || '').toString().trim(),
      xp: Number(formData.get('xp')),
      gold: Number(formData.get('gold')),
      isCustom: true,
    };

    if (!habit.name || !habit.desc || !habit.icon) {
      Toast.show('⚠️ Заполни все поля привычки.', 'err');
      return;
    }

    if (!Number.isFinite(habit.xp) || habit.xp <= 0) {
      Toast.show('⚠️ XP должно быть больше 0.', 'err');
      return;
    }

    if (!Number.isFinite(habit.gold) || habit.gold < 0) {
      Toast.show('⚠️ Золото не может быть отрицательным.', 'err');
      return;
    }

    if (this.#editingHabitId) {
      this.emit('habit:update', { habit });
      Toast.show(`✏️ Привычка «${habit.name}» обновлена.`, 'ach');
    } else {
      this.emit('habit:create', { habit });
      Toast.show(`➕ Добавлена привычка «${habit.name}».`, 'ach');
    }

    this.#editingHabitId = null;
    this.render();
  }

  markCompleted(habitId) {
    const card = this.$(`#quest-card-${habitId}`);
    const btn = this.$(`[data-habit="${habitId}"]`);
    if (!card || !btn) return;

    card.classList.add('quest-card--completing');
    setTimeout(() => card.classList.remove('quest-card--completing'), 700);
    setTimeout(() => {
      card.classList.add('quest-card--completed');
      btn.disabled = true;
      btn.className = 'btn btn--quest btn--quest--done';
      btn.textContent = '✓ ВЫПОЛНЕНО';
    }, 300);
  }

  #escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }
}
