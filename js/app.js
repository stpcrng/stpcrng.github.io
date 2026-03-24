class App {
  static DAILY_PERFECT_TARGET = 4;
  static DAY_MS = 86_400_000;

  #store;
  #nav;
  #profileCard;
  #streakBanner;
  #questBoard;
  #achievementsPage;
  #shopPage;
  #creation;
  #activePage = 'home';

  constructor() {
    Modal.init();
    this.#boot();
  }

  #boot() {
    const saved = StorageService.load();

    if (saved) {
      this.#initStore(saved);
      this.#syncDay();
      this.#showApp();
      return;
    }

    this.#showCreationScreen();
  }

  #initStore(character) {
    this.#store = new Store(character, StorageService);
  }

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
    character.lastLoginDate = StreakService.today();
    character.streakCountedToday = false;

    this.#initStore(character);
    StorageService.save(character);

    document.getElementById('screen-create').classList.remove('screen-create--active');
    this.#showApp();
  }

  #showApp() {
    const screen = document.getElementById('screen-app');
    screen.classList.add('screen--active');

    this.#applyPurchasedTheme();
    this.#mountComponents();
    this.#subscribeToStore();
  }

  #mountComponents() {
    this.#nav = new Navigation(document.getElementById('nav'), this.#activePage);
    this.#nav.render();

    document.getElementById('nav').addEventListener('nav:change', e => {
      this.#switchPage(e.detail.page);
    });

    this.#profileCard = new ProfileCard(document.getElementById('profile-card-container'), this.#store);
    this.#profileCard.render();

    this.#streakBanner = new StreakBanner(document.getElementById('streak-banner-container'), this.#store);
    this.#streakBanner.render();

    this.#questBoard = new QuestBoard(document.getElementById('quest-board-container'), this.#store);
    this.#questBoard.render();

    document.getElementById('quest-board-container').addEventListener('quest:completed', e => {
      this.#handleQuestCompleted(e.detail.habitId);
    });

    this.#achievementsPage = new AchievementsPage(document.getElementById('page-achievements'), this.#store);
    this.#achievementsPage.render();

    this.#shopPage = new ShopPage(document.getElementById('page-shop'), this.#store);
    this.#shopPage.render();

    document.getElementById('page-shop').addEventListener('shop:purchase', e => {
      this.#handlePurchase(e.detail.itemId);
    });
  }

  #subscribeToStore() {
    this.#store.subscribe(() => {
      this.#profileCard.render();
      this.#streakBanner.render();
    });
  }

  #syncDay() {
    const character = this.#store.getCharacter();
    const result = StreakService.syncOnLoad(character);

    this.#store.touch();

    if (result.broken) {
      Toast.show('😢 Серия прервана! Начни заново сегодня.', 'err', 600);
    }
  }

  #handleQuestCompleted(habitId) {
    const habit = HABITS_DATA.find(h => h.id === habitId);
    if (!habit) return;

    const character = this.#store.getCharacter();
    if (character.completedToday.includes(habitId)) return;

    this.#store.update(nextCharacter => {
      this.#applyFirstQuestOfDayEffects(nextCharacter);

      const xpResult = XPService.applyXP(nextCharacter, habit.xp);
      if (xpResult.leveledUp) {
        setTimeout(() => {
          Modal.showLevelUp(xpResult.newLevel);
          Confetti.launch();
        }, 400);
      }

      nextCharacter.gold += habit.gold;
      nextCharacter.completedToday.push(habitId);
      nextCharacter.totalHabitsCompleted += 1;

      if (nextCharacter.completedToday.length >= App.DAILY_PERFECT_TARGET) {
        nextCharacter.perfectDays = (nextCharacter.perfectDays || 0) + 1;
      }
    });

    this.#questBoard.markCompleted(habitId);
    Toast.show(`✅ ${habit.name}: +${habit.xp} XP`, 'xp');
    Toast.show(`🪙 +${habit.gold} золота`, 'gold', 320);
    this.#checkAchievements();
  }

  #applyFirstQuestOfDayEffects(character) {
    const isFirstToday = character.completedToday.length === 0;
    if (!isFirstToday) return;

    const streakResult = StreakService.onFirstQuestOfDay(character);
    if (streakResult.xpBonus > 0) {
      Toast.show(`🔥 Бонус за серию 3 дня! +${streakResult.xpBonus} XP`, 'xp', 700);
    }
  }

  #handlePurchase(itemId) {
    const item = SHOP_ITEMS_DATA.find(i => i.id === itemId);
    if (!item) return;

    const character = this.#store.getCharacter();
    if (character.gold < item.cost) {
      Toast.show('💸 Недостаточно золота!', 'err');
      return;
    }

    if (character.purchases.includes(itemId)) return;

    this.#store.update(nextCharacter => {
      nextCharacter.gold -= item.cost;
      nextCharacter.purchases.push(item.id);

      if (item.type === 'theme') {
        document.body.classList.add('theme-dark');
      }

      if (item.type === 'boost') {
        const days = item.days ?? 1;
        nextCharacter.xpBoostExpiry = Date.now() + days * App.DAY_MS;
        nextCharacter.xpBoostValue = item.value;
        Toast.show(`⚡ Бонус XP активен на ${days} дн.`, 'xp', 300);
      }

      if (item.type === 'avatar') {
        nextCharacter.avatar = item.value;
      }
    });

    Toast.show(`🛒 Куплено: ${item.name}!`, 'ach');
    this.#shopPage.render();
    this.#checkAchievements();
  }

  #checkAchievements() {
    const character = this.#store.getCharacter();
    const newUnlocks = AchievementService.checkAll(character, ACHIEVEMENTS_DATA);

    if (newUnlocks.length === 0) return;

    this.#store.touch();
    newUnlocks.forEach((achievement, index) => {
      setTimeout(() => Modal.showAchievement(achievement), index * 200);
    });

    this.#achievementsPage.render();
  }

  #switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('page--active'));

    const target = document.getElementById(`page-${pageId}`);
    if (target) {
      target.classList.add('page--active');
    }

    this.#activePage = pageId;

    if (pageId === 'achievements') {
      this.#achievementsPage.render();
    }

    if (pageId === 'shop') {
      this.#shopPage.render();
    }
  }

  #applyPurchasedTheme() {
    const { purchases } = this.#store.getCharacter();
    if (purchases.includes('dark_theme')) {
      document.body.classList.add('theme-dark');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.habitHeroApp = new App();
});
