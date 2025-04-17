// Function to inject or update the custom UI
function injectOrUpdateUI() {
  const existingUI = document.getElementById('yt-speed-controller');

  // If the UI already exists, remove it to avoid duplication
  if (existingUI) {
    existingUI.remove();
  }

  // HTML content for the UI
  const uiHTML = `
    <div id="yt-speed-controller" style="border-radius: 10px; display:flex; position: fixed; top: 10%; right: 100px; background: white; border: 1px solid #ccc; z-index: 10000; padding: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5); cursor: move;">
      <div id="speed-controls" style="display: block; margin-top: 5px; padding: 0px;">
        <button data-speed="1">1x</button>
        <button data-speed="1.25">1.25x</button>
        <button data-speed="1.5">1.5x</button>
        <button data-speed="2">2x</button>
      </div>
      <button id="toggle-speed-control" style="padding: 5px; background: transparent; border: none;">
        <span id="toggle-text" style="display: none;">YT</span>
        <img style="width: 10px; height: 10px;" src="https://img.icons8.com/ios-glyphs/20/000000/expand-arrow.png" alt="Toggle" id="toggle-icon">
      </button>
    </div>
  `;

  // Create a new div and set its HTML content
  const uiContainer = document.createElement('div');
  uiContainer.innerHTML = uiHTML;

  // Append the UI container to the body
  document.body.appendChild(uiContainer);

  // Add event listener to the toggle button
  document.getElementById('toggle-speed-control').addEventListener('click', () => {
    const speedControls = document.getElementById('speed-controls');
    const ytSpeedController = document.getElementById('yt-speed-controller');
    const toggleIcon = document.getElementById('toggle-icon');
    const ytText = document.getElementById('toggle-text');
    if (speedControls.style.display === 'none') {
      speedControls.style.display = 'block';
      ytSpeedController.style.padding = '5px';
      ytSpeedController.style.width = '180px';
      toggleIcon.style.display = 'block';
      ytText.style.display = 'none';
    } else {
      speedControls.style.display = 'none';
      ytSpeedController.style.padding = '0px';
      ytSpeedController.style.width = '30px';
      toggleIcon.style.display = 'none';
      ytText.style.display = 'block';
    }
  });

  // Add event listeners to the speed buttons
  const buttons = uiContainer.querySelectorAll('#speed-controls button');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      const speed = parseFloat(event.target.dataset.speed);
      setPlaybackSpeed(speed);
    });
  });

  // Make the UI draggable
  makeDraggable(document.getElementById('yt-speed-controller'));
}

// Function to set the playback speed of the YouTube video
function setPlaybackSpeed(speed) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = speed;
  }
}

// Function to make the UI draggable
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let isDragging = false;

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    isDragging = true;
    document.onmouseup = closeDragElement;
    document.onmousemove = throttle(elementDrag, 16); // Throttle the dragging function to 60fps
  }

  function elementDrag(e) {
    if (!isDragging) return;

    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    requestAnimationFrame(() => {
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    });
  }

  function closeDragElement() {
    isDragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

function monitorYouTubeNavigation() {
  let lastUrl = location.href;

  // 用於觀察 <title> 變動（通常代表影片換了）
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => {
        injectOrUpdateUI(); // 重新注入 UI
      }, 500); // 延遲一點點讓影片元素載入完成
    }
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.querySelector('title'), config);
}

// Inject or update the UI when the content script is loaded
injectOrUpdateUI();
// monitorYouTubeNavigation();