(async () => {
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let hits = 0;
  const total = pairs.length;
  document.getElementById('total').textContent = total;

  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  let current = null;

  function newTarget() {
    current = pairs[Math.floor(Math.random() * pairs.length)];
    targetEl.textContent = current.translate;
  }

  function spawnBalloon(pair, delay) {
    const el = document.createElement('div');
    el.className = 'balloon';
    el.textContent = pair.word;
    el.style.left = Math.random() * 80 + '%';
    el.style.animationDuration = (5 + Math.random() * 5) + 's';
    el.style.animationDelay = delay + 's';
    el.addEventListener('click', () => {
      if (pair.translate === current.translate) {
        hits++;
        document.getElementById('hits').textContent = hits;
        el.remove();
        if (hits >= total) finishGame();
        else newTarget();
      } else {
        // неверный шарик — можно отдать фидбэк визуально
        el.style.background = '#e57373';
        setTimeout(() => el.style.background = '#ff8a65', 300);
      }
    });
    container.appendChild(el);
  }

  function finishGame() {
    const data = { hits, total };
    Telegram.WebApp.sendData(JSON.stringify(data));
  }

  // Запускаем игру
  newTarget();
  // Спавним шарики
  pairs.forEach((p, i) => spawnBalloon(p, i * 0.5));
})();
