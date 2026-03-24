
class Component {

  constructor(container) {
    this._root = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this._root) {
      throw new Error(`[Component] Container not found: ${container}`);
    }

    this._mounted = false;
  }

  render() {
    this._root.innerHTML = this.template();
    this.bindEvents();

    if (!this._mounted) {
      this._mounted = true;
      this.onMount();
    } else {
      this.onUpdate();
    }
  }

  refresh(mutator) {
    if (mutator) mutator(this);
    this.render();
  }

  template() {
    return '';
  }

  onMount() {}

  onUpdate() {}

  bindEvents() {}

  $(selector) {
    return this._root.querySelector(selector);
  }

  $$(selector) {
    return this._root.querySelectorAll(selector);
  }

  emit(name, detail) {
    this._root.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}
