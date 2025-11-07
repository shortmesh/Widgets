(function () {
  const script = document.currentScript;
  const containerId =
    script.getAttribute("data-container-id") || "shortmesh-widget";

  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "stylesheet";
  fontAwesome.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
  fontAwesome.crossOrigin = "anonymous";
  document.head.appendChild(fontAwesome);

  const style = document.createElement("style");
  style.textContent = `
    .shortmesh-widget-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      box-sizing: border-box;
    }
    .shortmesh-widget-container * {
      box-sizing: border-box;
    }
    .shortmesh-header-text {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 20px 0 40px 0;
      text-align: center;
      line-height: 1.4;
    }
    .shortmesh-platforms {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .shortmesh-platform-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 6px 10px;
      background: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 16px;
      font-weight: 500;
      color: #374151;
      text-align: left;
      width: 100%;
    }
    .shortmesh-platform-btn:hover {
      border-color: #3F51B5;
      background: #f8f9ff;
      transform: translateY(-2px);
      // box-shadow: 0 4px 4px -1px rgba(59, 71, 237, 0.15);
    }
    .shortmesh-platform-btn.selected {
      border-color: #3F51B5;
      background: #f0f2ff;
      // box-shadow: 0 0 0 3px rgba(59, 71, 237, 0.1);
    }
    .shortmesh-platform-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
      font-size: 24px;
    }
    .shortmesh-platform-icon.whatsapp {
      color: #25D366;
    }
    .shortmesh-platform-icon.telegram {
      color: #0088cc;
    }
    .shortmesh-platform-icon.signal {
      color: #3A76F0;
    }
    .shortmesh-platform-name {
      flex: 1;
      font-weight: 500;
    }
    .shortmesh-button-group {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      margin-top: 40px;
    }
    .shortmesh-button {
      flex: 1;
      padding: 8px 20px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      border: none;
    }
    .shortmesh-button-cancel {
      background: #ffffff;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .shortmesh-button-cancel:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
    .shortmesh-button-cancel:active {
      transform: scale(0.98);
    }
    .shortmesh-button-continue {
      background: #3B47ED;
      color: #ffffff;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .shortmesh-button-continue:hover {
      background: #2f3bdb;
      box-shadow: 0 4px 6px -1px rgba(59, 71, 237, 0.3);
    }
    .shortmesh-button-continue:active {
      transform: scale(0.98);
    }
    .shortmesh-button-continue:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      box-shadow: none;
    }
    .shortmesh-footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 40px;
    }
    .shortmesh-footer a {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
    }
    .shortmesh-footer a:hover {
      color: #3B47ED;
    }
    .shortmesh-success-view {
      display: none;
      text-align: center;
    }
    .shortmesh-success-view.active {
      display: block;
    }
    .shortmesh-success-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 20px 0 30px 0;
      line-height: 1.4;
    }
    .shortmesh-checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      // background: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px;
      animation: scaleIn 0.3s ease;
    }
    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
    .shortmesh-checkmark i {
      color: #1a1a1aff;
      font-size: 50px;
    }
    .shortmesh-success-message {
      font-size: 15px;
      color: #6b7280;
      margin-bottom: 40px;
      line-height: 1.5;
    }
    .shortmesh-platform-view {
      display: block;
    }
    .shortmesh-platform-view.hidden {
      display: none;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = containerId;
  container.className = "shortmesh-widget-container";
  container.innerHTML = `
    <div class="shortmesh-platform-view">
      <h1 class="shortmesh-header-text">Select a platform to get your verification code.</h1>
      
      <div class="shortmesh-platforms">
        <button class="shortmesh-platform-btn" data-platform="whatsapp">
          <div class="shortmesh-platform-icon whatsapp">
            <i class="fa-brands fa-whatsapp"></i>
          </div>
          <span class="shortmesh-platform-name">WhatsApp</span>
        </button>

        <button class="shortmesh-platform-btn" data-platform="signal">
          <div class="shortmesh-platform-icon signal">
            <i class="fa-brands fa-signal-messenger"></i>
          </div>
          <span class="shortmesh-platform-name">Signal</span>
        </button>
        
        <button class="shortmesh-platform-btn" data-platform="telegram">
          <div class="shortmesh-platform-icon telegram">
            <i class="fa-brands fa-telegram"></i>
          </div>
          <span class="shortmesh-platform-name">Telegram</span>
        </button>
      </div>

      <div class="shortmesh-button-group">
        <button id="shortmesh-cancel" class="shortmesh-button shortmesh-button-cancel">Cancel</button>
        <button id="shortmesh-continue" class="shortmesh-button shortmesh-button-continue" disabled>Continue</button>
      </div>
    </div>

    <div class="shortmesh-success-view">
      <h1 class="shortmesh-success-title" id="shortmesh-success-title">Verification code sent to <span id="shortmesh-platform-name"></span></h1>
      
      <div class="shortmesh-checkmark">
        <i class="fa-solid fa-check"></i>
      </div>
      
      <p class="shortmesh-success-message" id="shortmesh-success-message">Please check your <span id="shortmesh-platform-inbox"></span> inbox</p>
    </div>

    <div class="shortmesh-footer">
      Powered by <a href="https://shortmesh.com" target="_blank">ShortMesh</a>
    </div>
  `;

  document.body.appendChild(container);

  let selectedPlatform = null;
  const platformButtons = container.querySelectorAll(".shortmesh-platform-btn");
  const continueButton = container.querySelector("#shortmesh-continue");

  platformButtons.forEach((button) => {
    button.addEventListener("click", () => {
      platformButtons.forEach((btn) => btn.classList.remove("selected"));

      button.classList.add("selected");

      selectedPlatform = button.getAttribute("data-platform");

      continueButton.disabled = false;
    });
  });

  continueButton.addEventListener("click", () => {
    if (selectedPlatform) {
      const platformName =
        selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);

      container
        .querySelector(".shortmesh-platform-view")
        .classList.add("hidden");

      const successView = container.querySelector(".shortmesh-success-view");
      successView.classList.add("active");

      container.querySelector("#shortmesh-platform-name").textContent =
        platformName;
      container.querySelector("#shortmesh-platform-inbox").textContent =
        platformName;

      const event = new CustomEvent("shortmesh-platform-selected", {
        detail: { platform: selectedPlatform },
      });
      document.dispatchEvent(event);
    }
  });

  container.querySelector("#shortmesh-cancel").addEventListener("click", () => {
    platformButtons.forEach((btn) => btn.classList.remove("selected"));
    selectedPlatform = null;
    continueButton.disabled = true;
  });
})();
