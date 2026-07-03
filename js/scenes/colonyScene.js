const ColonyScene = {
  currentPlanet: null,

  enter() {
    this.currentPlanet = Planets[GameState.currentPlanet] || Planets.terra;

    Player.x = 400;
    Player.y = 250;

    AudioManager.playBGM("bgm_colony", 0.2);
  },

  update(deltaTime) {
    ChoiceMenu.update();
    ShopMenu.update();
    InventoryUI.update();

    if (!PauseMenu.active && !InventoryUI.active) {
      Player.update(deltaTime);
    }

    if (
      !GameState.dialogueActive &&
      !ChoiceMenu.active &&
      !ShopMenu.active &&
      !InventoryUI.active &&
      !PauseMenu.active &&
      Input.isDown("e")
    ) {
      InteractionSystem.interactWithNearestNPC(
        Player,
        this.currentPlanet.npcs
      );
    }
  },

  draw(ctx) {
    this.drawBackground(ctx);
    this.drawColonyInfo(ctx);
    this.drawNPCs(ctx);

    Player.draw(ctx);

    ChoiceMenu.draw(ctx);
    ShopMenu.draw(ctx);
    InventoryUI.draw(ctx);
    PauseMenu.draw(ctx);

    this.drawInteractionHint(ctx);
  },

  drawBackground(ctx) {
    const bg = AssetLoader.getImage("backgroundTerra");
    const isTerra = this.currentPlanet && this.currentPlanet.id === "terra";

    if (isTerra && bg) {
      ctx.drawImage(bg, 0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
      return;
    }

    const isOrbital = this.currentPlanet.travelMode === "orbita";

    ctx.fillStyle = isOrbital ? "#080b1f" : "#14213d";
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    if (isOrbital) {
      this.drawOrbitalStation(ctx);
      return;
    }

    this.drawGrid(ctx);
  },

  drawOrbitalStation(ctx) {
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let i = 0; i < 90; i++) {
      const x = (i * 131) % CONFIG.GAME_WIDTH;
      const y = (i * 73) % CONFIG.GAME_HEIGHT;
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.fillStyle = "#1f2937";
    ctx.fillRect(160, 130, 960, 460);

    ctx.fillStyle = "#374151";
    ctx.fillRect(210, 180, 860, 360);

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 4;
    ctx.strokeRect(210, 180, 860, 360);
  },

  drawGrid(ctx) {
    ctx.strokeStyle = "rgba(255,255,255,0.05)";

    for (let x = 0; x < CONFIG.GAME_WIDTH; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CONFIG.GAME_HEIGHT);
      ctx.stroke();
    }

    for (let y = 0; y < CONFIG.GAME_HEIGHT; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CONFIG.GAME_WIDTH, y);
      ctx.stroke();
    }
  },

  drawColonyInfo(ctx) {
    StatusPanel.draw(ctx, this.currentPlanet.colonyName);
  },

  drawNPCs(ctx) {
    this.currentPlanet.npcs.forEach((npc) => {
      if (npc.type === "ship") {
        this.drawAurora(ctx, npc);
        return;
      }

      if (npc.type === "helper") {
        this.drawHelper(ctx, npc);
        return;
      }

      const image = npc.spriteKey ? AssetLoader.getImage(npc.spriteKey) : null;

      if (image) {
        ctx.drawImage(image, npc.x, npc.y, npc.width, npc.height);
      } else {
        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = '9px "Press Start 2P"';
      ctx.fillText(npc.name, npc.x - 10, npc.y - 10);
    });
  },

  getActiveHelperData() {
    const helpers = ShopModules.helpers?.items || [];
    return helpers.find((helper) => helper.id === GameState.activeHelperId) || null;
  },

  drawHelper(ctx, npc) {
    const helper = this.getActiveHelperData();
    const image = helper ? AssetLoader.getImage(helper.imageKey) : null;
    const label = helper ? helper.title : "Ajudante";

    if (image) {
      ctx.drawImage(image, npc.x - 8, npc.y - 18, 85, 85);
    } else {
      const defaultImage = AssetLoader.getImage("ajudante_default");

      if (defaultImage) {
        ctx.drawImage(defaultImage, npc.x - 8, npc.y - 18, 85, 85);
      } else {
        ctx.fillStyle = helper?.color || npc.color;
        ctx.fillRect(npc.x, npc.y, npc.width, npc.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(npc.x + 7, npc.y + 6, 6, 6);
        ctx.fillRect(npc.x + 21, npc.y + 6, 6, 6);

        ctx.fillStyle = "#1f2937";
        ctx.fillRect(npc.x + 10, npc.y + 24, 14, 5);
      }
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = '9px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText(label, npc.x + npc.width / 2, npc.y - 24);
    ctx.fillText("ENGENHEIROS", npc.x + npc.width / 2, npc.y + npc.height + 18);
    ctx.textAlign = "left";
  },

  drawAurora(ctx, npc) {
    const image = npc.spriteKey ? AssetLoader.getImage(npc.spriteKey) : null;

    if (image) {
      ctx.drawImage(image, npc.x + 16, npc.y - 10, 150, 150);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = '9px "Press Start 2P"';
      ctx.textAlign = "center";
      ctx.fillText("Nave Aurora", npc.x + npc.width / 2, npc.y - 15);
      ctx.textAlign = "left"; // Restaura o alinhamento
      
    } else {
      ctx.fillStyle = "#a4161a";
      ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
      ctx.fillStyle = "#d62828";
      ctx.fillRect(npc.x + 16, npc.y - 10, npc.width - 26, npc.height + 20);
      ctx.fillStyle = "#003049";
      ctx.fillRect(npc.x + 22, npc.y + 12, 24, 12);
      ctx.fillStyle = "#ffba08";
      ctx.fillRect(npc.x - 12, npc.y + 15, 14, 15);

      ctx.fillStyle = "#ffffff";
      ctx.font = '9px "Press Start 2P"';
      ctx.fillText("Nave Aurora", npc.x - 20, npc.y - 22);
    }
  },

  drawInteractionHint(ctx) {
    const npc = InteractionSystem.getNearestNPC(
      Player,
      this.currentPlanet.npcs
    );

    if (
      !npc ||
      GameState.dialogueActive ||
      ChoiceMenu.active ||
      ShopMenu.active ||
      InventoryUI.active ||
      PauseMenu.active
    ) {
      return;
    }

    const width = 620;
    const height = 90;

    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT - 130;

    PixelUI.drawPanel(ctx, x, y, width, height);

    const text = npc.type === "ship"
      ? "PRESSIONE E PARA ACESSAR A NAVE AURORA"
      : "PRESSIONE E PARA INTERAGIR";

    PixelUI.drawCenteredText(ctx, text, x + width / 2, y + height / 2, 12);
  }
};

SceneManager.register("colony", ColonyScene);
