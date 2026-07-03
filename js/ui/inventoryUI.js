const InventoryUI = {
  active: false,
  currentTab: "modules",
  buttons: [],
  scrollOffset: 0,
  scrollSpeed: 42,

  open() {
    this.active = true;
    this.currentTab = "modules";
    this.buttons = [];
    this.scrollOffset = 0;
  },

  close() {
    this.active = false;
    this.buttons = [];
    this.scrollOffset = 0;
  },

  getHighestPurchasedItem(category) {
    if (!category || !category.items) return null;

    let highest = null;

    category.items.forEach((item) => {
      if (!GameState.purchasedItems[item.id]) return;
      if (!highest || item.level > highest.level) {
        highest = item;
      }
    });

    return highest;
  },

  getPurchasedItems() {
    const purchased = [];

    Object.values(ShopModules).forEach((category) => {
      if (category.parent === "weapon") return;

      const item = this.getHighestPurchasedItem(category);
      if (!item) return;

      purchased.push({
        category,
        item
      });
    });

    return purchased;
  },

  getPurchasedWeapons() {
    const weapons = [];

    Object.values(ShopModules).forEach((category) => {
      if (category.parent !== "weapon") return;

      const item = this.getHighestPurchasedItem(category);
      if (!item) return;

      weapons.push({
        category,
        item
      });
    });

    return weapons;
  },

  selectWeapon(item) {
    GameState.activeWeaponId = item.id;
  },

  isWeaponActive(item) {
    return GameState.activeWeaponId === item.id;
  },

  getLayout(panelX, panelY, panelWidth, panelHeight) {
    const listX = panelX + 36;
    const listY = panelY + 128;
    const rowWidth = panelWidth - 72;
    const rowHeight = 112;
    const rowGap = 12;
    const listHeight = panelHeight - 210;
    const rows = this.currentTab === "modules"
      ? this.getPurchasedItems().length
      : this.getPurchasedWeapons().length;
    const contentHeight = rows * rowHeight + Math.max(0, rows - 1) * rowGap;
    const maxScroll = Math.max(0, contentHeight - listHeight);

    return {
      listX,
      listY,
      rowWidth,
      rowHeight,
      rowGap,
      listHeight,
      contentHeight,
      maxScroll
    };
  },

  normalizeScroll(layout) {
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, layout.maxScroll));
  },

  handleWheel(deltaY) {
    if (!this.active) return false;

    const panel = this.getPanelRect();
    const layout = this.getLayout(panel.x, panel.y, panel.width, panel.height);

    if (layout.maxScroll <= 0) return true;

    this.scrollOffset += deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed;
    this.normalizeScroll(layout);
    return true;
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

      if (button.action === "tabModules") {
        this.currentTab = "modules";
        this.scrollOffset = 0;
        return true;
      }

      if (button.action === "tabWeapons") {
        this.currentTab = "weapons";
        this.scrollOffset = 0;
        return true;
      }

      if (button.action === "selectWeapon") {
        this.selectWeapon(button.item);
        return true;
      }
    }

    return true;
  },

  update() {
    if (!this.active) return;

    const panel = this.getPanelRect();
    const layout = this.getLayout(panel.x, panel.y, panel.width, panel.height);

    if (Input.isDown("arrowdown") || Input.isDown("s")) {
      this.scrollOffset += 6;
    }

    if (Input.isDown("arrowup") || Input.isDown("w")) {
      this.scrollOffset -= 6;
    }

    this.normalizeScroll(layout);
  },

  getPanelRect() {
    const width = 900;
    const height = 590;

    return {
      width,
      height,
      x: CONFIG.GAME_WIDTH / 2 - width / 2,
      y: CONFIG.GAME_HEIGHT / 2 - height / 2 + 12
    };
  },

  draw(ctx) {
    if (!this.active) return;

    this.buttons = [];

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    const panel = this.getPanelRect();

    PixelUI.drawPanel(ctx, panel.x, panel.y, panel.width, panel.height);
    PixelUI.drawTitleTab(ctx, panel.x + 190, panel.y - 30, 520, 62, "INVENTÁRIO");

    this.drawTabs(ctx, panel.x, panel.y);

    const layout = this.getLayout(panel.x, panel.y, panel.width, panel.height);
    this.normalizeScroll(layout);

    if (this.currentTab === "modules") {
      this.drawModulesList(ctx, layout);
    } else {
      this.drawWeaponsList(ctx, layout);
    }

    this.drawScrollBar(ctx, panel.x + panel.width - 24, layout.listY, 10, layout.listHeight, layout);

    const backWidth = 230;
    const backHeight = 48;
    const backX = panel.x + panel.width / 2 - backWidth / 2;
    const backY = panel.y + panel.height - 62;

    this.buttons.push({
      x: backX,
      y: backY,
      width: backWidth,
      height: backHeight,
      action: "close"
    });

    PixelUI.drawButton(ctx, backX, backY, backWidth, backHeight, "VOLTAR");
  },

  drawTabs(ctx, panelX, panelY) {
    const tabY = panelY + 62;
    const tabWidth = 260;
    const tabHeight = 44;
    const firstX = panelX + 170;
    const secondX = firstX + tabWidth + 28;

    this.buttons.push({
      x: firstX,
      y: tabY,
      width: tabWidth,
      height: tabHeight,
      action: "tabModules"
    });

    this.buttons.push({
      x: secondX,
      y: tabY,
      width: tabWidth,
      height: tabHeight,
      action: "tabWeapons"
    });

    PixelUI.drawButton(ctx, firstX, tabY, tabWidth, tabHeight, "EQUIPAMENTOS");
    PixelUI.drawButton(ctx, secondX, tabY, tabWidth, tabHeight, "ARMAS");

    ctx.fillStyle = PixelUI.colors.text;
    ctx.font = PixelUI.font(8);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const selectedX = this.currentTab === "modules" ? firstX : secondX;
    ctx.fillText("▲", selectedX + tabWidth / 2, tabY + tabHeight + 15);

    ctx.textAlign = "left";
  },

  drawModulesList(ctx, layout) {
    const purchased = this.getPurchasedItems();

    if (purchased.length === 0) {
      PixelUI.drawCenteredText(
        ctx,
        "NENHUM EQUIPAMENTO COMPRADO AINDA",
        CONFIG.GAME_WIDTH / 2,
        layout.listY + 90,
        11
      );
      return;
    }

    this.drawRows(ctx, purchased, layout, false);
  },

  drawWeaponsList(ctx, layout) {
    const weapons = this.getPurchasedWeapons();

    if (weapons.length === 0) {
      PixelUI.drawCenteredText(
        ctx,
        "NENHUMA ARMA COMPRADA AINDA",
        CONFIG.GAME_WIDTH / 2,
        layout.listY + 90,
        11
      );
      return;
    }

    this.drawRows(ctx, weapons, layout, true);
  },

  drawRows(ctx, rows, layout, showWeaponButton) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(layout.listX - 4, layout.listY - 4, layout.rowWidth + 8, layout.listHeight + 8);
    ctx.clip();

    rows.forEach(({ category, item }, index) => {
      const rowY = layout.listY + index * (layout.rowHeight + layout.rowGap) - this.scrollOffset;

      if (rowY + layout.rowHeight < layout.listY || rowY > layout.listY + layout.listHeight) {
        return;
      }

      this.drawRow(ctx, category, item, layout.listX, rowY, layout.rowWidth, layout.rowHeight, showWeaponButton);
    });

    ctx.restore();
  },

  drawRow(ctx, category, item, x, y, width, height, showWeaponButton) {
    ctx.fillStyle = PixelUI.colors.panelLight;
    ctx.fillRect(x, y, width, height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = PixelUI.colors.borderDark;
    ctx.strokeRect(x, y, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = PixelUI.colors.borderPurple;
    ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

    ctx.fillStyle = PixelUI.colors.text;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const moduleLabel = category.id === "emp" ? "MÓDULO ÚNICO" : `MÓDULO ${item.level}`;

    ctx.font = PixelUI.font(10);
    ctx.fillText(`${moduleLabel} - ${item.title}`, x + 18, y + 16);

    ctx.font = PixelUI.font(11);
    ctx.fillText(`Nível atual: ${item.level}`, x + 18, y + 45);

    ctx.font = PixelUI.font(9);
    ctx.fillText(`Categoria: ${category.menuText}`, x + 18, y + 70);

    if (showWeaponButton) {
      const active = this.isWeaponActive(item);
      const buttonWidth = 170;
      const buttonHeight = 42;
      const buttonX = x + width - buttonWidth - 22;
      const buttonY = y + height / 2 - buttonHeight / 2;

      this.buttons.push({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        action: "selectWeapon",
        item
      });

      PixelUI.drawButton(ctx, buttonX, buttonY, buttonWidth, buttonHeight, active ? "EM USO" : "USAR");
    }
  },

  drawScrollBar(ctx, x, y, width, height, layout) {
    if (layout.maxScroll <= 0) return;

    ctx.fillStyle = "#b88964";
    ctx.fillRect(x, y, width, height);

    const thumbHeight = Math.max(44, height * (height / layout.contentHeight));
    const thumbY = y + (height - thumbHeight) * (this.scrollOffset / layout.maxScroll);

    ctx.fillStyle = PixelUI.colors.borderDark;
    ctx.fillRect(x, thumbY, width, thumbHeight);
  }
};
