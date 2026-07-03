const MenuScene = {
  enter() {
    document
      .getElementById("menu-screen")
      .classList.add("active");

      AudioManager.playBGM("bgm_menu", 0.4);
  },

  exit() {
    document
      .getElementById("menu-screen")
      .classList.remove("active");

    AudioManager.stopBGM();
  }
};

SceneManager.register("menu", MenuScene);