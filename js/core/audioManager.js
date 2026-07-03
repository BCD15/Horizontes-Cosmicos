const AudioManager = {
  sounds: {},
  currentBGM: null,

  // Carrega o som na memória
  async load(key, src) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = src;
      
      // Quando o áudio estiver pronto para tocar, salva e resolve
      audio.addEventListener('canplaythrough', () => {
        this.sounds[key] = audio;
        resolve();
      }, { once: true });

      // Se der erro, avisa mas não trava o jogo
      audio.addEventListener('error', () => {
        console.warn(`[Aviso] Áudio não encontrado: ${src}`);
        resolve(); 
      }, { once: true });
    });
  },

  // Toca efeitos sonoros (tiros, cliques, explosões)
  playSFX(key, volume = 1.0) {
    if (this.sounds[key]) {
      // Cria um clone para permitir que o mesmo som toque várias vezes sobrepostas (ex: tiros rápidos)
      const soundClone = this.sounds[key].cloneNode();
      soundClone.volume = volume;
      soundClone.play().catch(e => console.warn("Interação necessária para tocar som.", e));
    }
  },

  // Toca música de fundo (BGM)
  playBGM(key, volume) {
    // Para a música anterior, se houver
    this.stopBGM();

    if (this.sounds[key]) {
      this.currentBGM = this.sounds[key];
      this.currentBGM.loop = true;
      this.currentBGM.volume = volume;
      this.currentBGM.play().catch(e => console.warn("Navegador bloqueou o autoplay da música.", e));
    }
  },

  stopBGM() {
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
      this.currentBGM = null;
    }
  }
};