const CollisionSystem = {
  isColliding(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  },

  distance(a, b) {
    const centerAX = a.x + a.width / 2;
    const centerAY = a.y + a.height / 2;

    const centerBX = b.x + b.width / 2;
    const centerBY = b.y + b.height / 2;

    return Math.hypot(centerAX - centerBX, centerAY - centerBY);
  }
};