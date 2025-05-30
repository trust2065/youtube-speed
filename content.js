if (!document.getElementById('yt-speed-controller')) {
  const controller = document.createElement('div');
  controller.id = 'yt-speed-controller';

  // 控制器樣式
  controller.style.position = 'fixed';
  controller.style.top = '0px';
  controller.style.zIndex = '9999';
  controller.style.background = 'white';
  controller.style.border = '1px solid #ccc';
  controller.style.borderRadius = '10px';
  controller.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
  controller.style.padding = '2px';
  controller.style.fontSize = '12px';
  controller.style.fontFamily = '"Roboto", "Segoe UI", "Helvetica Neue", system-ui, sans-serif';
  controller.style.cursor = 'move';
  controller.style.display = 'flex';

  // 建立速度按鈕
  [1, 1.25, 1.5, 2].forEach(speed => {
    const btn = document.createElement('button');
    btn.innerText = speed + 'x';
    btn.style.margin = '2px';
    btn.style.padding = '0px 4px';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', () => {
      const speedStr = speed === 1 ? '正常' : speed.toString();
      const items = document.querySelectorAll('.ytp-menuitem');
      let clicked = false;

      // 嘗試從設定選單中找對應的速度項目
      items.forEach(item => {
        const label = item.querySelector('.ytp-menuitem-label');
        if (label && label.innerText === speedStr) {
          label.click();
          clicked = true;
        }
      });

      if (!clicked) {
        // 備案：仍直接設定 video 速度（可能不會同步 UI 顯示）
        const video = document.querySelector('video');
        if (video) {
          video.playbackRate = speed;
        } else {
          alert('找不到影片');
        }
      }
    });

    controller.appendChild(btn);
  });

  // 隱藏按鈕
  const toggleBtn = document.createElement('button');
  toggleBtn.innerText = 'x';
  toggleBtn.title = '隱藏控制器';
  toggleBtn.style.all = 'unset';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.marginLeft = '4px';
  toggleBtn.style.padding = '2px';
  toggleBtn.style.fontSize = '14px';

  toggleBtn.addEventListener('click', () => {
    controller.style.display = 'none';

    const reopenBtn = document.createElement('button');
    reopenBtn.innerText = '⚙️';
    reopenBtn.title = '顯示控制器';
    reopenBtn.id = 'yt-speed-reopen-btn';

    reopenBtn.style.position = 'fixed';
    reopenBtn.style.top = '0px';
    reopenBtn.style.right = '0px';
    reopenBtn.style.zIndex = '10000';
    reopenBtn.style.padding = '2px 4px';
    reopenBtn.style.borderRadius = '4px';
    reopenBtn.style.border = '1px solid #ccc';
    reopenBtn.style.background = 'white';
    reopenBtn.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
    reopenBtn.style.cursor = 'pointer';
    reopenBtn.style.fontSize = '14px';

    reopenBtn.addEventListener('click', () => {
      controller.style.display = 'flex';
      reopenBtn.remove();
    });

    document.body.appendChild(reopenBtn);
  });

  controller.appendChild(toggleBtn);
  document.body.appendChild(controller);

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
    isDragging = true;
    const rect = controller.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    controller.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
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
}