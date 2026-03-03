/**
 * @file habits.js
 * @description Static habit definitions — the "quests" available each day.
 */

const HABITS_DATA = Object.freeze([
  {
    id:   'sport',
    icon: '💪',
    name: 'Тренировка',
    desc: 'Прокачай тело и разум.',
    xp:   20,
    gold: 10,
  },
  {
    id:   'read',
    icon: '📚',
    name: 'Чтение',
    desc: 'Расширяй знания.',
    xp:   15,
    gold: 8,
  },
  {
    id:   'code',
    icon: '💻',
    name: 'Программирование',
    desc: 'Создай что-то крутое.',
    xp:   25,
    gold: 12,
  },
  {
    id:   'rise',
    icon: '🌅',
    name: 'Ранний подъем',
    desc: 'Покори утро.',
    xp:   10,
    gold: 5,
  },
]);
