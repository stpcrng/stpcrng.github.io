/**
 * @class ShopPage
 * @extends Component
 * @description Renders the shop and handles purchases.
 * Emits 'shop:purchase' with { itemId } on the root element.
 */
class ShopPage extends Component {

  /** @param {string} container @param {Store} store */
  constructor(container, store) {
    super(container);
    this._store = store;
  }

  template() {
    const { gold } = this._store.getCharacter();

    return /* html */`
      <div class="page-header">
        <h2 class="page-header__title">Магазин</h2>
        <div class="gold-display">🪙 <span>${gold}</span></div>
      </div>
      <div class="shop-grid">
        ${SHOP_ITEMS_DATA.map(item => this.#cardHTML(item)).join('')}
      </div>
    `;
  }

  #cardHTML(item) {
    const char  = this._store.getCharacter();
    const owned = char.purchases.includes(item.id);
    const canBuy = char.gold >= item.cost && !owned;

    return /* html */`
      <article
        class="shop-card ${owned ? 'shop-card--owned' : ''}"
        aria-label="${item.name}"
      >
        <span class="shop-card__icon" role="img">${item.icon}</span>
        <div class="shop-card__name">${item.name}</div>
        <p class="shop-card__desc">${item.desc}</p>
        <button
          class="btn btn--buy"
          data-item="${item.id}"
          ${!canBuy ? 'disabled aria-disabled="true"' : ''}
        >
          ${owned ? '✓ КУПЛЕНО' : `🪙 ${item.cost} золота`}
        </button>
      </article>
    `;
  }

  bindEvents() {
    this.$$('[data-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        this.emit('shop:purchase', { itemId: btn.dataset.item });
      });
    });
  }
}
