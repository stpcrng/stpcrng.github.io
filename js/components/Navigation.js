/**
 * @class Navigation
 * @extends Component
 * @description App navigation bar.
 * Emits 'nav:change' with { page } on tab click.
 */
class Navigation extends Component {

  #currentPage;

  /** @param {string} container  @param {string} initialPage */
  constructor(container, initialPage = 'home') {
    super(container);
    this.#currentPage = initialPage;
  }

  get currentPage() { return this.#currentPage; }

  template() {
    return /* html */`
      <div class="nav__logo">HabitHero</div>
      <div class="nav__tabs" role="tablist">
        ${this.#tabs()}
      </div>
    `;
  }

  #tabs() {
    const tabs = [
      { id: 'home',         icon: '🏠', label: 'Главная'      },
      { id: 'achievements', icon: '🏆', label: 'Достижения'   },
      { id: 'shop',         icon: '🛒', label: 'Магазин'      },
    ];

    return tabs.map(t => /* html */`
      <button
        class="nav__tab ${t.id === this.#currentPage ? 'nav__tab--active' : ''}"
        data-page="${t.id}"
        role="tab"
        aria-selected="${t.id === this.#currentPage}"
      >
        <span>${t.icon}</span> ${t.label}
      </button>
    `).join('');
  }

  bindEvents() {
    this.$$('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page === this.#currentPage) return;
        this.#currentPage = page;
        this.render(); // re-render to update active state
        this.emit('nav:change', { page });
      });
    });
  }
}
