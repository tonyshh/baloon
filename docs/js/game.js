(async () => {
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remaining = [...pairs];
  let hits = 0;
  const total = pairs.length;

  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  document.getElementById('total').textContent = total;

  // Выбирает случайную пару из remaining
  function pickTarget() {
    const idx = Math.floor(Math.random() * remaining.length);
    return remaining[idx];
  }

  // Устанавливаем первую цель
  let current = pickTarget();
  targetEl.textContent = current.translate;

  // Рендерим все шары из remaining
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
          // угадали
          hits++;
          document.getElementById('hits').textContent = hits;

          // удаляем отгаданную пару
          remaining = remaining.filter(p => p.translate !== pair.translate);
          // сразу убираем шарик из DOM+
          el.remove();

          if (remaining.length === 0) {
            // все отгадали
            Telegram.WebApp.sendData(JSON.stringify({ hits, total }));
          } else {
            // новая цель
            current = pickTarget();
            targetEl.textContent = current.translate;
            renderBalloons();
          }
        } else {
          // неверно — короткая подсветка
          el.style.background = '#e57373';
          setTimeout(() => el.style.background = '#ff8a65', 300);
        }
      });
      container.appendChild(el);
    });
  }

  // старт
  renderBalloons();
})();
