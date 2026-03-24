
class StreakService {

  static today() {
    return new Date().toDateString();
  }

  static daysBetween(dateA, dateB) {
    const msPerDay = 86_400_000;
    const a = new Date(dateA).setHours(0, 0, 0, 0);
    const b = new Date(dateB).setHours(0, 0, 0, 0);
    return Math.abs(Math.round((b - a) / msPerDay));
  }

  static syncOnLoad(character) {
    const today = this.today();

    if (!character.lastLoginDate) {
      character.lastLoginDate      = today;
      character.completedToday     = [];
      character.streakCountedToday = false;
      return { broken: false, newDay: true };
    }

    const diff = this.daysBetween(character.lastLoginDate, today);

    if (diff === 0) {
      return { broken: false, newDay: false };
    }

    if (diff === 1) {
      character.lastLoginDate      = today;
      character.completedToday     = [];
      character.streakCountedToday = false;
      return { broken: false, newDay: true };
    }

    character.streak              = 0;
    character.lastLoginDate       = today;
    character.completedToday      = [];
    character.streakCountedToday  = false;
    return { broken: true, newDay: true };
  }

  static onFirstQuestOfDay(character) {
    if (character.streakCountedToday) {
      return { xpBonus: 0, milestoneReached: null };
    }

    character.streak += 1;
    character.streakCountedToday = true;

    const milestoneReached = character.streak === 3 ? 3 : null;
    const xpBonus = milestoneReached === 3 ? 30 : 0;

    character.xp += xpBonus;

    return { xpBonus, milestoneReached };
  }
}
