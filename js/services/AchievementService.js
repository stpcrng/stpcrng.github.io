
class AchievementService {

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

  static unlockedCount(character) {
    return character.achievements.length;
  }

  static isUnlocked(character, id) {
    return character.achievements.includes(id);
  }
}
