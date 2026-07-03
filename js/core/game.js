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
  },

  draw() {
    ctx.clearRect(
      0,
      0,
      CONFIG.GAME_WIDTH,
      CONFIG.GAME_HEIGHT
    );

    SceneManager.draw(ctx);
  }
};