const SceneManager = {
  scenes: {},

  currentScene: null,

  register(name, sceneObject) {
    this.scenes[name] = sceneObject;
  },

  change(name) {
    if (this.currentScene?.exit) {
      this.currentScene.exit();
    }

    document
      .querySelectorAll(".screen")
      .forEach((screen) => screen.classList.remove("active"));

    this.currentScene = this.scenes[name];

    GameState.currentScene = name;

    if (this.currentScene?.enter) {
      this.currentScene.enter();
    }
  },

  update(deltaTime) {
    if (this.currentScene?.update) {
      this.currentScene.update(deltaTime);
    }
  },

  draw(ctx) {
    if (this.currentScene?.draw) {
      this.currentScene.draw(ctx);
    }
  }
};