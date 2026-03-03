Файл для быстрой ориентации по проекту HabitHero.

**Обзор**
- HabitHero — одностраничный геймифицированный RPG-трекер привычек на чистом HTML/CSS/JS.
- Никаких фреймворков, сборщиков и модулей ES: все скрипты подключаются через обычные `<script>` теги.
- Данные и интерфейс полностью локальные, состояние хранится в `localStorage`.

**Точки входа**
- `index.html` — единственная HTML-страница, подключает CSS и JS в строго заданном порядке.
- `js/app.js` — корневой контроллер приложения (`App`), связывает компоненты и бизнес‑логику.

**Структура проекта**
- `css/variables.css` — дизайн‑токены (цвета, размеры, типографика).
- `css/base.css` — reset, базовые стили, фон, скроллбар.
- `css/layout.css` — каркас экранов, навигация, сетки и адаптив.
- `css/components.css` — стили UI-компонентов.
- `css/animations.css` — keyframes и анимации.
- `js/data/habits.js` — `HABITS_DATA` (4 ежедневные привычки/квеста).
- `js/data/achievements.js` — `ACHIEVEMENTS_DATA` (9 достижений, включая секретное).
- `js/data/shopItems.js` — `SHOP_ITEMS_DATA` (4 товара магазина).
- `js/models/Character.js` — модель персонажа и сериализация.
- `js/services/StorageService.js` — работа с `localStorage` (ключ `habithero_v2`).
- `js/services/XPService.js` — расчёт XP и уровней.
- `js/services/StreakService.js` — логика ежедневной серии.
- `js/services/AchievementService.js` — проверка условий достижений.
- `js/store/Store.js` — реактивное состояние (Observer).
- `js/components/*` — UI-слой (шаблоны и DOM-события).

**Ключевая логика**
- XP: 100 XP на уровень, при левел-апе выдаётся +50 золота.
- Серия: дата дня вычисляется `Date.toDateString()`, прогресс сбрасывается при пропуске > 1 дня.
- Бонус серии: на 3‑й день даётся +30 XP (только при первом квесте дня).
- Идеальный день: если выполнены все 4 квеста, растёт счётчик `perfectDays`.
- Магазин: покупка может дать тему (`theme-dark`), буст XP на N дней или аватар.

**Состояние персонажа (`Character`)**
- Основные поля: `name`, `avatar`, `level`, `xp`, `gold`, `streak`.
- Ежедневные: `lastLoginDate`, `completedToday`, `streakCountedToday`.
- Прогресс: `achievements`, `totalHabitsCompleted`, `perfectDays`, `purchases`.
- Буст XP: `xpBoostExpiry`, `xpBoostValue`.
- Геттеры: `avatarEmoji`, `className`, `isBoostActive`.

**UI и события**
- Компоненты генерируют HTML-шаблоны строками и перерисовываются целиком.
- `Toast` и `Modal` — синглтоны, создают свои контейнеры в DOM.
- `Confetti` — декоративный эффект при левел-апе.

События UI (CustomEvent, bubbling).
- `character:created` — из `CharacterCreation`, создаёт персонажа.
- `nav:change` — из `Navigation`, переключение вкладок.
- `quest:completed` — из `QuestBoard`, завершение квеста.
- `shop:purchase` — из `ShopPage`, покупка в магазине.

**Поток данных (упрощённо)**
- `App` грузит состояние через `StorageService.load()`.
- Если данных нет — показывает экран создания персонажа.
- При действиях UI вызывается `Store.update()`, который сохраняет состояние и уведомляет подписчиков.
- `ProfileCard` и `StreakBanner` всегда перерисовываются при изменениях.
- `AchievementsPage` и `ShopPage` рендерятся при переключении вкладок.

**Локализация**
- Интерфейс русифицирован, строки хранятся прямо в JS-шаблонах и data-файлах.
- Централизованной i18n-системы нет, переводы меняются вручную в компонентах и `js/data/*`.

**Запуск**
- Можно открыть `index.html` напрямую в браузере.
- Также работает через любой статический сервер (например `npx serve`).

**Тесты**
- Автоматических тестов нет.
