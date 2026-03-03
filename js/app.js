/**
 * @class App
 * @description Root application controller.
 *
 * Responsibilities:
 *  - Bootstrap: decide whether to show character creation or main app
 *  - Own the Store and wire components together
 *  - Handle business logic triggered by component events
 *  - Coordinate cross-cutting concerns (achievements, streak, modals)
 */
class App {

  /** @type {Store}              */ #store;
  /** @type {Navigation}         */ #nav;
  /** @type {ProfileCard}        */ #profileCard;
  /** @type {StreakBanner}        */ #streakBanner;
  /** @type {QuestBoard}         */ #questBoard;
  /** @type {AchievementsPage}   */ #achievementsPage;
  /** @type {ShopPage}           */ #shopPage;
  /** @type {CharacterCreation}  */ #creation;

  /** Active page id */
  #activePage = 'home';

  constructor() {
    Modal.init();
    this.#boot();
  }

  // ═══════════════════════════════════════════════════
  // BOOTSTRAP
  // ═══════════════════════════════════════════════════

  #boot() {
    const saved = StorageService.load();

    if (saved) {
      this.#initStore(saved);
      this.#syncDay();
      this.#showApp();
    } else {
      this.#showCreationScreen();
    }
  }

  #initStore(character) {
    this.#store = new Store(character, StorageService);
  }

  // ═══════════════════════════════════════════════════
  // CHARACTER CREATION
  // ═══════════════════════════════════════════════════

  #showCreationScreen() {
    const screen = document.getElementById('screen-create');
    screen.classList.add('screen-create--active');

    this.#creation = new CharacterCreation(screen);
    this.#creation.render();

    screen.addEventListener('character:created', e => {
      this.#handleCharacterCreated(e.detail);
    });
  }

  #handleCharacterCreated({ name, avatar }) {
    const character = Character.createDefault(name, avatar);
    character.lastLoginDate      = StreakService.today();
    character.streakCountedToday = false;

    this.#initStore(character);
    StorageService.save(character);

    document.getElementById('screen-create').classList.remove('screen-create--active');
    this.#showApp();
  }

  // ═══════════════════════════════════════════════════
  // APP SHELL
  // ═══════════════════════════════════════════════════

  #showApp() {
    const screen = document.getElementById('screen-app');
    screen.classList.add('screen--active');

    this.#applyPurchasedTheme();
    this.#mountComponents();
    this.#subscribeToStore();
  }

  #mountComponents() {
    // Navigation
    this.#nav = new Navigation(document.getElementById('nav'), 'home');
    this.#nav.render();
    document.getElementById('nav').addEventListener('nav:change', e => {
      this.#switchPage(e.detail.page);
    });

    // Profile card
    this.#profileCard = new ProfileCard(
      document.getElementById('profile-card-container'),
      this.#store,
    );
    this.#profileCard.render();

    // Streak banner
    this.#streakBanner = new StreakBanner(
      document.getElementById('streak-banner-container'),
      this.#store,
    );
    this.#streakBanner.render();

    // Quest board
    this.#questBoard = new QuestBoard(
      document.getElementById('quest-board-container'),
      this.#store,
    );
    this.#questBoard.render();
    document.getElementById('quest-board-container').addEventListener('quest:completed', e => {
      this.#handleQuestCompleted(e.detail.habitId);
    });

    // Achievements page
    this.#achievementsPage = new AchievementsPage(
      document.getElementById('page-achievements'),
      this.#store,
    );
    this.#achievementsPage.render();

    // Shop page
    this.#shopPage = new ShopPage(
      document.getElementById('page-shop'),
      this.#store,
    );
    this.#shopPage.render();
    document.getElementById('page-shop').addEventListener('shop:purchase', e => {
      this.#handlePurchase(e.detail.itemId);
    });
  }

  #subscribeToStore() {
    this.#store.subscribe(() => {
      this.#profileCard.render();
      this.#streakBanner.render();
      // Achievements and shop re-render on page switch, not on every update
    });
  }

  // ═══════════════════════════════════════════════════
  // DAILY SYNC
  // ═══════════════════════════════════════════════════

  #syncDay() {
    const char   = this.#store.getCharacter();
    const result = StreakService.syncOnLoad(char);

    this.#store.update(() => {}); // persist synced state

    if (result.broken) {
      Toast.show('😢 Серия прервана! Начни заново сегодня.', 'err', 600);
    }
  }

  // ═══════════════════════════════════════════════════
  // QUEST COMPLETION
  // ═══════════════════════════════════════════════════

  #handleQuestCompleted(habitId) {
    const habit = HABITS_DATA.find(h => h.id === habitId);
    if (!habit) return;

    const char = this.#store.getCharacter();
    if (char.completedToday.includes(habitId)) return;

    this.#store.update(character => {
      // 1. Streak
      const isFirstToday = character.completedToday.length === 0;
      if (isFirstToday) {
        const streakResult = StreakService.onFirstQuestOfDay(character);
        if (streakResult.xpBonus > 0) {
          Toast.show(`🔥 Бонус за серию 3 дня! +${streakResult.xpBonus} XP`, 'xp', 700);
        }
      }

      // 2. XP & level
      const xpResult = XPService.applyXP(character, habit.xp);
      if (xpResult.leveledUp) {
        setTimeout(() => {
          Modal.showLevelUp(xpResult.newLevel);
          Confetti.launch();
        }, 400);
      }

      // 3. Gold
      character.gold += habit.gold;

      // 4. Mark habit
      character.completedToday.push(habitId);
      character.totalHabitsCompleted += 1;

      // 5. Perfect day check
      if (character.completedToday.length === HABITS_DATA.length) {
        character.perfectDays = (character.perfectDays || 0) + 1;
      }
    });

    // Visual feedback (DOM animation, no re-render needed)
    this.#questBoard.markCompleted(habitId);

    Toast.show(`✅ ${habit.name}: +${habit.xp} XP`, 'xp');
    Toast.show(`🪙 +${habit.gold} золота`, 'gold', 320);

    // Check achievements after store has settled
    this.#checkAchievements();
  }

  // ═══════════════════════════════════════════════════
  // SHOP
  // ═══════════════════════════════════════════════════

  #handlePurchase(itemId) {
    const item = SHOP_ITEMS_DATA.find(i => i.id === itemId);
    if (!item) return;

    const char = this.#store.getCharacter();
    if (char.gold < item.cost) {
      Toast.show('💸 Недостаточно золота!', 'err');
      return;
    }
    if (char.purchases.includes(itemId)) return;

    this.#store.update(character => {
      character.gold     -= item.cost;
      character.purchases.push(item.id);

      if (item.type === 'theme') {
        document.body.classList.add('theme-dark');
      } else if (item.type === 'boost') {
        character.xpBoostExpiry = Date.now() + item.days * 86_400_000;
        character.xpBoostValue  = item.value;
        Toast.show(`⚡ Бонус XP активен на ${item.days} дней!`, 'xp', 300);
      } else if (item.type === 'avatar') {
        character.avatar = item.value;
      }
    });

    Toast.show(`🛒 Куплено: ${item.name}!`, 'ach');
    this.#shopPage.render();
    this.#checkAchievements();
  }

  // ═══════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════

  #checkAchievements() {
    const char = this.#store.getCharacter();
    const newUnlocks = AchievementService.checkAll(char, ACHIEVEMENTS_DATA);

    if (newUnlocks.length > 0) {
      this.#store.update(() => {}); // persist newly added achievements to char

      newUnlocks.forEach((ach, i) => {
        setTimeout(() => Modal.showAchievement(ach), i * 200);
      });

      this.#achievementsPage.render();
    }
  }

  // ═══════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════

  #switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'));

    // Show target page
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('page--active');

    this.#activePage = pageId;

    // Lazy render on switch
    if (pageId === 'achievements') this.#achievementsPage.render();
    if (pageId === 'shop')         this.#shopPage.render();
  }

  // ═══════════════════════════════════════════════════
  // THEME
  // ═══════════════════════════════════════════════════

  #applyPurchasedTheme() {
    const { purchases } = this.#store.getCharacter();
    if (purchases.includes('dark_theme')) {
      document.body.classList.add('theme-dark');
    }
  }
}

// ── Entry point ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.habitHeroApp = new App();
});
