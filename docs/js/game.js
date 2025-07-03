(async () => {
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remainingPairs = [...pairs];
  let hits = 0;
  const total = pairs.length;

  document.getElementById('total').textContent = total;
  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  let current = null;

  function newTarget() {
    // выбираем случайную из оставшихся пар
    const idx = Math.floor(Math.random() * remainingPairs.length);
    current = remainingPairs[idx];
    targetEl.textContent = current.translate;
  }

  function spawnBalloon(pair) {
    const el = document.createElement('div');
    el.className = 'balloon';
    el.textContent = pair.word;
    el.style.left = Math.random() * 80 + '%';
    el.style.animationDuration = (5 + Math.random() * 5) + 's';
    el.addEventListener('click', () => {
      if (pair.translate === current.translate) {
        hits++;
        document.getElementById('hits').textContent = hits;
        // убираем из remainingPairs
        remainingPairs = remainingPairs.filter(p => p.translate !== pair.translate);
        // если все пары отгаданы — конец
        if (remainingPairs.length === 0) {
          finishGame();
        } else {
          renderBalloons();
          newTarget();
        }
      } else {
        el.style.background = '#e57373';
        setTimeout(() => el.style.background = '#ff8a65', 300);
      }
    });
    container.appendChild(el);
  }

  function renderBalloons() {
    container.innerHTML = '';
    remainingPairs.forEach(spawnBalloon);
  }

  function finishGame() {
    Telegram.WebApp.sendData(JSON.stringify({ hits, total }));
  }

  // старт игры
  renderBalloons();
  newTarget();
})();

