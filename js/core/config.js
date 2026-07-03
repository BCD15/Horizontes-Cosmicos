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
    // Evolução padrão
    difficultyGrowthPercent: 12,

    // ALTERADO: Tabela de evolução dos inimigos (em %) a cada vitória
    difficultyOptions: {
      "FÁCIL": 5,   // Inimigos sobem 5% de força por vitória
      "MÉDIO": 12,  // Inimigos sobem 12% de força por vitória
      "DIFÍCIL": 25 // Inimigos sobem 25% de força por vitória
    },

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