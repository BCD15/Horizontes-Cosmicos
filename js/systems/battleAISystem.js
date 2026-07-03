const BattleAISystem = {
  update(deltaTime, battle) {
    if (!battle.enemy || battle.state !== "fighting") return;

    if (battle.enemy.disabledTimer > 0) {
      battle.enemy.disabledTimer = Math.max(0, battle.enemy.disabledTimer - deltaTime);
      return;
    }

    battle.enemy.attackTimer -= deltaTime;

    if (battle.enemy.attackTimer > 0) return;

    battle.enemy.attackTimer = battle.enemy.attackCooldown;
    this.fireAtPlayer(battle);
  },

  fireAtPlayer(battle) {
    const variation = 0.85 + Math.random() * 0.35;
    const damage = Math.round(battle.enemy.damage * variation);
    const shieldStats = CombatSystem.getPlayerShieldStats();
    const result = CombatSystem.applyDamage(GameState.player, damage, shieldStats.absorption);

    if (AudioManager) {
      AudioManager.playSFX("som_tiro1", 0.5);
    }

    battle.spawnProjectile("enemy", damage);
    battle.addFloatingText(
      `INIMIGO: -${result.total}`,
      battle.playerShip.x + 70,
      battle.playerShip.y - 22,
      "#ff6b6b"
    );
    battle.message = `A nave hostil causou ${result.total} de dano.`;

    if (GameState.player.hp <= 0) {
      battle.finishBattle(false);
    }
  }
};
