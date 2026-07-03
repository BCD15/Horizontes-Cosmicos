const GameOverScene = {
  enter() {
    // Esconde qualquer menu que tenha ficado aberto (loja, inventário, etc)
    if (typeof ShopMenu !== 'undefined') ShopMenu.active = false;
    if (typeof InventoryUI !== 'undefined') InventoryUI.active = false;
    if (typeof ChoiceMenu !== 'undefined') ChoiceMenu.active = false;
  },

  update(deltaTime) {
    // Não precisamos atualizar nada na tela de Game Over
  },

  draw(ctx) {
    // 1. Fundo escuro cobrindo a tela toda
    ctx.fillStyle = "rgba(10, 10, 15, 0.95)";
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    // 2. Texto Principal em Vermelho
    ctx.fillStyle = "#ff4757";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 48px 'Courier New', monospace"; // Fonte estilo terminal
    ctx.fillText("NAVE DESTRUÍDA", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 30);

    // 3. Instrução para reiniciar
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px 'Courier New', monospace";
    ctx.fillText("Clique em qualquer lugar para reiniciar a simulação", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 40);
  },

  handleClick(mouseX, mouseY) {
    // Quando o jogador clica na tela de Game Over, a página recarrega (reiniciando o jogo)
    window.location.reload();
    return true; // Avisa o sistema que o clique foi processado
  }
};

// Regista a cena no motor do jogo
SceneManager.register("gameover", GameOverScene);