(async () => {
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remaining = [...pairs];
  let hits = 0;
  const total = pairs.length;

  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  const hitsEl = document.getElementById('hits');
  const totalEl = document.getElementById('total');

  totalEl.textContent = total;

  function pickTarget() {
    return remaining[Math.floor(Math.random() * remaining.length)];
  }

  function showEndScreen() {
    console.log("✅ showEndScreen — hits:", hits);
    const game = document.getElementById('game');
    game.innerHTML = `
      <div id="end-screen">
        <p>🎉 Поздравляем!</p>
        <p>Ты лопнул все ${total} шариков за ${hits} ход${hits % 10 === 1 && hits !== 11 ? '' : 'ов'}!</p>
        <button id="end-button">Закрыть</button>
      </div>
    `;
    document
      .getElementById('end-button')
      .addEventListener('click', () => Telegram.WebApp.close());
  }

  let current = pickTarget();
  targetEl.textContent = current.translate;

  function renderBalloons() {
    container.innerHTML = '';
    remaining.forEach(pair => {
      const el = document.createElement('div');
      el.className = 'balloon';
      el.textContent = pair.word;
      el.style.left = Math.random() * 80 + '%';
      el.style.animationDuration = (5 + Math.random() * 5) + 's';

      el.addEventListener('click', () => {
        if (pair.translate === current.translate) {
          hits++;
          hitsEl.textContent = hits;
          remaining = remaining.filter(p => p !== pair);
          el.remove();

          if (remaining.length === 0) {
            Telegram.WebApp.sendData(JSON.stringify({ hits, total }));
            showEndScreen();
          } else {
            current = pickTarget();
            targetEl.textContent = current.translate;
            renderBalloons();
          }
        } else {
          el.style.background = '#e57373';
          setTimeout(() => el.style.background = '#ff8a65', 300);
        }
      });

      container.appendChild(el);
    });
  }

  renderBalloons();
})();
