(async () => {
  // 1. Подгружаем пары из JSON
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remaining = [...pairs];
  let hits = 0;
  const total = pairs.length;

  // 2. Ссылки на DOM
  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  document.getElementById('total').textContent = total;

  // 3. Выбирает случайную пару
  function pickTarget() {
    const idx = Math.floor(Math.random() * remaining.length);
    return remaining[idx];
  }

  // 4. Показывает финальный экран
  function showEndScreen() {
    console.log("🛑 showEndScreen called, hits=", hits, "total=", total);
    // скрываем старые элементы
    document.getElementById('balloon-container').style.display = 'none';
    document.getElementById('target').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    // рисуем оверлей
    const game = document.getElementById('game');
    const end = document.createElement('div');
    end.id = 'end-screen';
    end.innerHTML = `
      <p>🎉 Поздравляем!</p>
      <p>Ты лопнул все ${total} шариков за ${hits} ход${hits % 10 === 1 && hits !== 11 ? '' : 'ов'}!</p>
      <button id="end-button">Закрыть</button>
    `;
    game.appendChild(end);
    document
      .getElementById('end-button')
      .addEventListener('click', () => Telegram.WebApp.close());
  }

  // 5. Начальная цель
  let current = pickTarget();
  targetEl.textContent = current.translate;

  // 6. Функция отрисовки шариков
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
          // удаляем из массива и DOM
          remaining = remaining.filter(p => p.translate !== pair.translate);
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
          // неверный — короткая подсветка
          el.style.background = '#e57373';
          setTimeout(() => el.style.background = '#ff8a65', 300);
        }
      });

      container.appendChild(el);
    });
  }

  // 7. Старт игры
  renderBalloons();
})();
