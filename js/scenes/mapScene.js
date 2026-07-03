const MapScene = {
  selectedPlanetId: null,
  buttons: [],
  stars: [],

  enter() {
    this.selectedPlanetId = null;
    this.buttons = [];

    if (this.stars.length === 0) {
      for (let i = 0; i < 180; i++) {
        this.stars.push({
          x: Math.random() * CONFIG.GAME_WIDTH,
          y: Math.random() * CONFIG.GAME_HEIGHT,
          size: Math.random() > 0.82 ? 2 : 1,
          alpha: 0.25 + Math.random() * 0.75
        });
      }
    }
  },

  update() {},

  draw(ctx) {
    this.buttons = [];
    this.drawSpace(ctx);
    this.drawSun(ctx);
    this.drawOrbits(ctx);
    this.drawPlanets(ctx);
    this.drawHeader(ctx);
    this.drawFooter(ctx);
    this.drawSelectionMenu(ctx);
  },

  handleClick(mouseX, mouseY) {
    for (const button of this.buttons) {
      const clicked =
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height;

      if (!clicked) continue;

      if (button.action === "travel") {
        TravelSystem.startTravel(this.selectedPlanetId);
        return true;
      }

      if (button.action === "back") {
        this.selectedPlanetId = null;
        return true;
      }

      if (button.action === "returnColony") {
        SceneManager.change("colony");
        return true;
      }
    }

    for (const planet of Object.values(Planets)) {
      const distance = Math.hypot(mouseX - planet.x, mouseY - planet.y);

      if (distance <= planet.radius + 12) {
        this.selectedPlanetId = planet.id;
        return true;
      }
    }

    return false;
  },

  drawSpace(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    gradient.addColorStop(0, "#080b1f");
    gradient.addColorStop(1, "#030511");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

    this.stars.forEach((star) => {
      ctx.fillStyle = `rgba(110, 190, 255, ${star.alpha})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  },

  drawSun(ctx) {
    const sunX = -70;
    const sunY = CONFIG.GAME_HEIGHT / 2;
    const radius = 230;

    const glow = ctx.createRadialGradient(sunX, sunY, 40, sunX, sunY, radius);
    glow.addColorStop(0, "#fff176");
    glow.addColorStop(0.35, "#ffca28");
    glow.addColorStop(0.7, "rgba(255, 170, 0, 0.35)");
    glow.addColorStop(1, "rgba(255, 170, 0, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffd400";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 170, 0, Math.PI * 2);
    ctx.fill();
  },

  drawOrbits(ctx) {
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 3;

    Object.values(Planets).forEach((planet) => {
      ctx.beginPath();
      ctx.ellipse(-45, CONFIG.GAME_HEIGHT / 2, planet.orbitRadius, planet.orbitRadius * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
  },

  drawPlanets(ctx) {
    Object.values(Planets).forEach((planet) => {
      if (this.selectedPlanetId === planet.id || planet.id === GameState.currentPlanet) {
        ctx.strokeStyle = planet.id === GameState.currentPlanet ? "#ffffff" : "#ffde59";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius + 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (planet.hasRing) {
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(planet.id === "urano" ? -0.35 : -0.18);
        ctx.strokeStyle = "rgba(214, 169, 79, 0.9)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.radius * 1.65, planet.radius * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const gradient = ctx.createRadialGradient(
        planet.x - planet.radius / 3,
        planet.y - planet.radius / 3,
        3,
        planet.x,
        planet.y,
        planet.radius
      );
      gradient.addColorStop(0, planet.secondaryColor || "#ffffff");
      gradient.addColorStop(0.45, planet.color);
      gradient.addColorStop(1, "#1a1a2e");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
      ctx.fill();

      if (planet.id === "terra") {
        ctx.fillStyle = planet.secondaryColor;
        ctx.fillRect(planet.x - 12, planet.y - 8, 20, 12);
        ctx.fillRect(planet.x + 4, planet.y + 9, 18, 10);
      }

      if (planet.id === "jupiter") {
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillRect(planet.x - 48, planet.y - 12, 96, 8);
        ctx.fillRect(planet.x - 45, planet.y + 10, 90, 7);
      }

      PixelUI.drawCenteredText(ctx, planet.name.toUpperCase(), planet.x, planet.y + planet.radius + 24, 8);
    });
  },

  drawHeader(ctx) {
    PixelUI.drawTitleTab(ctx, 365, 18, 550, 72, "MAPA VIBRACIONAL");
  },

  drawFooter(ctx) {
    const current = Planets[GameState.currentPlanet];
    PixelUI.drawPanel(ctx, 24, 610, 470, 82);
    PixelUI.drawCenteredText(ctx, `LOCAL ATUAL: ${current.name.toUpperCase()}`, 259, 641, 11);
    PixelUI.drawCenteredText(ctx, "CLIQUE EM UM PLANETA PARA DEFINIR DESTINO", 259, 669, 8);

    this.buttons.push({ x: 1048, y: 622, width: 190, height: 52, action: "returnColony" });
    PixelUI.drawButton(ctx, 1048, 622, 190, 52, "VOLTAR");
  },

  drawSelectionMenu(ctx) {
    if (!this.selectedPlanetId) return;

    const planet = Planets[this.selectedPlanetId];
    const width = 460;
    const height = 270;
    const x = CONFIG.GAME_WIDTH / 2 - width / 2;
    const y = CONFIG.GAME_HEIGHT - height - 28;

    PixelUI.drawPanel(ctx, x, y, width, height);
    PixelUI.drawCenteredText(ctx, planet.name.toUpperCase(), x + width / 2, y + 38, 16);

    ctx.fillStyle = PixelUI.colors.text;
    ctx.font = PixelUI.font(8);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(planet.type.toUpperCase(), x + width / 2, y + 72);
    ctx.fillText(planet.travelMode === "orbita" ? "CHEGADA: ESTAÇÃO ORBITAL" : "CHEGADA: COLÔNIA DE SUPERFÍCIE", x + width / 2, y + 96);
    ctx.fillText(`RISCO DA VIAGEM: ${planet.difficulty}/7`, x + width / 2, y + 120);

    const travelText = planet.id === GameState.currentPlanet ? "ENTRAR" : "VIAJAR";

    this.buttons.push({ x: x + 55, y: y + 155, width: 350, height: 48, action: "travel" });
    this.buttons.push({ x: x + 55, y: y + 213, width: 350, height: 40, action: "back" });

    PixelUI.drawButton(ctx, x + 55, y + 155, 350, 48, travelText);
    PixelUI.drawButton(ctx, x + 55, y + 213, 350, 40, "VOLTAR");
  }
};

SceneManager.register("map", MapScene);
