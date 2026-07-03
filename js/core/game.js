const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const Game = {
  lastTime: 0,

  start() {
    requestAnimationFrame(this.loop.bind(this));
  },

  loop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  },

  update(deltaTime) {
    SceneManager.update(deltaTime);
    
    // Atualiza os painéis se estiverem abertos
    if (ShopMenu.active) ShopMenu.update();
    if (InventoryUI.active) InventoryUI.update();
  },

  draw() {
    // Limpa a tela a cada quadro
    ctx.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    // 1. Desenha a cena atual (Colônia, Batalha, etc.)
    SceneManager.draw(ctx);

    // 2. DESENHA AS INTERFACES GLOBAIS POR CIMA DE TUDO!
    if (ChoiceMenu.active) ChoiceMenu.draw(ctx);
    if (ShopMenu.active) ShopMenu.draw(ctx);
    if (InventoryUI.active) InventoryUI.draw(ctx);
    if (PauseMenu.active) PauseMenu.draw(ctx);
  }
};