class Animation {
  constructor({ frameWidth, frameHeight, frames, frameSpeed }) {
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.frameSpeed = frameSpeed;

    this.currentFrame = 0;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    this.frameTimer += deltaTime;

    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.currentFrame++;

      if (this.currentFrame >= this.frames) {
        this.currentFrame = 0;
      }
    }
  }

  getFrame() {
    return this.currentFrame;
  }

  reset() {
    this.currentFrame = 0;
    this.frameTimer = 0;
  }
}