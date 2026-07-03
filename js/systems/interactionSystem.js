const InteractionSystem = {
  interactWithNearestNPC(player, npcs) {
    if (GameState.dialogueActive || ChoiceMenu.active) return;

    const npc = this.getNearestNPC(player, npcs);

    if (!npc) return;

    if (npc.type === "ship") {
      this.openShipMenu();
      return;
    }

    if (npc.type === "helper") {
      ShopMenu.open();
      ShopMenu.openCategory("helpers");
      return;
    }

    if (npc.dialogId) {
      DialogueSystem.start(npc.dialogId);
    }
  },

  openShipMenu() {
    ChoiceMenu.open(
      ["Acessar mapa", "Voltar"],
      (selected) => {
        ChoiceMenu.close();

        if (selected === "Acessar mapa") {
          SceneManager.change("map");
        }
      }
    );
  },

  getNearestNPC(player, npcs) {
    let nearest = null;
    let nearestDistance = Infinity;

    npcs.forEach((npc) => {
      const distance = CollisionSystem.distance(player, npc);

      if (distance < 90 && distance < nearestDistance) {
        nearest = npc;
        nearestDistance = distance;
      }
    });

    return nearest;
  }
};
