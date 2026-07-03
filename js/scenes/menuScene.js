const MenuScene = {
  enter() {
    document
      .getElementById("menu-screen")
      .classList.add("active");
  },

  exit() {
    document
      .getElementById("menu-screen")
      .classList.remove("active");
  }
};

SceneManager.register("menu", MenuScene);