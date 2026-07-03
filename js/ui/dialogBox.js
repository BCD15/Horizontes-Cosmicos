const DialogBox = {
  element: null,
  speakerElement: null,
  textElement: null,
  nextButton: null,

  init() {
    this.element = document.getElementById("dialog-box");
    this.speakerElement = document.getElementById("dialog-speaker");
    this.textElement = document.getElementById("dialog-text");
    this.nextButton = document.getElementById("dialog-next-btn");

    this.nextButton.addEventListener("click", () => {
      DialogueSystem.next();
    });
  },

  show(speaker, text) {
    this.speakerElement.textContent = speaker;
    this.textElement.textContent = text;
    this.element.classList.remove("hidden");
  },

  hide() {
    this.element.classList.add("hidden");
  }
};