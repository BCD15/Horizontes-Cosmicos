const Player = {
  x: 400,
  y: 250,

  width: 110,
  height: 110,

  speed: CONFIG.PLAYER.SPEED,

  sprite: null,

  // INCLINAÇÃO
  angle: 0,
  maxAngle: 6,

  // CONTROLE DE TEMPO
  tiltDirection: 1,
  tiltTimer: 0,

  // TROCA A CADA 120ms
  tiltInterval: 180,

  init() {
    this.sprite = AssetLoader.getImage("player");

    this.x = CONFIG.GAME_WIDTH / 2 - this.width / 2;
    this.y = CONFIG.GAME_HEIGHT / 2 - this.height / 2;
  },

  update(deltaTime) {
    if (
      GameState.dialogueActive ||
      ChoiceMenu.active ||
      ShopMenu.active ||
      InventoryUI.active ||
      PauseMenu.active
    ) {
      return;
    }

    let isMoving = false;

    // ESQUERDA
    if (Input.isDown("a") || Input.isDown("arrowleft")) {
      this.x -= this.speed;
      isMoving = true;
    }

    // DIREITA
    if (Input.isDown("d") || Input.isDown("arrowright")) {
      this.x += this.speed;
      isMoving = true;
    }

    // CIMA
    if (Input.isDown("w") || Input.isDown("arrowup")) {
      this.y -= this.speed;
      isMoving = true;
    }

    // BAIXO
    if (Input.isDown("s") || Input.isDown("arrowdown")) {
      this.y += this.speed;
      isMoving = true;
    }

    // ANIMAÇÃO DE INCLINAÇÃO
    if (isMoving) {
      this.tiltTimer += deltaTime;

      if (this.tiltTimer >= this.tiltInterval) {
        this.tiltDirection *= -1;
        this.tiltTimer = 0;
      }

      this.angle = this.maxAngle * this.tiltDirection;
    } else {
      this.angle = 0;
      this.tiltTimer = 0;
      this.tiltDirection = 1;
    }

    // LIMITES
    this.x = Math.max(
      0,
      Math.min(CONFIG.GAME_WIDTH - this.width, this.x)
    );

    this.y = Math.max(
      0,
      Math.min(CONFIG.GAME_HEIGHT - this.height, this.y)
    );
  },

  draw(ctx) {
    if (!this.sprite) {
      ctx.fillStyle = "#ffb703";

      ctx.fillRect(
        this.x,
        this.y,
        this.width,
        this.height
      );

      return;
    }

    ctx.save();

    // CENTRALIZA
    ctx.translate(
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    // ROTAÇÃO
    ctx.rotate(this.angle * Math.PI / 180);

    // DESENHA
    ctx.drawImage(
      this.sprite,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();
  }
};