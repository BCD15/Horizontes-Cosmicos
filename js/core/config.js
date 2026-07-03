const CONFIG = {
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,

  PLAYER: {
    WIDTH: 32,
    HEIGHT: 32,
    SPEED: 1.4,
    RUN_MULTIPLIER: 1.8
  },

  BATTLE: {
    // Ajuste aqui a escalabilidade da dificuldade.
    // Exemplo: 12 = inimigos ganham +12% de vida, escudo e dano a cada vitória.
    difficultyGrowthPercent: 12,

    baseEnemy: {
      hp: 240,
      shield: 120,
      damage: 32
    },

    rewards: {
      baseGold: 180,
      perDifficulty: 45,
      perBattle: 25
    }
  }
};