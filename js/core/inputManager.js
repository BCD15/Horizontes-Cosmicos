const Input = {
  keys: {},

  init() {
    window.addEventListener("keydown", (event) => {
      this.keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.key.toLowerCase()] = false;
    });
  },

  isDown(key) {
    return !!this.keys[key.toLowerCase()];
  }
};