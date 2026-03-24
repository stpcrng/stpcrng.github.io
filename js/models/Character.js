class Character {
  constructor(data = {}) {
    this.name = data.name ?? 'Герой';
    this.avatar = data.avatar ?? 'warrior';
    this.level = data.level ?? 1;
    this.xp = data.xp ?? 0;
    this.gold = data.gold ?? 0;
    this.streak = data.streak ?? 0;
    this.lastLoginDate = data.lastLoginDate ?? null;
    this.achievements = data.achievements ?? [];
    this.totalHabitsCompleted = data.totalHabitsCompleted ?? 0;
    this.completedToday = data.completedToday ?? [];
    this.perfectDays = data.perfectDays ?? 0;
    this.purchases = data.purchases ?? [];
    this.xpBoostExpiry = data.xpBoostExpiry ?? null;
    this.xpBoostValue = data.xpBoostValue ?? 0;
    this.streakCountedToday = data.streakCountedToday ?? false;
  }

  get avatarEmoji() {
    const map = {
      warrior: '⚔️',
      mage: '🧙',
      ninja: '🥷',
      dev: '💻',
      avatar_dragon: '🐉',
      avatar_robot: '🤖',
      avatar_knight: '🛡️',
      avatar_wizard: '🧙',
      avatar_ninja: '🥷',
      avatar_viking: '🪓',
      avatar_ghost: '👻',
      avatar_alien: '👽',
      avatar_pirate: '🏴‍☠️',
      avatar_samurai: '⚔️',
      avatar_astronaut: '👨‍🚀',
      avatar_king: '👑',
    };

    return map[this.avatar] ?? '⚔️';
  }

  get className() {
    const map = {
      warrior: 'Воин',
      mage: 'Маг',
      ninja: 'Ниндзя',
      dev: 'Разработчик',
      avatar_dragon: 'Дракон',
      avatar_robot: 'Робот',
      avatar_knight: 'Рыцарь',
      avatar_wizard: 'Волшебник',
      avatar_ninja: 'Тень',
      avatar_viking: 'Викинг',
      avatar_ghost: 'Призрак',
      avatar_alien: 'Пришелец',
      avatar_pirate: 'Пират',
      avatar_samurai: 'Самурай',
      avatar_astronaut: 'Астронавт',
      avatar_king: 'Король',
    };

    return map[this.avatar] ?? 'Герой';
  }

  get isBoostActive() {
    return Boolean(this.xpBoostExpiry) && Date.now() < this.xpBoostExpiry;
  }

  toJSON() {
    return {
      name: this.name,
      avatar: this.avatar,
      level: this.level,
      xp: this.xp,
      gold: this.gold,
      streak: this.streak,
      lastLoginDate: this.lastLoginDate,
      achievements: this.achievements,
      totalHabitsCompleted: this.totalHabitsCompleted,
      completedToday: this.completedToday,
      perfectDays: this.perfectDays,
      purchases: this.purchases,
      xpBoostExpiry: this.xpBoostExpiry,
      xpBoostValue: this.xpBoostValue,
      streakCountedToday: this.streakCountedToday,
    };
  }

  static fromJSON(data) {
    return new Character(data);
  }

  static createDefault(name, avatar) {
    return new Character({ name, avatar });
  }
}
