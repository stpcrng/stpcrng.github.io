/**
 * @file shopItems.js
 * @description Shop item definitions.
 */

const SHOP_ITEMS_DATA = Object.freeze([
  {
    id:    'avatar_dragon',
    icon:  '🐉',
    name:  'Аватар дракона',
    desc:  'Стань грозным воином-драконом.',
    cost:  200,
    type:  'avatar',
    value: 'avatar_dragon',
  },
  {
    id:    'avatar_robot',
    icon:  '🤖',
    name:  'Аватар робота',
    desc:  'Кибер-улучшения активированы.',
    cost:  200,
    type:  'avatar',
    value: 'avatar_robot',
  },
  {
    id:    'dark_theme',
    icon:  '🌑',
    name:  'Темная тема',
    desc:  'Еще более глубокий темный интерфейс.',
    cost:  300,
    type:  'theme',
  },
  {
    id:    'xp_boost',
    icon:  '⚡',
    name:  'Усилитель XP',
    desc:  'Получай +5 бонусного XP за каждый квест в течение 7 дней.',
    cost:  150,
    type:  'boost',
    value: 5,
    days:  7,
  },
]);
