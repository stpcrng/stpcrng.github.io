/**
 * @class XPService
 * @description Pure, stateless helper for XP / levelling calculations.
 * All methods are static — no instance needed.
 */
class XPService {

  static XP_PER_LEVEL = 100;

  /**
   * Derive level from cumulative XP total.
   * @param {number} totalXP
   * @returns {number} level (min 1)
   */
  static levelFromXP(totalXP) {
    return Math.floor(totalXP / this.XP_PER_LEVEL) + 1;
  }

  /**
   * XP earned within the current level (resets per level).
   * @param {number} totalXP
   * @returns {number}
   */
  static xpInCurrentLevel(totalXP) {
    return totalXP % this.XP_PER_LEVEL;
  }

  /**
   * Percentage progress towards the next level (0–100).
   * @param {number} totalXP
   * @returns {number}
   */
  static progressPercent(totalXP) {
    return (this.xpInCurrentLevel(totalXP) / this.XP_PER_LEVEL) * 100;
  }

  /**
   * XP text label, e.g. "42 / 100 XP".
   * @param {number} totalXP
   * @returns {string}
   */
  static progressLabel(totalXP) {
    const inLevel = this.xpInCurrentLevel(totalXP);
    return `${inLevel} / ${this.XP_PER_LEVEL} XP  (Всего: ${totalXP})`;
  }

  /**
   * Apply XP to a Character, handle level-ups, return a result object.
   *
   * @param {Character} character - mutated in place
   * @param {number}    amount    - base XP to award
   * @returns {{ earned: number, leveledUp: boolean, newLevel: number }}
   */
  static applyXP(character, amount) {
    const bonus   = character.isBoostActive ? character.xpBoostValue : 0;
    const earned  = amount + bonus;
    const oldLevel = character.level;

    character.xp    += earned;
    character.level  = this.levelFromXP(character.xp);

    const leveledUp = character.level > oldLevel;
    if (leveledUp) {
      character.gold += 50; // level-up gold bonus
    }

    return { earned, leveledUp, newLevel: character.level };
  }
}
