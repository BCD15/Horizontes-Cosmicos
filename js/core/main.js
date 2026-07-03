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
    SceneManager.change("colony");
  });

  Game.start();
});
