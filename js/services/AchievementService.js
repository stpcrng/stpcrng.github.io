/**
 * @class AchievementService
 * @description Evaluates achievement conditions against character state.
 */
class AchievementService {

  /**
   * Check all definitions against the current character state.
   * Returns any newly-unlocked achievements (not yet in character.achievements).
   *
   * @param {Character}    character
   * @param {Array<Object>} definitions - from ACHIEVEMENTS_DATA
   * @returns {Array<Object>} Newly unlocked achievement definitions
   */
  static checkAll(character, definitions) {
    const newlyUnlocked = [];

    for (const def of definitions) {
      if (character.achievements.includes(def.id)) continue;
      if (def.check(character)) {
        character.achievements.push(def.id);
        newlyUnlocked.push(def);
      }
    }

    return newlyUnlocked;
  }

  /**
   * How many achievements are currently unlocked.
   * @param {Character} character
   * @returns {number}
   */
  static unlockedCount(character) {
    return character.achievements.length;
  }

  /**
   * Whether a specific achievement is unlocked.
   * @param {Character} character
   * @param {string}    id
   * @returns {boolean}
   */
  static isUnlocked(character, id) {
    return character.achievements.includes(id);
  }
}
