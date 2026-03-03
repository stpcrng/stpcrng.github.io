# ⚔️ HabitHero — Gamified RPG Habit Tracker

A single-page RPG habit tracker built with **HTML + CSS + Vanilla JS**. No frameworks, no build tools.

---

## 🗂 Architecture

```
habit-hero/
│
├── index.html                  # App shell + ordered script tags
│
├── css/
│   ├── variables.css           # Design tokens (colors, spacing, typography)
│   ├── base.css                # Reset, body, typography, scrollbar
│   ├── layout.css              # Screens, nav, page grids, responsive
│   ├── components.css          # All UI component styles
│   └── animations.css          # Keyframes + animation utility classes
│
└── js/
    ├── data/                   # Static, frozen data (no logic)
    │   ├── habits.js           # HABITS_DATA — the 4 daily quests
    │   ├── achievements.js     # ACHIEVEMENTS_DATA — 9 achievements + check()
    │   └── shopItems.js        # SHOP_ITEMS_DATA — 4 purchasable items
    │
    ├── models/
    │   └── Character.js        # Character class — pure data model, serialisation
    │
    ├── services/               # Pure, stateless business logic (no DOM)
    │   ├── StorageService.js   # localStorage abstraction
    │   ├── XPService.js        # XP / level calculations
    │   ├── StreakService.js     # Daily streak management
    │   └── AchievementService.js  # Achievement evaluation
    │
    ├── store/
    │   └── Store.js            # Reactive state container (Observer pattern)
    │
    ├── components/             # UI layer — HTML templating + DOM events
    │   ├── Component.js        # Abstract base class (render/template/bindEvents)
    │   ├── Toast.js            # Singleton toast notification manager
    │   ├── Confetti.js         # Level-up confetti burst
    │   ├── Modal.js            # Queued modal windows (level-up, achievements)
    │   ├── Navigation.js       # Tab nav, emits nav:change
    │   ├── ProfileCard.js      # Hero stats display
    │   ├── StreakBanner.js     # Daily streak with milestones
    │   ├── QuestBoard.js       # Daily quests grid, emits quest:completed
    │   ├── AchievementsPage.js # Achievements grid
    │   ├── ShopPage.js         # Shop grid, emits shop:purchase
    │   └── CharacterCreation.js # Onboarding screen, emits character:created
    │
    └── app.js                  # App class — root controller, wires everything
```

---

## 🏛 Design Principles

| Principle | Implementation |
|---|---|
| **Separation of concerns** | Data / Services / Store / Components are fully decoupled |
| **OOP** | ES6 classes throughout; private fields (`#`) for encapsulation |
| **Observer pattern** | `Store.subscribe()` → components re-render on state changes |
| **Event-driven UI** | Components emit custom DOM events; `App` handles them centrally |
| **Pure functions** | All services are static / stateless — easy to test |
| **Single source of truth** | All state lives in `Store` backed by one `Character` instance |
| **Template method pattern** | `Component` defines the render lifecycle; subclasses override `template()` |

---

## 🚀 Running Locally

Because the app uses multiple JS files loaded via `<script>` tags (not ES modules),
it works with any static file server. Open `index.html` directly in a browser — no build needed.

**Quickstart with Node:**
```bash
npx serve habit-hero
```

**Or with Python:**
```bash
cd habit-hero && python3 -m http.server 8080
```

Then open `http://localhost:8080`.

---

## 🎮 Features

- **Character creation** — name + 4 avatar classes
- **Daily quests** — 4 habits with XP & gold rewards, reset each day
- **Level system** — 100 XP per level, level-up modal + confetti
- **Streak tracking** — daily streak with 3/7/30-day milestones
- **9 Achievements** — including a secret one
- **Shop** — premium avatars, dark theme, XP boost
- **Full persistence** — all progress saved in localStorage
