const BattleScene = {
  buttons: [],
  timer: 0,
  stars: [],
  enemy: null,
  weapon: null,
  aimValue: 0,
  aimDirection: 1,
  aimSpeed: 0.0018,
  reloadTimer: 0,
  laserHeat: 0,
  laserCharge: 100,
  laserOverheated: false,
  laserRecharging: false,
  laserDamageBuffer: 0,
  previousSpace: false,
  message: "Mire no centro e pressione ESPAÇO para disparar.",
  resultText: "",
  rewardGold: 0,
  state: "fighting",
  pendingBattleResult: null,
  finishDelayTimer: 0,
  projectileSpeed: 0.00115,
  projectiles: [],
  floatingTexts: [],
  playerShip: { x: 160, y: 510, width: 150, height: 66 },
  enemyShip: { x: 940, y: 145, width: 160, height: 72 },

  enter() {
    this.buttons = [];
    this.timer = 0;
    this.stars = [];
    this.projectiles = [];
    this.floatingTexts = [];
    this.aimValue = 0;
    this.aimDirection = 1;
    this.reloadTimer = 0;
    this.laserHeat = 0;
    this.laserCharge = 100;
    this.laserOverheated = false;
    this.laserRecharging = false;
    this.laserDamageBuffer = 0;
    this.previousSpace = false;
    this.message = "Mire no centro e pressione ESPAÇO para disparar.";
    this.resultText = "";
    this.rewardGold = 0;
    this.state = "fighting";
    this.pendingBattleResult = null;
    this.finishDelayTimer = 0;

    CombatSystem.preparePlayerForBattle();
    this.enemy = CombatSystem.createEnemy();
    this.weapon = CombatSystem.getActiveWeapon();

    if (this.weapon.type === "laser") {
      this.message = "Segure ESPAÇO para manter o laser. Cuidado com o superaquecimento.";
    }

    if (this.weapon.type === "emp") {
      this.message = "Acerte o centro para desabilitar a arma inimiga por mais tempo.";
    }

    for (let i = 0; i < 140; i++) {
      this.stars.push({
        x: Math.random() * CONFIG.GAME_WIDTH,
        y: Math.random() * CONFIG.GAME_HEIGHT,
        size: Math.random() > 0.86 ? 2 : 1,
        speed: 0.2 + Math.random() * 0.7
      });
    }
  },

  update(deltaTime) {
    this.timer += deltaTime;
    this.updateStars();
    this.updateProjectiles(deltaTime);
    this.updateFloatingTexts(deltaTime);

    if (this.state === "ending") {
      this.updateBattleEnding(deltaTime);
      return;
    }

    if (this.state !== "fighting") return;

    this.reloadTimer = Math.max(0, this.reloadTimer - deltaTime);
    this.updateAim(deltaTime);
    this.updateWeapon(deltaTime);
    BattleAISystem.update(deltaTime, this);
  },

  updateStars() {
    this.stars.forEach((star) => {
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = CONFIG.GAME_WIDTH;
        star.y = Math.random() * CONFIG.GAME_HEIGHT;
      }
    });
  },

  updateAim(deltaTime) {
    if (this.isLaserFiring()) return;

    this.aimValue += this.aimDirection * this.aimSpeed * deltaTime;

    if (this.aimValue >= 1) {
      this.aimValue = 1;
      this.aimDirection = -1;
    }

    if (this.aimValue <= -1) {
      this.aimValue = -1;
      this.aimDirection = 1;
    }
  },

  isSpaceDown() {
    return Input.isDown(" ") || Input.isDown("space") || Input.isDown("spacebar");
  },

  isLaserFiring() {
    return (
      this.weapon &&
      this.weapon.type === "laser" &&
      this.state === "fighting" &&
      this.isSpaceDown() &&
      !this.laserOverheated &&
      !this.laserRecharging &&
      this.laserCharge > 0
    );
  },

  updateWeapon(deltaTime) {
    const spaceDown = this.isSpaceDown();
    const spacePressed = spaceDown && !this.previousSpace;

    if (this.weapon.type === "cannon" && spacePressed) {
      this.fireSingleShot();
    }

    if (this.weapon.type === "emp" && spacePressed) {
      this.fireEmpShot();
    }

    if (this.weapon.type === "laser") {
      this.updateLaser(deltaTime, spaceDown);
    }

    this.previousSpace = spaceDown;
  },

  fireSingleShot() {
    if (this.reloadTimer > 0) {
      this.message = "Arma recarregando.";
      return;
    }

    const result = CombatSystem.getAccuracyResult(this.aimValue);
    this.reloadTimer = this.weapon.reload;

    if (!result.hit) {
      this.spawnProjectile("player", 0, true);
      this.message = "Tiro passou fora da área de precisão. Errou a nave.";
      this.addFloatingText("ERROU", this.enemyShip.x + 80, this.enemyShip.y - 24, "#ffffff");
      return;
    }

    const damage = CombatSystem.applyPlayerDamageBonus(this.weapon.damage * result.multiplier);
    const applied = CombatSystem.applyDamage(this.enemy, damage, this.enemy.shieldAbsorption);

    this.spawnProjectile("player", damage);
    this.message = `${result.label}: ${applied.total} de dano.`;
    this.addFloatingText(`${result.label} -${applied.total}`, this.enemyShip.x + 80, this.enemyShip.y - 24, "#fff176");
    this.checkEnemyDefeated();
  },

  fireEmpShot() {
    if (this.reloadTimer > 0) {
      this.message = "Pulso eletromagnético recarregando.";
      return;
    }

    const result = CombatSystem.getAccuracyResult(this.aimValue);
    this.reloadTimer = this.weapon.reload;

    if (!result.hit) {
      this.spawnProjectile("player", 0, true);
      this.message = "Pulso eletromagnético falhou o alvo.";
      this.addFloatingText("ERROU", this.enemyShip.x + 80, this.enemyShip.y - 24, "#ffffff");
      return;
    }

    const damage = CombatSystem.applyPlayerDamageBonus(this.weapon.damage * result.multiplier);
    const disableBonus = result.label === "CRÍTICO" ? 1.6 : result.label === "DANO ALTO" ? 1.25 : 1;
    const disabledMs = Math.round(this.weapon.disableTime * disableBonus);
    const applied = CombatSystem.applyDamage(this.enemy, damage, this.enemy.shieldAbsorption);

    this.enemy.disabledTimer = Math.max(this.enemy.disabledTimer, disabledMs);
    this.spawnProjectile("player", damage);
    this.message = `${result.label}: inimigo desabilitado por ${(disabledMs / 1000).toFixed(1)}s.`;
    this.addFloatingText(`EMP -${applied.total}`, this.enemyShip.x + 80, this.enemyShip.y - 24, "#80deea");
    this.checkEnemyDefeated();
  },

  updateLaser(deltaTime, spaceDown) {
    const seconds = deltaTime / 1000;

    if (this.laserOverheated || this.laserRecharging) {
      const rechargeRate = this.laserOverheated ? this.weapon.overheatCoolRate : this.weapon.coolRate;
      this.laserCharge = Math.min(100, this.laserCharge + rechargeRate * seconds);

      if (this.laserCharge >= 100) {
        this.laserCharge = 100;
        this.laserOverheated = false;
        this.laserRecharging = false;
        this.laserDamageBuffer = 0;
        this.message = "Laser 100% carregado. Segure ESPAÇO para disparar.";
      } else {
        this.message = `Laser recarregando: ${Math.floor(this.laserCharge)}%. Aguarde 100%.`;
      }
      return;
    }

    if (!spaceDown) {
      if (this.laserCharge < 100) {
        this.laserRecharging = true;
        this.message = "Laser recarregando. Só dispara novamente com 100%.";
      }
      return;
    }

    if (this.laserCharge < 100 && !this.isLaserFiring()) {
      this.laserRecharging = true;
      this.message = "Laser ainda não carregou 100%.";
      return;
    }

    const result = CombatSystem.getAccuracyResult(this.aimValue);
    this.laserCharge = Math.max(0, this.laserCharge - this.weapon.heatGain * seconds);

    if (this.laserCharge <= 0) {
      this.laserCharge = 0;
      this.laserOverheated = true;
      this.message = "Laser descarregou/superaqueceu. Aguarde carregar 100%.";
    }

    if (!result.hit) {
      this.message = "Laser fora da área de precisão. Ajuste a mira para causar dano.";
      return;
    }

    const rawDamage = this.weapon.damagePerSecond * result.multiplier * seconds * CombatSystem.getHelperMultiplier("damage");
    this.laserDamageBuffer += rawDamage;

    if (this.laserDamageBuffer >= 1) {
      const damageToApply = Math.floor(this.laserDamageBuffer);
      this.laserDamageBuffer -= damageToApply;
      const applied = CombatSystem.applyDamage(this.enemy, damageToApply, this.enemy.shieldAbsorption);

      if (this.timer % 160 < deltaTime) {
        this.addFloatingText(
          `-${applied.total}`,
          this.enemyShip.x + 70 + Math.random() * 35,
          this.enemyShip.y - 10,
          "#ffeb3b"
        );
      }
    }

    this.message = `${result.label}: laser causando dano contínuo.`;
    this.checkEnemyDefeated();
  },

  checkEnemyDefeated() {
    if (this.enemy.hp <= 0) {
      this.finishBattle(true);
    }
  },

  finishBattle(playerWon) {
    if (this.state !== "fighting") return;

    this.state = "ending";
    this.finishDelayTimer = playerWon ? 650 : 500;
    this.pendingBattleResult = { playerWon };

    if (playerWon) {
      this.message = "Impacto confirmado. Finalizando batalha...";
      return;
    }

    this.message = "Sua nave foi atingida. Finalizando batalha...";
  },

  updateBattleEnding(deltaTime) {
    this.finishDelayTimer = Math.max(0, this.finishDelayTimer - deltaTime);

    if (this.finishDelayTimer > 0 || this.projectiles.length > 0) return;

    const playerWon = this.pendingBattleResult?.playerWon;
    this.pendingBattleResult = null;

    if (playerWon) {
      this.state = "victory";
      this.rewardGold = CombatSystem.calculateReward(this.enemy);
      GameState.gold += this.rewardGold;
      GameState.battlesWon = (GameState.battlesWon || 0) + 1;
      this.resultText = `VITÓRIA! +${this.rewardGold} OURO`;
      this.message = "Batalha vencida. Continue viagem para chegar ao planeta.";
      return;
    }

    this.state = "defeat";
    this.resultText = "DERROTA";
    this.message = "Sua nave foi destruída. Volte para a colônia e tente novamente.";
  },

  spawnProjectile(origin, damage, miss = false) {
    const from = origin === "player" ? this.getPlayerGunPoint() : this.getEnemyGunPoint();
    const to = origin === "player" ? this.getEnemyCenter() : this.getPlayerCenter();

    this.projectiles.push({
      x: from.x,
      y: from.y,
      from,
      to: miss ? { x: to.x + 110, y: to.y + 90 } : to,
      progress: 0,
      speed: this.projectileSpeed,
      origin,
      damage,
      pulse: Math.random() * Math.PI * 2
    });
  },

  updateProjectiles(deltaTime) {
    this.projectiles.forEach((projectile) => {
      projectile.progress += projectile.speed * deltaTime;
      projectile.x = projectile.from.x + (projectile.to.x - projectile.from.x) * projectile.progress;
      projectile.y = projectile.from.y + (projectile.to.y - projectile.from.y) * projectile.progress;
    });

    this.projectiles = this.projectiles.filter((projectile) => projectile.progress < 1);
  },

  addFloatingText(text, x, y, color) {
    this.floatingTexts.push({ text, x, y, color, life: 900, maxLife: 900 });
  },

  updateFloatingTexts(deltaTime) {
    this.floatingTexts.forEach((item) => {
      item.life -= deltaTime;
      item.y -= 0.035 * deltaTime;
    });

    this.floatingTexts = this.floatingTexts.filter((item) => item.life > 0);
  },

  getPlayerCenter() {
    return { x: this.playerShip.x + this.playerShip.width / 2, y: this.playerShip.y + this.playerShip.height / 2 };
  },

  getEnemyCenter() {
    return { x: this.enemyShip.x + this.enemyShip.width / 2, y: this.enemyShip.y + this.enemyShip.height / 2 };
  },

  getPlayerGunPoint() {
    return { x: this.playerShip.x + this.playerShip.width, y: this.playerShip.y + 20 };
  },

  getEnemyGunPoint() {
    return { x: this.enemyShip.x, y: this.enemyShip.y + 48 };
  },

  handleClick(mouseX, mouseY) {
    for (const button of this.buttons) {
      const clicked =
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height;

      if (!clicked) continue;

      if (button.action === "continue") {
        TravelSystem.completeTravel();
        return true;
      }

      if (button.action === "retry") {
        GameState.player.hp = GameState.player.maxHp;
        GameState.player.shield = GameState.player.maxShield;
        SceneManager.change("battle");
        return true;
      }

      if (button.action === "map") {
        TravelSystem.cancelTravel();
        return true;
      }
    }

    return false;
  },

  draw(ctx) {
    this.buttons = [];
    this.drawBackground(ctx);
    this.drawShips(ctx);
    this.drawProjectiles(ctx);
    this.drawLaserBeam(ctx);
    this.drawFloatingTexts(ctx);
    this.drawBattleHud(ctx);
    this.drawAimBar(ctx);
    this.drawInstructionPanel(ctx);
    this.drawResultPanel(ctx);
  },

  drawBackground(ctx) {
    const destination = TravelSystem.getDestination();
    const gradient = ctx.createLinearGradient(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    gradient.addColorStop(0, "#050617");
    gradient.addColorStop(1, "#101832");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    this.stars.forEach((star) => {
      ctx.fillStyle = "rgba(150, 210, 255, 0.8)";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    if (destination) {
      ctx.fillStyle = destination.color;
      ctx.beginPath();
      ctx.arc(1120, 120, 72, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  drawShips(ctx) {
    this.drawPlayerShip(ctx, this.playerShip.x, this.playerShip.y);
    this.drawEnemyShip(ctx, this.enemyShip.x, this.enemyShip.y);
  },

  drawPlayerShip(ctx, x, y) {
    ctx.fillStyle = "#d62828";
    ctx.fillRect(x, y, 126, 48);
    ctx.fillStyle = "#f77f00";
    ctx.fillRect(x + 88, y - 18, 54, 84);
    ctx.fillStyle = "#003049";
    ctx.fillRect(x + 18, y + 9, 42, 18);
    ctx.fillStyle = "#ffba08";
    ctx.fillRect(x - 18, y + 15, 28, 18);
  },

  drawEnemyShip(ctx, x, y) {
    const disabled = this.enemy.disabledTimer > 0;
    ctx.fillStyle = disabled ? "#476a7a" : "#6c757d";
    ctx.fillRect(x, y, 138, 52);
    ctx.fillStyle = disabled ? "#28505d" : "#343a40";
    ctx.fillRect(x - 30, y - 12, 70, 76);
    ctx.fillStyle = disabled ? "#80deea" : "#9d0208";
    ctx.fillRect(x + 75, y + 13, 46, 16);

    if (disabled) {
      PixelUI.drawCenteredText(ctx, "DESABILITADA", x + 70, y + 88, 8);
    }
  },

  drawProjectiles(ctx) {
    this.projectiles.forEach((projectile) => {
      const color = projectile.origin === "player" ? "#ffeb3b" : "#ff5252";
      const trailX = projectile.from.x + (projectile.x - projectile.from.x) * 0.86;
      const trailY = projectile.from.y + (projectile.y - projectile.from.y) * 0.86;

      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(projectile.x, projectile.y);
      ctx.stroke();

      ctx.globalAlpha = 0.82;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(projectile.x, projectile.y);
      ctx.stroke();

      ctx.globalAlpha = 0.95;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 14 + Math.sin(this.timer / 70 + projectile.pulse) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  },

  drawLaserBeam(ctx) {
    if (this.weapon.type !== "laser" || this.state !== "fighting") return;
    if (!this.isLaserFiring()) return;

    const result = CombatSystem.getAccuracyResult(this.aimValue);
    if (!result.hit) return;

    const from = this.getPlayerGunPoint();
    const to = this.getEnemyCenter();

    ctx.save();
    const beamWidth = result.label === "CRÍTICO" ? 9 : 6;
    ctx.strokeStyle = result.label === "CRÍTICO" ? "#fff176" : "#64b5f6";
    ctx.lineWidth = beamWidth + Math.sin(this.timer / 45) * 1.5;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.globalAlpha = 0.92;
    ctx.strokeStyle = "#e3f2fd";
    ctx.lineWidth = Math.max(2, beamWidth / 2);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.fillStyle = result.label === "CRÍTICO" ? "#fff176" : "#90caf9";
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(to.x, to.y, 16 + Math.sin(this.timer / 35) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawFloatingTexts(ctx) {
    this.floatingTexts.forEach((item) => {
      ctx.globalAlpha = Math.max(0, item.life / item.maxLife);
      ctx.fillStyle = item.color;
      ctx.font = PixelUI.font(9);
      ctx.textAlign = "center";
      ctx.fillText(item.text, item.x, item.y);
      ctx.globalAlpha = 1;
    });
  },

  drawBattleHud(ctx) {
    const destination = TravelSystem.getDestination();
    const origin = TravelSystem.getOrigin();

    this.drawShipPanel(ctx, 18, 18, "NAVE AURORA", GameState.player.hp, GameState.player.maxHp, GameState.player.shield, GameState.player.maxShield);
    this.drawShipPanel(ctx, 842, 18, "NAVE HOSTIL", this.enemy.hp, this.enemy.maxHp, this.enemy.shield, this.enemy.maxShield);

    PixelUI.drawTitleTab(ctx, 385, 20, 510, 58, "BATALHA ESPACIAL");

    if (destination && origin) {
      PixelUI.drawPanel(ctx, 398, 96, 485, 76);
      PixelUI.drawCenteredText(ctx, `${origin.name.toUpperCase()}  >  ${destination.name.toUpperCase()}`, 640, 124, 9);
      PixelUI.drawCenteredText(ctx, `ARMA: ${this.weapon.name.toUpperCase()}`, 640, 151, 8);
    }
  },

  drawShipPanel(ctx, x, y, title, hp, maxHp, shield, maxShield) {
    PixelUI.drawPanel(ctx, x, y, 420, 128);
    PixelUI.drawCenteredText(ctx, title, x + 210, y + 28, 12);
    this.drawBar(ctx, x + 42, y + 55, 336, 18, hp, maxHp, "VIDA");
    this.drawBar(ctx, x + 42, y + 88, 336, 18, shield, maxShield, "ESCUDO");
  },

  drawBar(ctx, x, y, width, height, value, max, label) {
    const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));

    ctx.fillStyle = "#211a28";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = label === "VIDA" ? "#d62828" : "#2ec4b6";
    ctx.fillRect(x, y, width * ratio, height);
    ctx.strokeStyle = PixelUI.colors.borderDark;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    PixelUI.drawCenteredText(ctx, `${label}: ${Math.ceil(value)}/${max}`, x + width / 2, y + height / 2 + 1, 7);
  },

  drawAimBar(ctx) {
    if (this.state !== "fighting") return;

    const x = 330;
    const y = 548;
    const width = 620;
    const height = 38;
    const centerX = x + width / 2;
    const markerX = centerX + this.aimValue * (width / 2);

    PixelUI.drawPanel(ctx, x - 26, y - 50, width + 52, 130);
    PixelUI.drawCenteredText(ctx, this.isLaserFiring() ? "LASER DISPARANDO - MIRA TRAVADA" : "MIRA DE PRECISÃO", centerX, y - 24, 10);

    ctx.fillStyle = "#2a1722";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#8d99ae";
    ctx.fillRect(x, y, width * 0.26, height);
    ctx.fillRect(x + width * 0.74, y, width * 0.26, height);

    ctx.fillStyle = "#f4a261";
    ctx.fillRect(x + width * 0.32, y, width * 0.36, height);

    ctx.fillStyle = "#ffe066";
    ctx.fillRect(x + width * 0.44, y, width * 0.12, height);

    ctx.fillStyle = "#ef233c";
    ctx.fillRect(centerX - 12, y - 6, 24, height + 12);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(markerX, y - 10);
    ctx.lineTo(markerX, y + height + 10);
    ctx.stroke();

    PixelUI.drawCenteredText(ctx, "ERRO", x + 70, y + 62, 7);
    PixelUI.drawCenteredText(ctx, "DANO ALTO", centerX, y + 62, 7);
    PixelUI.drawCenteredText(ctx, "CRÍTICO", centerX, y - 1, 7);
    PixelUI.drawCenteredText(ctx, "ERRO", x + width - 70, y + 62, 7);
  },

  drawInstructionPanel(ctx) {
    const x = 322;
    const y = 608;
    const width = 636;
    const height = 82;

    PixelUI.drawPanel(ctx, x, y, width, height);
    PixelUI.drawCenteredText(ctx, this.message, x + width / 2, y + 28, 8);

    if (this.weapon.type === "cannon" || this.weapon.type === "emp") {
      const reloadPercent = this.weapon.reload ? 1 - this.reloadTimer / this.weapon.reload : 1;
      this.drawSmallMeter(ctx, x + 76, y + 50, 484, 14, reloadPercent, "RECARGA");
      PixelUI.drawCenteredText(ctx, "PRESSIONE ESPAÇO PARA DISPARAR", x + width / 2, y + 72, 7);
    }

    if (this.weapon.type === "laser") {
      this.drawSmallMeter(ctx, x + 76, y + 50, 484, 14, this.laserCharge / 100, "CARGA");
      PixelUI.drawCenteredText(ctx, "SEGURE ESPAÇO | SÓ DISPARA NOVAMENTE COM 100%", x + width / 2, y + 72, 7);
    }
  },

  drawSmallMeter(ctx, x, y, width, height, ratio, label) {
    ratio = Math.max(0, Math.min(1, ratio));
    ctx.fillStyle = "#211a28";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#ffba08";
    ctx.fillRect(x, y, width * ratio, height);
    ctx.strokeStyle = PixelUI.colors.borderDark;
    ctx.strokeRect(x, y, width, height);
    PixelUI.drawCenteredText(ctx, label, x - 36, y + 8, 6);
  },

  drawResultPanel(ctx) {
    if (this.state === "fighting" || this.state === "ending") return;

    const width = 560;
    const height = 220;
    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2;

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    PixelUI.drawPanel(ctx, x, y, width, height);
    PixelUI.drawCenteredText(ctx, this.resultText, x + width / 2, y + 48, 15);
    PixelUI.drawCenteredText(ctx, this.message, x + width / 2, y + 88, 8);

    if (this.state === "victory") {
      this.buttons.push({ x: x + 80, y: y + 128, width: 400, height: 52, action: "continue" });
      PixelUI.drawButton(ctx, x + 80, y + 128, 400, 52, "CONTINUAR VIAGEM");
      return;
    }

    this.buttons.push({ x: x + 70, y: y + 118, width: 200, height: 52, action: "retry" });
    this.buttons.push({ x: x + 290, y: y + 118, width: 200, height: 52, action: "map" });
    PixelUI.drawButton(ctx, x + 70, y + 118, 200, 52, "TENTAR");
    PixelUI.drawButton(ctx, x + 290, y + 118, 200, 52, "MAPA");
  }
};

SceneManager.register("battle", BattleScene);
