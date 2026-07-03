const ShopMenu = {
  active: false,
  buttons: [],
  currentPage: "main",
  selectedCategoryId: null,
  message: "",
  scrollOffset: 0,
  scrollSpeed: 42,

  options: [
    { text: "MÓDULOS DE PROPULSÃO", categoryId: "propulsion" },
    { text: "MÓDULO DE ARMA", action: "weaponTypes" },
    { text: "MÓDULOS DE ESCUDO", categoryId: "shield" },
    { text: "AJUDANTES", categoryId: "helpers" },
    { text: "SAIR", action: "close" }
  ],

  weaponOptions: [
    { text: "CANHÃO", categoryId: "cannon" },
    { text: "LASER", categoryId: "laser" },
    { text: "PULSO ELETROMAGNÉTICO", categoryId: "emp" },
    { text: "VOLTAR", action: "backMain" }
  ],

  open() {
    this.active = true;
    this.buttons = [];
    this.currentPage = "main";
    this.selectedCategoryId = null;
    this.message = "";
    this.scrollOffset = 0;
  },

  close() {
    this.active = false;
    this.buttons = [];
    this.currentPage = "main";
    this.selectedCategoryId = null;
    this.message = "";
    this.scrollOffset = 0;
  },

  openWeaponTypes() {
    this.currentPage = "weaponTypes";
    this.selectedCategoryId = null;
    this.buttons = [];
    this.message = "";
    this.scrollOffset = 0;
  },

  openCategory(categoryId) {
    if (!ShopModules[categoryId]) {
      console.warn(`Categoria de loja não encontrada: ${categoryId}`);
      return;
    }

    this.currentPage = "category";
    this.selectedCategoryId = categoryId;
    this.buttons = [];
    this.message = "";
    this.scrollOffset = 0;
  },

  backToMain() {
    this.currentPage = "main";
    this.selectedCategoryId = null;
    this.buttons = [];
    this.message = "";
    this.scrollOffset = 0;
  },

  backFromCategory() {
    const category = ShopModules[this.selectedCategoryId];

    if (category && category.parent === "weapon") {
      this.openWeaponTypes();
      return;
    }

    this.backToMain();
  },

  isItemPurchased(item) {
    return !!GameState.purchasedItems[item.id];
  },

  isItemUnlocked(category, itemIndex) {
    if (category.selectionType === "helper") return true;
    if (itemIndex === 0) return true;

    const previousItem = category.items[itemIndex - 1];
    return this.isItemPurchased(previousItem);
  },

  getButtonText(category, item, itemIndex) {
    if (category.selectionType === "helper") {
      if (GameState.activeHelperId === item.id) return "ATIVO";
      if (this.isItemPurchased(item)) return "USAR";
      return "CONTRATAR";
    }

    if (this.isItemPurchased(item)) return "COMPRADO";
    if (!this.isItemUnlocked(category, itemIndex)) return "BLOQUEADO";
    return "COMPRAR";
  },

  buyItem(categoryId, itemIndex) {
    const category = ShopModules[categoryId];

    if (!category || !category.items[itemIndex]) return;

    const item = category.items[itemIndex];

    if (category.selectionType === "helper" && this.isItemPurchased(item)) {
      GameState.activeHelperId = item.id;
      this.message = `${item.title.toUpperCase()} ATIVO`;
      return;
    }

    if (this.isItemPurchased(item)) {
      this.message = "ITEM JÁ COMPRADO";
      return;
    }

    if (!this.isItemUnlocked(category, itemIndex)) {
      this.message = "COMPRE O MÓDULO ANTERIOR PARA LIBERAR";
      return;
    }

    if (GameState.gold < item.cost) {
      this.message = "OURO INSUFICIENTE";
      return;
    }

    GameState.gold -= item.cost;
    GameState.purchasedItems[item.id] = true;

    if (category.selectionType === "helper") {
      GameState.activeHelperId = item.id;
      this.message = `${item.title.toUpperCase()} CONTRATADO E ATIVO`;
      return;
    }

    this.message = `MÓDULO ${item.level} - ${item.title.toUpperCase()} COMPRADO`;
  },

  getCategoryLayout(category, panelX, panelY, panelWidth, panelHeight) {
    const listX = panelX + 34;
    const listY = panelY + 82;
    const rowWidth = panelWidth - 68;
    const rowHeight = category.id === "emp" ? 190 : category.selectionType === "helper" ? 150 : 132;
    const rowGap = 14;
    const listHeight = panelHeight - 180;
    const contentHeight = category.items.length * rowHeight +
      Math.max(0, category.items.length - 1) * rowGap;
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

  normalizeScroll(category, layout) {
    if (!category || !layout) return;
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, layout.maxScroll));
  },

  handleWheel(deltaY) {
    if (!this.active || this.currentPage !== "category") return false;

    const category = ShopModules[this.selectedCategoryId];
    if (!category) return false;

    const width = 980;
    const height = 620;
    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2 + 10;
    const layout = this.getCategoryLayout(category, x, y, width, height);

    if (layout.maxScroll <= 0) return true;

    this.scrollOffset += deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed;
    this.normalizeScroll(category, layout);
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

      if (button.action === "weaponTypes") {
        this.openWeaponTypes();
        return true;
      }

      if (button.action === "backMain") {
        this.backToMain();
        return true;
      }

      if (button.action === "backCategory") {
        this.backFromCategory();
        return true;
      }

      if (button.action === "buy") {
        this.buyItem(button.categoryId, button.itemIndex);
        return true;
      }

      if (button.categoryId) {
        this.openCategory(button.categoryId);
        return true;
      }
    }

    return false;
  },

  update() {
    if (!this.active || this.currentPage !== "category") return;

    const category = ShopModules[this.selectedCategoryId];
    if (!category) return;

    const width = 980;
    const height = 620;
    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2 + 10;
    const layout = this.getCategoryLayout(category, x, y, width, height);

    if (Input.isDown("arrowdown") || Input.isDown("s")) {
      this.scrollOffset += 6;
    }

    if (Input.isDown("arrowup") || Input.isDown("w")) {
      this.scrollOffset -= 6;
    }

    this.normalizeScroll(category, layout);
  },

  draw(ctx) {
    if (!this.active) return;

    this.buttons = [];

    if (this.currentPage === "weaponTypes") {
      this.drawWeaponTypesPage(ctx);
      return;
    }

    if (this.currentPage === "category") {
      this.drawCategoryPage(ctx);
      return;
    }

    this.drawMainPage(ctx);
  },

  drawMainPage(ctx) {
    const width = 560;
    const height = 390;

    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2;

    PixelUI.drawPanel(ctx, x, y, width, height);
    this.drawTitle(ctx, x, y, width, "NEGOCIAÇÃO");

    PixelUI.drawCenteredText(
      ctx,
      `OURO: ${GameState.gold}`,
      x + width / 2,
      y + 54,
      11
    );

    this.drawVerticalOptions(ctx, this.options, x, y + 90, width, 420, 52, 62);
  },

  drawWeaponTypesPage(ctx) {
    const width = 560;
    const height = 390;

    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2;

    PixelUI.drawPanel(ctx, x, y, width, height);
    this.drawTitle(ctx, x, y, width, "MÓDULO DE ARMA");

    PixelUI.drawCenteredText(
      ctx,
      "ESCOLHA O TIPO DE ARMA",
      x + width / 2,
      y + 54,
      11
    );

    this.drawVerticalOptions(ctx, this.weaponOptions, x, y + 90, width, 420, 52, 62);
  },

  drawVerticalOptions(ctx, options, panelX, firstButtonY, panelWidth, buttonWidth, buttonHeight, spacing) {
    const buttonX = panelX + panelWidth / 2 - buttonWidth / 2;

    for (let i = 0; i < options.length; i++) {
      const buttonY = firstButtonY + i * spacing;
      const option = options[i];

      this.buttons.push({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        text: option.text,
        categoryId: option.categoryId,
        action: option.action
      });

      PixelUI.drawButton(ctx, buttonX, buttonY, buttonWidth, buttonHeight, option.text);
    }
  },

  drawCategoryPage(ctx) {
    const category = ShopModules[this.selectedCategoryId];
    if (!category) return;

    const width = 980;
    const height = 620;

    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT / 2 - height / 2 + 10;

    PixelUI.drawPanel(ctx, x, y, width, height);
    this.drawTitle(ctx, x, y, width, category.menuText);

    PixelUI.drawCenteredText(
      ctx,
      `OURO: ${GameState.gold}`,
      x + width / 2,
      y + 46,
      12
    );

    const layout = this.getCategoryLayout(category, x, y, width, height);
    this.normalizeScroll(category, layout);

    ctx.save();
    ctx.beginPath();
    ctx.rect(layout.listX - 4, layout.listY - 4, layout.rowWidth + 8, layout.listHeight + 8);
    ctx.clip();

    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];
      const rowY = layout.listY + i * (layout.rowHeight + layout.rowGap) - this.scrollOffset;

      if (rowY + layout.rowHeight < layout.listY || rowY > layout.listY + layout.listHeight) {
        continue;
      }

      this.drawItemRow(
        ctx,
        category,
        item,
        i,
        layout.listX,
        rowY,
        layout.rowWidth,
        layout.rowHeight,
        layout.listY,
        layout.listHeight
      );
    }

    ctx.restore();

    this.drawScrollBar(ctx, x + width - 24, layout.listY, 10, layout.listHeight, layout);

    if (this.message) {
      PixelUI.drawCenteredText(
        ctx,
        this.message,
        x + width / 2,
        y + height - 78,
        10
      );
    }

    const backWidth = 240;
    const backHeight = 46;
    const backX = x + width / 2 - backWidth / 2;
    const backY = y + height - 56;

    this.buttons.push({
      x: backX,
      y: backY,
      width: backWidth,
      height: backHeight,
      text: "VOLTAR",
      action: "backCategory"
    });

    PixelUI.drawButton(ctx, backX, backY, backWidth, backHeight, "VOLTAR");
  },

  drawItemRow(ctx, category, item, itemIndex, x, y, width, height, clipY, clipHeight) {
    const purchased = this.isItemPurchased(item);
    const unlocked = this.isItemUnlocked(category, itemIndex);
    const buttonText = this.getButtonText(category, item, itemIndex);

    ctx.fillStyle = unlocked ? PixelUI.colors.panelLight : "#b88964";
    ctx.fillRect(x, y, width, height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = PixelUI.colors.borderDark;
    ctx.strokeRect(x, y, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = PixelUI.colors.borderPurple;
    ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

    ctx.fillStyle = PixelUI.colors.text;
    ctx.font = PixelUI.font(11);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const titlePrefix = category.id === "emp" ? "MÓDULO ÚNICO" : category.selectionType === "helper" ? "AJUDANTE" : `MÓDULO ${item.level}`;
    ctx.fillText(`${titlePrefix} - ${item.title}`, x + 18, y + 16);

    ctx.font = PixelUI.font(10);

    const firstColumnX = x + 20;
    const secondColumnX = x + 350;
    let statX = firstColumnX;
    let statY = y + 50;
    const statSpacing = 25;
    const maxStatsPerColumn = 3;

    for (let i = 0; i < item.stats.length; i++) {
      if (i > 0 && i % maxStatsPerColumn === 0) {
        statX = secondColumnX;
        statY = y + 50;
      }

      ctx.fillText(`• ${item.stats[i]}`, statX, statY);
      statY += statSpacing;
    }

    if (!unlocked) {
      ctx.font = PixelUI.font(15);
      ctx.fillStyle = "#5b1f1f";
      ctx.fillText(
        "Requer compra do módulo anterior",
        x + 250,
        y + height - 30
      );
    }

    if (purchased) {
      ctx.font = PixelUI.font(15);
      const statusText = category.selectionType === "helper"
        ? (GameState.activeHelperId === item.id ? "Ajudante ativo" : "Contratado")
        : "Instalado / adquirido";
      ctx.fillText(statusText, x + 300, y + height - 26);
    }

    const buttonWidth = 170;
    const buttonHeight = 44;
    const buttonX = x + width - buttonWidth - 22;
    const buttonY = y + height / 2 - buttonHeight / 2;

    const buttonVisible =
      buttonY + buttonHeight >= clipY &&
      buttonY <= clipY + clipHeight;

    if (buttonVisible) {
      this.buttons.push({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        text: buttonText,
        action: "buy",
        categoryId: category.id,
        itemIndex
      });
    }

    PixelUI.drawButton(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonText);
  },

  drawScrollBar(ctx, x, y, width, height, layout) {
    if (layout.maxScroll <= 0) return;

    ctx.fillStyle = "#b88964";
    ctx.fillRect(x, y, width, height);

    const thumbHeight = Math.max(44, height * (height / layout.contentHeight));
    const thumbY = y + (height - thumbHeight) * (this.scrollOffset / layout.maxScroll);

    ctx.fillStyle = PixelUI.colors.borderDark;
    ctx.fillRect(x, thumbY, width, thumbHeight);
  },

  drawTitle(ctx, panelX, panelY, panelWidth, text) {
    const titleWidth = 520;
    const titleHeight = 62;

    const titleX = panelX + panelWidth / 2 - titleWidth / 2;
    const titleY = panelY - 30;

    PixelUI.drawTitleTab(
      ctx,
      titleX,
      titleY,
      titleWidth,
      titleHeight,
      text
    );
  }
};
