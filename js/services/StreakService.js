/**
 * @class StreakService
 * @description Handles daily streak management logic.
 */
class StreakService {

  /**
   * Canonical "today" string used as the daily key.
   * @returns {string} e.g. "Fri Feb 27 2026"
   */
  static today() {
    return new Date().toDateString();
  }

  /**
   * Full days between two date strings (always ≥ 0).
   * @param {string} dateA
   * @param {string} dateB
   * @returns {number}
   */
  static daysBetween(dateA, dateB) {
    const msPerDay = 86_400_000;
    const a = new Date(dateA).setHours(0, 0, 0, 0);
    const b = new Date(dateB).setHours(0, 0, 0, 0);
    return Math.abs(Math.round((b - a) / msPerDay));
  }

  /**
   * Called once on app start. Checks whether the streak is still valid
   * given the last recorded login date.
   *
   * Mutates the character in place and returns a description of what happened.
   *
   * @param {Character} character
   * @returns {{ broken: boolean, newDay: boolean }}
   */
  static syncOnLoad(character) {
    const today = this.today();

    if (!character.lastLoginDate) {
      // First ever session
      character.lastLoginDate      = today;
      character.completedToday     = [];
      character.streakCountedToday = false;
      return { broken: false, newDay: true };
    }

    const diff = this.daysBetween(character.lastLoginDate, today);

    if (diff === 0) {
      // Same day — preserve completedToday, no changes
      return { broken: false, newDay: false };
    }

    if (diff === 1) {
      // Yesterday — eligible for continuation, reset daily completions
      character.lastLoginDate      = today;
      character.completedToday     = [];
      character.streakCountedToday = false;
      return { broken: false, newDay: true };
    }

    // More than one day missed — break streak
    character.streak              = 0;
    character.lastLoginDate       = today;
    character.completedToday      = [];
    character.streakCountedToday  = false;
    return { broken: true, newDay: true };
  }

  /**
   * Called when the user completes their FIRST quest of the day.
   * Increments streak and applies milestone bonuses.
   *
   * @param {Character} character
   * @returns {{ xpBonus: number, milestoneReached: number|null }}
   */
  static onFirstQuestOfDay(character) {
    if (character.streakCountedToday) {
      return { xpBonus: 0, milestoneReached: null };
    }

    character.streak += 1;
    character.streakCountedToday = true;

    // Milestone bonus at exactly 3 days
    const milestoneReached = character.streak === 3 ? 3 : null;
    const xpBonus = milestoneReached === 3 ? 30 : 0;

    character.xp += xpBonus;

    return { xpBonus, milestoneReached };
  }
}
