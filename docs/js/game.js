(async () => {
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remaining = [...pairs];
  let hits = 0;
  const total = pairs.length;

  document.getElementById('total').textContent = total;
  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  let current;

  function newTarget() {
    const idx = Math.floor(Math.random() * remaining.length);
    current = remaining[idx];
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
        // убираем отгаданную пару
        remaining = remaining.filter(p => p.translate !== pair.translate);
        if (remaining.length === 0) {
          Telegram.WebApp.sendData(JSON.stringify({ hits, total }));
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
    remaining.forEach(spawnBalloon);
  }

  // старт игры
  renderBalloons();
  newTarget();
})();

