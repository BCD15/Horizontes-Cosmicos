const AssetLoader = {
  images: {},

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };

      img.onerror = () => {
        reject(`Erro ao carregar imagem: ${src}`);
      };

      img.src = src;
    });
  },

  getImage(key) {
    return this.images[key];
  }
};