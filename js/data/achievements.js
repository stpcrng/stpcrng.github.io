/**
 * @file achievements.js
 * @description Achievement definitions.
 * Each entry's `check(state)` returns true when the achievement should unlock.
 */

const ACHIEVEMENTS_DATA = Object.freeze([
  {
    id:     'first',
    icon:   '🥉',
    name:   'Первый шаг',
    desc:   'Выполни первую привычку.',
    check:  state => state.totalHabitsCompleted >= 1,
  },
  {
    id:     'streak3',
    icon:   '🔥',
    name:   'В огне',
    desc:   'Сохрани серию 3 дня.',
    check:  state => state.streak >= 3,
  },
  {
    id:     'streak7',
    icon:   '⚡',
    name:   'Воин недели',
    desc:   'Сохрани серию 7 дней.',
    check:  state => state.streak >= 7,
  },
  {
    id:     'streak30',
    icon:   '👑',
    name:   'Легендарный',
    desc:   'Сохрани серию 30 дней.',
    check:  state => state.streak >= 30,
  },
  {
    id:     'fifty',
    icon:   '💪',
    name:   'Машина привычек',
    desc:   'Выполни 50 привычек всего.',
    check:  state => state.totalHabitsCompleted >= 50,
  },
  {
    id:     'lvl10',
    icon:   '🧙',
    name:   'Великий мастер',
    desc:   'Достигни 10 уровня.',
    check:  state => state.level >= 10,
  },
  {
    id:     'rich',
    icon:   '💰',
    name:   'Сокровищница',
    desc:   'Накопи 1000 золота.',
    check:  state => state.gold >= 1000,
  },
  {
    id:     'perfectDay',
    icon:   '⭐',
    name:   'Идеальный день',
    desc:   'Выполни все 4 квеста за один день.',
    check:  state => (state.perfectDays || 0) >= 1,
  },
  {
    id:     'secret',
    icon:   '🌌',
    name:   '???',
    desc:   'Скрытый путь открывается...',
    secret: true,
    check:  state => state.totalHabitsCompleted >= 10,
    // Revealed description once unlocked:
    revealedName: 'Ночная сова',
    revealedDesc: 'Выполни 10 привычек. Твоя легенда растет.',
  },
]);
