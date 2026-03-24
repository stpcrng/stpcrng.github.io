
class XPService {

  static XP_PER_LEVEL = 100;

  static levelFromXP(totalXP) {
    return Math.floor(totalXP / this.XP_PER_LEVEL) + 1;
  }

  static xpInCurrentLevel(totalXP) {
    return totalXP % this.XP_PER_LEVEL;
  }

  static progressPercent(totalXP) {
    return (this.xpInCurrentLevel(totalXP) / this.XP_PER_LEVEL) * 100;
  }

  static progressLabel(totalXP) {
    const inLevel = this.xpInCurrentLevel(totalXP);
    return `${inLevel} / ${this.XP_PER_LEVEL} XP  (Всего: ${totalXP})`;
  }

  static applyXP(character, amount) {
    const bonus   = character.isBoostActive ? character.xpBoostValue : 0;
    const earned  = amount + bonus;
    const oldLevel = character.level;

    character.xp    += earned;
    character.level  = this.levelFromXP(character.xp);

    const leveledUp = character.level > oldLevel;
    if (leveledUp) {
      character.gold += 50;
    }

    return { earned, leveledUp, newLevel: character.level };
  }
}
