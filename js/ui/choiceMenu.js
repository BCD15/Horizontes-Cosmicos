const ChoiceMenu = {
  active: false,
  choices: [],
  buttons: [],
  onSelect: null,

  open(choices, callback) {
    this.active = true;
    this.choices = choices;
    this.onSelect = callback;
    this.buttons = [];
  },

  close() {
    this.active = false;
    this.choices = [];
    this.buttons = [];
    this.onSelect = null;
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

      if (this.onSelect) {
        this.onSelect(button.text);
      }

      return true;
    }

    return false;
  },

  update() {},

  draw(ctx) {
    if (!this.active) return;

    this.buttons = [];

    const width = 620;
    // Aumentei a altura de 230 para 300 para caber os 3 botões de dificuldade!
    const height = 300; 

    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    // Alterado para ficar perfeitamente no centro da tela na vertical
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2;

    PixelUI.drawPanel(ctx, x, y, width, height);

    PixelUI.drawCenteredText(
      ctx,
      "ESCOLHA A DIFICULDADE", // Deixei o título mais claro
      x + width / 2,
      y + 42,
      16
    );

    const buttonWidth = 520;
    const buttonHeight = 54;

    const buttonX = x + width / 2 - buttonWidth / 2;
    const firstButtonY = y + 85;

    for (let i = 0; i < this.choices.length; i++) {
      const buttonY = firstButtonY + i * 65;

      this.buttons.push({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        text: this.choices[i]
      });

      PixelUI.drawButton(
        ctx,
        buttonX,
        buttonY,
        buttonWidth,
        buttonHeight,
        this.choices[i]
      );
    }
  }
};