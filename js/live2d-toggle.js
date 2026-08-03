// source/js/live2d-toggle.js
// 看板娘由 L2Dwidget.init() 异步创建，需等容器出现后再绑定关闭按钮

function getLive2dContainer() {
    return document.getElementById('live2d-widget') ||
           document.querySelector('.live2d-widget-container') ||
           document.querySelector('[class*="live2d"]');
}

function initLive2dToggle() {
    const live2dContainer = getLive2dContainer();
    if (!live2dContainer) return false;

    // 避免重复初始化（例如 pjax 或多次调用）
    if (document.getElementById('live2d-close-btn')) return true;

    let isShowLive2d = true;

    const closeBtn = document.createElement('div');
    closeBtn.id = 'live2d-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: fixed;
        bottom: 280px;
        left: 60px;
        width: 24px;
        height: 24px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0,0,0,0.2);
        text-align: center;
        line-height: 22px;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        z-index: 99999;
        user-select: none;
    `;
    document.body.appendChild(closeBtn);

    live2dContainer.style.display = 'block';

    closeBtn.addEventListener('click', function() {
        const container = getLive2dContainer();
        if (!container) return;
        if (container.style.display === 'none') {
            container.style.display = 'block';
            isShowLive2d = true;
            closeBtn.style.background = '#fff';
            closeBtn.style.color = '#666';
        } else {
            container.style.display = 'none';
            isShowLive2d = false;
            closeBtn.style.background = '#f44336';
            closeBtn.style.color = '#fff';

            // 隐藏关闭按钮，若不隐藏，则是切换看板娘是否展示
            closeBtn.style.display = 'none';
        }
    });

    closeBtn.addEventListener('mouseover', function() {
        if (isShowLive2d) {
            this.style.background = '#f44336';
            this.style.color = '#fff';
        }
    });
    closeBtn.addEventListener('mouseout', function() {
        if (isShowLive2d) {
            this.style.background = '#fff';
            this.style.color = '#666';
        }
    });

    return true;
}

// 等待看板娘容器出现后再初始化（L2Dwidget 异步创建 DOM）
function waitAndInit() {
    if (initLive2dToggle()) return;
    var attempts = 0;
    var maxAttempts = 100; // 约 10 秒
    var timer = setInterval(function() {
        if (initLive2dToggle() || ++attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitAndInit);
} else {
    waitAndInit();
}