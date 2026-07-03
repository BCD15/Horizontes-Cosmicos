const TravelSystem = {
  originPlanetId: "terra",
  destinationPlanetId: null,
  inProgress: false,

  startTravel(destinationPlanetId) {
    const destination = Planets[destinationPlanetId];

    if (!destination) {
      console.warn(`Planeta não encontrado: ${destinationPlanetId}`);
      return;
    }

    if (destinationPlanetId === GameState.currentPlanet) {
      SceneManager.change("colony");
      return;
    }

    this.originPlanetId = GameState.currentPlanet;
    this.destinationPlanetId = destinationPlanetId;
    this.inProgress = true;

    SceneManager.change("battle");
  },

  completeTravel() {
    if (!this.destinationPlanetId) return;

    GameState.currentPlanet = this.destinationPlanetId;
    this.inProgress = false;
    this.destinationPlanetId = null;

    SceneManager.change("colony");
  },

  cancelTravel() {
    this.inProgress = false;
    this.destinationPlanetId = null;
    SceneManager.change("map");
  },

  getDestination() {
    return Planets[this.destinationPlanetId];
  },

  getOrigin() {
    return Planets[this.originPlanetId];
  }
};
