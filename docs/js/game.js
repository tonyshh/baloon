(async () => {
  const res = await fetch('data/pairs.json');
  const pairs = await res.json();
  let remaining = [...pairs];
  let hits = 0;
  const total = pairs.length;

  const container = document.getElementById('balloon-container');
  const targetEl = document.getElementById('target-word');
  document.getElementById('total').textContent = total;

  function showEndScreen() {
    console.log("🛑 showEndScreen called, hits=", hits, "total=", total);
  // Прячем все игровые элементы
  document.getElementById('balloon-container').style.display = 'none';
  document.getElementById('target').style.display = 'none';
  document.getElementById('score').style.display = 'none';

  // Рендерим оверлей
  const game = document.getElementById('game');
  const end = document.createElement('div');
  end.id = 'end-screen';
  end.innerHTML = `
    <p>🎉 Поздравляем!</p>
    <p>Ты лопнул все ${total} шариков за ${hits} ход${hits % 10 === 1 && hits !== 11 ? '' : 'ов'}!</p>
    <button id="end-button">Закрыть</button>
  `;
  game.appendChild(end);

  // Кнопка закрытия
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
          // правильный шарик
          hits++;
          document.getElementById('hits').textContent = hits;

          // удаляем из remaining и из DOM
          remaining = remaining.filter(p => p.translate !== pair.translate);
          el.remove();

          if (remaining.length === 0) {
            // последний шарик
            Telegram.WebApp.sendData(JSON.stringify({ hits, total }));
            showEndScreen();
          } else {
            // новая цель
            current = pickTarget();
            targetEl.textContent = current.translate;
            renderBalloons();
          }
        } else {
          // неверный — подсветка
          el.style.background = '#e57373';
          setTimeout(() => el.style.background = '#ff8a65', 300);
        }
      });

      container.appendChild(el);
    });
  }

  // запускаем игру
  renderBalloons();
})();
