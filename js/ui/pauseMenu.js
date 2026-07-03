const PauseMenu = {
  active: false,
  buttons: [],

  open() {
    this.active = true;
    this.buttons = [];
  },

  close() {
    this.active = false;
    this.buttons = [];
  },

  handleClick(mouseX, mouseY) {
    if (!this.active) return false;

    for (const button of this.buttons) {
      const clicked =
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height;

      if (!clicked) continue;

      if (button.action === "close") {
        this.close();
        return true;
      }
    }

    return true;
  },

  draw(ctx) {
    if (!this.active) return;

    this.buttons = [];

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    const width = 520;
    const height = 300;
    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2;

    PixelUI.drawPanel(ctx, x, y, width, height);
    PixelUI.drawTitleTab(ctx, x + 70, y - 30, 380, 62, "PAUSA");

    PixelUI.drawCenteredText(
      ctx,
      "JOGO CONGELADO",
      x + width / 2,
      y + 95,
      13
    );

    PixelUI.drawCenteredText(
      ctx,
      "Use este menu para acessar opções futuras.",
      x + width / 2,
      y + 140,
      8
    );

    const buttonWidth = 250;
    const buttonHeight = 52;
    const buttonX = x + width / 2 - buttonWidth / 2;
    const buttonY = y + height - 85;

    this.buttons.push({
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      action: "close"
    });

    PixelUI.drawButton(ctx, buttonX, buttonY, buttonWidth, buttonHeight, "CONTINUAR");
  }
};
