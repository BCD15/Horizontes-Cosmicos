const DialogueSystem = {
  currentDialog: [],
  currentIndex: 0,

  start(dialogId) {
    const dialog = Dialogs[dialogId];

    if (!dialog) {
      console.warn(`Diálogo não encontrado: ${dialogId}`);
      return;
    }

    this.currentDialogId = dialogId;
    this.currentDialog = dialog;
    this.currentIndex = 0;

    GameState.dialogueActive = true;

    this.showCurrentLine();
  },

  showCurrentLine() {
    const line = this.currentDialog[this.currentIndex];

    if (!line) {
      this.end();
      return;
    }

    DialogBox.show(line.speaker, line.text);
  },

  next() {
    this.currentIndex++;

    if (this.currentIndex >= this.currentDialog.length) {
      this.end();
      return;
    }

    this.showCurrentLine();
  },

  end() {
    const lastDialogId = this.currentDialogId;

    this.currentDialog = [];
    this.currentIndex = 0;

    DialogBox.hide();

    GameState.dialogueActive = false;

    if (lastDialogId && lastDialogId.endsWith("Comerciante")) {
      ChoiceMenu.open(
        [
          "Sair",
          "Me mostre o que está vendendo"
        ],
        (selected) => {
          if (selected === "Sair") {
            ChoiceMenu.close();
          }

          if (selected === "Me mostre o que está vendendo") {
            ChoiceMenu.close();
            GameState.dialogueActive = false;
            ShopMenu.open();
          }
        }
      );

      return;
    }
  }
};