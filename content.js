// 檢查是否已經加載過控制器，避免重複注入
if (!document.getElementById('yt-speed-controller')) {

  // 創建控制器容器
  const controller = document.createElement('div');
  controller.id = 'yt-speed-controller';

  // 設定樣式
  controller.style.position = 'fixed';
  controller.style.top = '20%';
  controller.style.right = '20px';
  controller.style.zIndex = '9999';
  controller.style.background = 'white';
  controller.style.border = '1px solid #ccc';
  controller.style.borderRadius = '10px';
  controller.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
  controller.style.padding = '2px'; // 外圍 padding 設為 2px
  controller.style.fontSize = '16px';
  controller.style.fontFamily = 'sans-serif';
  controller.style.cursor = 'move'; // 提示可移動

  // 可選速度清單
  const speeds = [1, 1.25, 1.5, 2];

  // 創建按鈕們
  speeds.forEach(speed => {
    const btn = document.createElement('button');
    btn.innerText = speed + 'x';
    btn.style.margin = '2px';
    btn.style.padding = '5px 10px';
    btn.style.cursor = 'pointer';

    // 點擊時改變影片速度
    btn.addEventListener('click', () => {
      const video = document.querySelector('video');

      // 若找到影片，設定播放速度
      if (video) {
        video.playbackRate = speed;
      } else {
        alert('找不到影片');
      }
    });

    controller.appendChild(btn);
  });

  // 允許拖動功能
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  controller.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - controller.getBoundingClientRect().left;
    offsetY = e.clientY - controller.getBoundingClientRect().top;
    controller.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      controller.style.left = `${e.clientX - offsetX}px`;
      controller.style.top = `${e.clientY - offsetY}px`;
      controller.style.right = 'auto'; // 移除原本固定位置
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    controller.style.cursor = 'move';
  });

  // 加到頁面上
  document.body.appendChild(controller);
}