const CombatSystem = {
  weaponCatalog: {
    canhao_balistico_mk_i: { type: "cannon", name: "Canhão Balístico Nível 1", damage: 100, reload: 1400 },
    canhao_reforcado_mk_ii: { type: "cannon", name: "Canhão Balístico Nível 2", damage: 140, reload: 1250 },
    canhao_perfurante_mk_iii: { type: "cannon", name: "Canhão Balístico Nível 3", damage: 200, reload: 1100 },
    artilharia_gauss_mk_iv: { type: "cannon", name: "Canhão Balístico Nível 4", damage: 300, reload: 950 },
    devastador_leviathan: { type: "cannon", name: "Canhão Balístico Nível 5", damage: 450, reload: 800 },

    laser_plasma_mk_i: { type: "laser", name: "Laser de Plasma Nível 1", damagePerSecond: 40, heatGain: 34, coolRate: 24, overheatCoolRate: 34 },
    laser_plasma_mk_ii: { type: "laser", name: "Laser de Plasma Nível 2", damagePerSecond: 65, heatGain: 31, coolRate: 27, overheatCoolRate: 38 },
    feixe_ionico_mk_iii: { type: "laser", name: "Feixe Iônico Nível 3", damagePerSecond: 95, heatGain: 28, coolRate: 30, overheatCoolRate: 42 },
    laser_prismatico_mk_iv: { type: "laser", name: "Laser Prismático Nível 4", damagePerSecond: 140, heatGain: 25, coolRate: 33, overheatCoolRate: 46 },
    raio_solar_experimental: { type: "laser", name: "Raio Solar Experimental", damagePerSecond: 220, heatGain: 22, coolRate: 36, overheatCoolRate: 52 },

    pulso_eletromagnetico_omega: { type: "emp", name: "Pulso Eletromagnético", damage: 500, reload: 2000, disableTime: 3000 }
  },

  shieldCatalog: {
    escudo_civil_basico: { capacity: 100, absorption: 0.45 },
    escudo_reforcado_mk_ii: { capacity: 180, absorption: 0.52 },
    escudo_energetico_mk_iii: { capacity: 300, absorption: 0.60 },
    escudo_fusao_mk_iv: { capacity: 450, absorption: 0.68 },
    barreira_quantica_estelar: { capacity: 700, absorption: 0.78 }
  },

  getBattleConfig() {
    return CONFIG.BATTLE || {
      difficultyGrowthPercent: 12,
      baseEnemy: { hp: 240, shield: 120, damage: 32 },
      rewards: { baseGold: 180, perDifficulty: 45, perBattle: 25 }
    };
  },

  getHighestPurchasedFromCategory(categoryId) {
    const category = ShopModules[categoryId];
    if (!category) return null;

    let highest = null;
    category.items.forEach((item) => {
      if (!GameState.purchasedItems[item.id]) return;
      if (!highest || item.level > highest.level) highest = item;
    });

    return highest;
  },

  getActiveWeapon() {
    const selected = this.weaponCatalog[GameState.activeWeaponId];
    if (selected) return selected;

    const cannon = this.getHighestPurchasedFromCategory("cannon");
    if (cannon && this.weaponCatalog[cannon.id]) return this.weaponCatalog[cannon.id];

    return this.weaponCatalog.canhao_balistico_mk_i;
  },

  getActiveHelper() {
    const helperCategory = ShopModules.helpers;
    if (!helperCategory || !GameState.activeHelperId) return null;
    if (!GameState.purchasedItems[GameState.activeHelperId]) return null;
    return helperCategory.items.find((item) => item.id === GameState.activeHelperId) || null;
  },

  getHelperMultiplier(type) {
    const helper = this.getActiveHelper();
    if (!helper || helper.bonusType !== type) return 1;
    return 1 + (helper.bonusPercent || 0) / 100;
  },

  applyPlayerDamageBonus(rawDamage) {
    return Math.round(rawDamage * this.getHelperMultiplier("damage"));
  },

  getPlayerShieldStats() {
    const shield = this.getHighestPurchasedFromCategory("shield");
    if (shield && this.shieldCatalog[shield.id]) return this.shieldCatalog[shield.id];
    return this.shieldCatalog.escudo_civil_basico;
  },

  preparePlayerForBattle() {
    const propulsion = this.getHighestPurchasedFromCategory("propulsion");
    const shieldStats = this.getPlayerShieldStats();

    const baseHp = propulsion ? this.extractNumber(propulsion.stats, "Vida", 100) : 100;
    const maxHp = Math.round(baseHp * this.getHelperMultiplier("hp"));
    const maxShield = Math.round(shieldStats.capacity * this.getHelperMultiplier("shield"));

    GameState.player.maxHp = maxHp;
    GameState.player.hp = maxHp;

    GameState.player.maxShield = maxShield;
    GameState.player.shield = maxShield;
  },

  createEnemy() {
    const config = this.getBattleConfig();
    const destination = TravelSystem.getDestination();
    const difficulty = destination?.difficulty || 1;
    const battlesWon = GameState.battlesWon || 0;
    const growth = 1 + ((config.difficultyGrowthPercent || 0) / 100) * battlesWon;
    const planetMultiplier = 1 + (difficulty - 1) * 0.12;
    const multiplier = growth * planetMultiplier;

    return {
      name: "NAVE HOSTIL",
      hp: Math.round(config.baseEnemy.hp * multiplier),
      maxHp: Math.round(config.baseEnemy.hp * multiplier),
      shield: Math.round(config.baseEnemy.shield * multiplier),
      maxShield: Math.round(config.baseEnemy.shield * multiplier),
      shieldAbsorption: 0.5,
      damage: Math.round(config.baseEnemy.damage * multiplier),
      attackCooldown: Math.max(900, 2100 - difficulty * 90),
      attackTimer: 900,
      disabledTimer: 0,
      difficultyMultiplier: multiplier
    };
  },

  extractNumber(stats, label, fallback) {
    const line = stats.find((stat) => stat.toLowerCase().startsWith(label.toLowerCase()));
    if (!line) return fallback;

    const match = line.match(/\d+/);
    return match ? Number(match[0]) : fallback;
  },

  applyDamage(target, rawDamage, shieldAbsorption = 0.5) {
    const damage = Math.max(0, Math.round(rawDamage));
    let shieldDamage = 0;
    let hpDamage = damage;

    if (target.shield > 0) {
      shieldDamage = Math.min(target.shield, Math.round(damage * shieldAbsorption));
      target.shield -= shieldDamage;
      hpDamage = damage - shieldDamage;
    }

    target.hp = Math.max(0, target.hp - hpDamage);

    return {
      total: damage,
      shield: shieldDamage,
      hull: hpDamage
    };
  },

  getAccuracyResult(accuracy) {
    const distance = Math.abs(accuracy);

    if (distance <= 0.055) {
      return { label: "CRÍTICO", multiplier: 1.85, hit: true };
    }

    if (distance <= 0.18) {
      return { label: "DANO ALTO", multiplier: 1.35, hit: true };
    }

    if (distance <= 0.36) {
      return { label: "ACERTO", multiplier: 1.0, hit: true };
    }

    if (distance <= 0.48) {
      return { label: "DE RASPÃO", multiplier: 0.55, hit: true };
    }

    return { label: "ERROU", multiplier: 0, hit: false };
  },

  calculateReward(enemy) {
    const config = this.getBattleConfig();
    const destination = TravelSystem.getDestination();
    const difficulty = destination?.difficulty || 1;
    const battlesWon = GameState.battlesWon || 0;

    return Math.round(
      config.rewards.baseGold +
      difficulty * config.rewards.perDifficulty +
      battlesWon * config.rewards.perBattle +
      enemy.maxHp * 0.08
    );
  }
};
