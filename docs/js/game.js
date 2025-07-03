(async () => {
  // 1) Загружаем пары:
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remaining = [...pairs];
  let hits = 0;
  const total = pairs.length;

  // 2) Ссылки на DOM:
  const container = document.getElementById('balloon-container');
  const targetEl  = document.getElementById('target-word');
  document.getElementById('total').textContent = total;

  // 3) Помощник для случайного выбора:
  function pickTarget() {
    return remaining[Math.floor(Math.random() * remaining.length)];
  }

  // 4) Показываем финальный экран:
  function showEndScreen() {
    console.log("🛑 showEndScreen called, hits=", hits, "total=", total);
    const game = document.getElementById('game');
    // полная очистка и замена разметки:
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

  // 5) Устанавливаем первую цель:
  let current = pickTarget();
  targetEl.textContent = current.translate;

  // 6) Рендер шариков:
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
          // правильный шарик
          hits++;
          document.getElementById('hits').textContent = hits;
          remaining = remaining.filter(p => p.translate !== pair.translate);
          // и сразу удаляем элемент
          el.remove();

          if (remaining.length === 0) {
            // последний шарик
            Telegram.WebApp.sendData(JSON.stringify({ hits, total }));
            showEndScreen();
          } else {
            // новая цель и перерисовка
            current = pickTarget();
            targetEl.textContent = current.translate;
            renderBalloons();
          }
        } else {
          // неверно — подсветка
          el.style.background = '#e57373';
          setTimeout(() => el.style.background = '#ff8a65', 300);
        }
      });

      container.appendChild(el);
    });
  }

  // 7) Старт
  renderBalloons();
})();
