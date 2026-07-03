window.addEventListener("DOMContentLoaded", async () => {
  Input.init();
  DialogBox.init();

  try {
    await AssetLoader.loadImage(
      "player",
      "./assets/images/characters/player/player-front.png"
    );
  } catch (error) {
    console.warn(error);
    console.warn("Player será carregado como placeholder.");
  }

  try {
    await AssetLoader.loadImage(
      "backgroundTerra",
      "./assets/images/backgrounds/BackgroudTerra.webp"
    );
  } catch (error) {
    console.warn(error);
    console.warn("Background da Terra será carregado como fundo padrão.");
  }

  try {
    await AssetLoader.loadImage(
      "player_ship_battle",
      "./assets/images/ships/player/nave-batalha.png"
    );
  } catch (error) {
    console.warn(error);
    console.warn("Imagem da nave de batalha não encontrada. Usando blocos como fallback.");
  }

  try {
    await AssetLoader.loadImage(
      "nave_aurora",
      "./assets/images/ships/player/nave-aurora.png"
    );
  } catch (error) {
    console.warn(error);
    console.warn("Imagem da nave não encontrada. Usando blocos como fallback.");
  }

  const planetKeys = Object.keys(PlanetData); // Pega 'mercurio', 'venus', 'terra', etc.

  for (const pKey of planetKeys) {
    try {
      await AssetLoader.loadImage(
        `${pKey}_merchant`,
        `./assets/images/characters/comerciantes/${pKey}/comerciante.png`
      );
    } catch (error) {
      console.warn(`[Aviso] Imagem do comerciante em ${pKey} não encontrada. Usando quadrado colorido.`);
    }

    try {
      await AssetLoader.loadImage(
        `battle_bg_${pKey}`, 
        `./assets/images/battles/${pKey}.png` // Organizado por nome do planeta
      );
    } catch (error) {
      console.warn(`[Aviso] Fundo de batalha para ${pKey} não encontrado. Usando padrão do espaço.`);
    }
  }

  for (let i = 1; i <= 4; i++) {
    try {
      await AssetLoader.loadImage(
        `enemy_ship_${i}`, 
        `./assets/images/ships/enemies/enemie${i}.png` // Nomeie suas imagens de 1 a 4
      );
    } catch (error) {
      console.warn(`[Aviso] Nave inimiga ${i} não encontrada.`);
    }
  }

  try {
    await AssetLoader.loadImage(
      "ajudante_default",
      "./assets/images/helpers/default.png"
    );
  } catch (error) {
    console.warn("Imagem default do ajudante não encontrada.");
  }

  if (ShopModules.helpers) {
    await Promise.all(
      ShopModules.helpers.items.map(async (helper) => {
        try {
          await AssetLoader.loadImage(helper.imageKey, helper.imageSrc);
        } catch (error) {
          console.warn(error);
          console.warn(`Imagem do ajudante ${helper.title} será carregada como placeholder.`);
        }
      })
    );
  }

  Player.init();

  SceneManager.change("menu");

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX =
      (event.clientX - rect.left) *
      (CONFIG.GAME_WIDTH / rect.width);

    const mouseY =
      (event.clientY - rect.top) *
      (CONFIG.GAME_HEIGHT / rect.height);

    if (PauseMenu.active) {
      PauseMenu.handleClick(mouseX, mouseY);
      return;
    }

    if (InventoryUI.active) {
      InventoryUI.handleClick(mouseX, mouseY);
      return;
    }

    if (ChoiceMenu.active) {
      ChoiceMenu.handleClick(mouseX, mouseY);
      return;
    }

    if (ShopMenu.active) {
      ShopMenu.handleClick(mouseX, mouseY);
      return;
    }

    if (SceneManager.currentScene?.handleClick) {
      const handledByScene = SceneManager.currentScene.handleClick(mouseX, mouseY);

      if (handledByScene) {
        return;
      }
    }

    if (StatusPanel.handleClick(mouseX, mouseY)) {
      return;
    }
  });

  canvas.addEventListener("wheel", (event) => {
    let handled = false;

    if (InventoryUI.active) {
      handled = InventoryUI.handleWheel(event.deltaY);
    } else if (ShopMenu.active) {
      handled = ShopMenu.handleWheel(event.deltaY);
    }

    if (handled) {
      event.preventDefault();
    }
  }, { passive: false });

  const startButton = document.getElementById("start-game-btn");


  startButton.addEventListener("click", () => {
    // 1. Esconde a interface HTML do menu
    document.getElementById("menu-screen").classList.remove("active");

    // 2. Carrega a cena da colônia para ter um fundo bonito no Canvas
    SceneManager.change("colony");

    // 3. Abre o menu de dificuldades nativo do Canvas por cima
    ChoiceMenu.open(
      ["FÁCIL", "MÉDIO", "DIFÍCIL"], 
      (escolha) => {
        CONFIG.BATTLE.difficultyGrowthPercent = CONFIG.BATTLE.difficultyOptions[escolha];
        ChoiceMenu.close();
      }
    );
  });

 

  Game.start();
});