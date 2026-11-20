if (!document.getElementById('yt-speed-controller')) {
  const controller = document.createElement('div');
  controller.id = 'yt-speed-controller';

  const style = document.createElement('style');
  style.textContent = `
    #yt-speed-controller {
      align-items: center;
      gap: 4px;
      padding: 6px;
      background: rgba(15, 15, 15, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
      color: #fff;
      opacity: 0;
      pointer-events: none;
      user-select: none;
      transition: opacity 180ms ease;
    }

    #yt-speed-controller.yt-speed-visible {
      opacity: 1;
      pointer-events: auto;
    }

    #yt-speed-controller .yt-speed-button {
      min-width: 42px;
      padding: 6px 8px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: #eee;
      font: 600 12px/1 "Roboto", "Segoe UI", "Helvetica Neue", system-ui, sans-serif;
      cursor: pointer;
      transition: background-color 120ms ease, color 120ms ease, transform 120ms ease;
    }

    #yt-speed-controller .yt-speed-button:hover,
    #yt-speed-controller .yt-speed-button:focus-visible {
      background: #ff0033;
      color: #fff;
      outline: none;
    }

    #yt-speed-controller .yt-speed-button:active {
      transform: scale(0.95);
    }

  `;
  document.head.appendChild(style);

  controller.style.position = 'fixed';
  controller.style.top = '0px';
  controller.style.zIndex = '9999';
  controller.style.fontSize = '12px';
  controller.style.fontFamily = '"Roboto", "Segoe UI", "Helvetica Neue", system-ui, sans-serif';
  controller.style.cursor = 'move';
  controller.style.display = 'flex';

  // 建立速度按鈕
  [1, 1.25, 1.5, 2].forEach(speed => {
    const btn = document.createElement('button');
    btn.innerText = speed + 'x';
    btn.className = 'yt-speed-button';
    btn.type = 'button';

    btn.addEventListener('click', () => {
      const video = document.querySelector('video');
      if (video) {
        video.playbackRate = speed;
      } else {
        alert('找不到影片');
      }

      // 🟢 讓焦點回到播放器;
      const player = document.querySelector('.html5-video-player');
      if (player) {
        player.focus();
      } else {
        document.body.focus();
      }
    });

    controller.appendChild(btn);
  });

  document.body.appendChild(controller);

  let hideTimeout;

  function showController() {
    controller.classList.add('yt-speed-visible');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      controller.classList.remove('yt-speed-visible');
    }, 5000);
  }

  // 放到右上角
  requestAnimationFrame(() => {
    const paddingRight = 10;
    const initialLeft = window.innerWidth - controller.offsetWidth - paddingRight;
    controller.style.left = `${initialLeft}px`;
  });

  // 拖曳功能
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  controller.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    const rect = controller.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    controller.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    showController();
    if (!isDragging) return;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    const maxLeft = window.innerWidth - controller.offsetWidth;
    const maxTop = window.innerHeight - controller.offsetHeight;

    newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    newTop = Math.max(0, Math.min(maxTop, newTop));

    controller.style.left = `${newLeft}px`;
    controller.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    controller.style.cursor = 'move';
  });

  // 定義移動控制器到右上角的函式
  function moveControllerToTopRight() {
    const controller = document.getElementById('yt-speed-controller');
    if (!controller) return;

    const paddingRight = 10;
    const newLeft = window.innerWidth - controller.offsetWidth - paddingRight;
    controller.style.left = `${newLeft}px`;
    controller.style.top = '0px';
  }

  // 視窗大小改變時重新定位
  window.addEventListener('resize', moveControllerToTopRight);

  // 切換全螢幕時重新定位
  document.addEventListener('fullscreenchange', moveControllerToTopRight);
}