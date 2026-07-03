const PixelUI = {
  colors: {
    panel: "#e8b978",
    panelLight: "#f3cf98",
    borderDark: "#2a1722",
    borderPurple: "#7c3b55",
    text: "#1d1d2f"
  },

  font(size = 12) {
    return `${size}px "Press Start 2P"`;
  },

  drawPanel(ctx, x, y, width, height) {
    ctx.fillStyle = this.colors.panel;
    ctx.fillRect(x, y, width, height);

    ctx.lineWidth = 5;
    ctx.strokeStyle = this.colors.borderDark;
    ctx.strokeRect(x, y, width, height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = this.colors.borderPurple;
    ctx.strokeRect(x + 8, y + 8, width - 16, height - 16);
  },

  drawTitleTab(ctx, x, y, width, height, text) {
    this.drawPanel(ctx, x, y, width, height);

    ctx.fillStyle = this.colors.text;
    ctx.font = this.font(20);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, x + width / 2, y + height / 2);

    ctx.textAlign = "left";
  },

  drawButton(ctx, x, y, width, height, text) {
    ctx.fillStyle = this.colors.panelLight;
    ctx.fillRect(x, y, width, height);

    ctx.lineWidth = 4;
    ctx.strokeStyle = this.colors.borderDark;
    ctx.strokeRect(x, y, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.colors.borderPurple;
    ctx.strokeRect(x + 6, y + 6, width - 12, height - 12);

    ctx.fillStyle = this.colors.text;
    ctx.font = this.font(12);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, x + width / 2, y + height / 2);

    ctx.textAlign = "left";
  },

  drawCenteredText(ctx, text, x, y, size = 12) {
    ctx.fillStyle = this.colors.text;
    ctx.font = this.font(size);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, x, y);

    ctx.textAlign = "left";
  }
};