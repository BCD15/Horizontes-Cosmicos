const StatusPanel = {
  buttons: [],

  draw(ctx, colonyName) {
    this.buttons = [];

    const x = 18;
    const y = 18;
    const width = 330;
    const height = 150;

    PixelUI.drawPanel(ctx, x, y, width, height);

    ctx.fillStyle = PixelUI.colors.text;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = PixelUI.font(9);
    ctx.fillText("COLÔNIA", x + 24, y + 22);

    ctx.font = PixelUI.font(10);
    ctx.fillText(colonyName.toUpperCase(), x + 24, y + 47);

    ctx.font = PixelUI.font(9);
    ctx.fillText(`OURO: ${GameState.gold}`, x + 24, y + 78);

    const buttonSize = 42;
    const gap = 14;
    const gearX = x + 24;
    const bagX = gearX + buttonSize + gap;
    const buttonY = y + height - buttonSize - 18;

    this.buttons.push({
      x: gearX,
      y: buttonY,
      width: buttonSize,
      height: buttonSize,
      action: "pause"
    });

    this.buttons.push({
      x: bagX,
      y: buttonY,
      width: buttonSize,
      height: buttonSize,
      action: "inventory"
    });

    this.drawIconButton(ctx, gearX, buttonY, buttonSize, "gear");
    this.drawIconButton(ctx, bagX, buttonY, buttonSize, "bag");
  },

  drawIconButton(ctx, x, y, size, type) {
    PixelUI.drawButton(ctx, x, y, size, size, "");

    const centerX = x + size / 2;
    const centerY = y + size / 2;

    ctx.save();

    if (type === "gear") {
      ctx.strokeStyle = "#2b1b17";
      ctx.lineWidth = 3;

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;

        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * 9,
          centerY + Math.sin(angle) * 9
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * 14,
          centerY + Math.sin(angle) * 14
        );
        ctx.stroke();
      }

      ctx.fillStyle = "#d8d0c0";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2b1b17";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (type === "bag") {
      ctx.fillStyle = "#14037d";
      ctx.fillRect(centerX - 10, centerY - 6, 20, 18);

      ctx.fillStyle = "#2b1b17";
      ctx.fillRect(centerX - 10, centerY - 6, 20, 3);

      ctx.strokeStyle = "#2b1b17";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 8, 6, Math.PI, 0);
      ctx.stroke();

      ctx.fillStyle = "#2412b8";
      ctx.fillRect(centerX - 6, centerY + 2, 12, 7);

      ctx.fillStyle = "#2b1b17";
      ctx.fillRect(centerX - 1, centerY + 4, 2, 3);
    }

    ctx.restore();

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
  },

  handleClick(mouseX, mouseY) {
    for (const button of this.buttons) {
      const clicked =
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height;

      if (!clicked) continue;

      if (button.action === "pause") {
        PauseMenu.open();
        return true;
      }

      if (button.action === "inventory") {
        InventoryUI.open();
        return true;
      }
    }

    return false;
  }
};