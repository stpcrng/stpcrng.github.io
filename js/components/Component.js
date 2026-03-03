/**
 * @class Component
 * @description Base class for all UI components.
 *
 * Subclasses must implement render() and may override:
 *   - onMount()   called once after first render
 *   - onUpdate()  called on subsequent renders
 *   - bindEvents() called after each render
 */
class Component {

  /**
   * @param {string|HTMLElement} container - CSS selector or DOM element
   */
  constructor(container) {
    this._root = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this._root) {
      throw new Error(`[Component] Container not found: ${container}`);
    }

    this._mounted = false;
  }

  // ─── Public API ─────────────────────────────────────

  /**
   * Render the component into its container.
   * Calls onMount the first time, onUpdate thereafter.
   */
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

  /**
   * Convenience: update state then re-render.
   * @param {function} mutator - receives `this`, use to update properties
   */
  refresh(mutator) {
    if (mutator) mutator(this);
    this.render();
  }

  // ─── To Override ────────────────────────────────────

  /**
   * Return the HTML string for this component.
   * @returns {string}
   * @abstract
   */
  template() {
    return '';
  }

  /** Called once, after first render. Use for one-time setup. */
  onMount() {}

  /** Called on every re-render after the first. */
  onUpdate() {}

  /** Attach DOM event listeners. Called after every render. */
  bindEvents() {}

  // ─── Helpers ────────────────────────────────────────

  /**
   * Find a child element by selector.
   * @param {string} selector
   * @returns {HTMLElement|null}
   */
  $(selector) {
    return this._root.querySelector(selector);
  }

  /**
   * Find all matching child elements.
   * @param {string} selector
   * @returns {NodeListOf<HTMLElement>}
   */
  $$(selector) {
    return this._root.querySelectorAll(selector);
  }

  /**
   * Emit a custom event on the root element.
   * @param {string} name
   * @param {*}      detail
   */
  emit(name, detail) {
    this._root.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}
