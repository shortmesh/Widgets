(function () {
  let widgetConfig = {
    phoneNumber: null,
    apiEndpoint: null
  };

  function createWidget(config = {}) {
    widgetConfig.phoneNumber = config.phoneNumber || null;
    widgetConfig.apiEndpoint = config.apiEndpoint || ''; 
    
    if (!widgetConfig.phoneNumber) {
      console.error('ShortMesh Widget: Phone number is required');
      return;
    }
    
    const overlay = document.createElement("div");
    overlay.id = "shortmesh-overlay";

    overlay.innerHTML = `
      <div class="shortmesh-modal">
        <div class="shortmesh-close">&times;</div>
        <div id="shortmesh-content"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const content = overlay.querySelector("#shortmesh-content");
    const closeBtn = overlay.querySelector(".shortmesh-close");

    closeBtn.onclick = () => overlay.remove();

    function renderSelect() {
      content.innerHTML = `
        <h2>Verify your account</h2>
        <p>Select where you'd like to receive your code.</p>

        <div class="shortmesh-platform-list">
          <div class="shortmesh-platform" data-platform="whatsapp">
            <span class="icon"><img style="width: 30px; height: 30px;" src="WhatsApp.svg" alt="Whatsapp" /></span> Whatsapp
          </div>
          <div class="shortmesh-platform" data-platform="signal">
            <span class="icon"><img style="width: 24px; height: 24px;" src="Signal-Logo.svg" alt="Signal" /></span> Signal
          </div>
          <div class="shortmesh-platform" data-platform="telegram">
            <span class="icon"><img style="width: 24px; height: 24px;" src="Logo.svg" alt="Telegram" /></span> Telegram
          </div>
        </div>

        <div class="shortmesh-buttons">
          <button class="btn secondary">Cancel</button>
          <button class="btn primary" disabled>Continue</button>
        </div>

        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;

      let selected = null;
      const platforms = content.querySelectorAll(".shortmesh-platform");
      const continueBtn = content.querySelector(".primary");

      platforms.forEach((el) => {
        el.onclick = () => {
          platforms.forEach(p => p.classList.remove("active"));
          el.classList.add("active");
          selected = el.dataset.platform;
          continueBtn.disabled = false;
        };
      });

      content.querySelector(".secondary").onclick = () => overlay.remove();

      continueBtn.onclick = async () => {
        await sendToAPI(selected);
        renderOTP(selected);
      };
    }

    async function sendToAPI(platform) {
      const payload = {
        phoneNumber: widgetConfig.phoneNumber,
        platform: platform
      };

      // TODO: When API is ready
      console.log('ShortMesh: Would send to API:', payload);
      console.log('API Endpoint:', widgetConfig.apiEndpoint);

      /* 
      try {
        const response = await fetch(widgetConfig.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error('ShortMesh API Error:', response.statusText);
        }

        const data = await response.json();
        console.log('ShortMesh API Response:', data);
        return data;
      } catch (error) {
        console.error('ShortMesh API Request Failed:', error);
      }
      */
    }

    function renderOTP(platform) {
      content.innerHTML = `
        <h2>Enter verification code</h2>
        <p>sent via <strong>${platform}</strong></p>

        <div class="shortmesh-otp">
          ${Array(6).fill(0).map((_, i) =>
            `<input type="text" maxlength="1" class="otp-box" id="otp-${i}" />`
          ).join("")}
        </div>

        <div class="shortmesh-resend">
          <span class="resend-text">Didn't receive a code? <a href="#" class="resend-link disabled">Resend</a></span>
          <span class="resend-timer">Available in <strong>30s</strong></span>
        </div>

        <div class="shortmesh-buttons">
          <button class="btn secondary">Go back</button>
          <button class="btn primary">Continue</button>
        </div>

        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;

      const inputs = content.querySelectorAll(".otp-box");
      const resendLink = content.querySelector(".resend-link");
      const resendTimer = content.querySelector(".resend-timer");
      let timeLeft = 30;

      const countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
          resendTimer.innerHTML = `Available in <strong>${timeLeft}s</strong>`;
        } else {
          clearInterval(countdown);
          resendTimer.style.display = "none";
          resendLink.classList.remove("disabled");
        }
      }, 1000);

      resendLink.onclick = (e) => {
        e.preventDefault();
        if (!resendLink.classList.contains("disabled")) {
          
          timeLeft = 30;
          resendTimer.style.display = "inline";
          resendTimer.innerHTML = `Available in <strong>${timeLeft}s</strong>`;
          resendLink.classList.add("disabled");
          inputs.forEach(input => input.value = "");
          inputs[0].focus();
          
          
          const newCountdown = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
              resendTimer.innerHTML = `Available in <strong>${timeLeft}s</strong>`;
            } else {
              clearInterval(newCountdown);
              resendTimer.style.display = "none";
              resendLink.classList.remove("disabled");
            }
          }, 1000);
        }
      };

      inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          if (!/^[0-9]$/.test(e.target.value)) {
            e.target.value = "";
            return;
          }
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        });

        input.addEventListener("keydown", (e) => {
          if (e.key === "Backspace") {
            if (input.value === "") {
              if (index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = "";
              }
            } else {
              input.value = "";
            }
            e.preventDefault();
          }
        });
      });

      content.querySelector(".secondary").onclick = renderSelect;
      content.querySelector(".primary").onclick = () => renderLoading(platform);
    }

    function renderLoading(platform) {
      content.innerHTML = `
        <h2>Verifying...</h2>
        <p>Checking your code</p>
        <div class="shortmesh-spinner"></div>
        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;

      // replace with API call
      setTimeout(() => {
        renderSuccess();
      }, 2000);
    }

    function renderSuccess() {
      content.innerHTML = `
        <h2>Verified Successfully</h2>
        <div class="shortmesh-check">✓</div>
        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;
    }

    renderSelect();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
      #shortmesh-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: Inter, sans-serif;
        padding: 16px;
      }

      .shortmesh-modal {
        background: #f3f3f3;
        width: 100%;
        max-width: 360px;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        text-align: center;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      }

      @media (max-width: 480px) {
        .shortmesh-modal {
          padding: 20px;
          border-radius: 12px;
        }
      }

      .shortmesh-close {
        position: absolute;
        right: 18px;
        top: 14px;
        cursor: pointer;
        font-size: 18px;
      }

      h2 {
        margin-bottom: 8px;
        font-size: 24px;
      }

      @media (max-width: 480px) {
        h2 {
          font-size: 20px;
        }
      }

      p {
        font-size: 14px;
        color: #555;
        margin-bottom: 20px;
      }

      @media (max-width: 480px) {
        p {
          font-size: 13px;
        }
      }

      .shortmesh-platform-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .shortmesh-platform {
        padding: 14px;
        border-radius: 10px;
        background: #fff;
        border: 1px solid #ddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .shortmesh-platform.active {
        border: 2px solid #4b5bdc;
      }

      .icon {
        font-size: 20px;
      }

      .shortmesh-buttons {
        display: flex;
        gap: 12px;
      }

      .btn {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 14px;
      }

      .btn.primary {
        background: #4b5bdc;
        color: white;
      }

      .btn.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn.secondary {
        background: #e6e6e6;
      }

      .shortmesh-otp {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 24px;
      }

      @media (max-width: 380px) {
        .shortmesh-otp {
          gap: 6px;
        }
      }

      .otp-box {
        width: 42px;
        height: 48px;
        text-align: center;
        font-size: 18px;
        border-radius: 8px;
        border: 1px solid #ccc;
      }

      @media (max-width: 380px) {
        .otp-box {
          width: 36px;
          height: 42px;
          font-size: 16px;
        }
      }

      .shortmesh-check {
        font-size: 48px;
        margin: 24px 0;
      }

      .shortmesh-footer {
        font-size: 12px;
        color: #777;
        margin-top: 16px;
      }

      .shortmesh-resend {
        font-size: 13px;
        color: #555;
        margin-bottom: 20px;
        text-align: center;
      }

      @media (max-width: 480px) {
        .shortmesh-resend {
          font-size: 12px;
        }
      }

      .resend-link {
        color: #4b5bdc;
        text-decoration: none;
        cursor: pointer;
        font-weight: 500;
      }

      .resend-link:hover:not(.disabled) {
        text-decoration: underline;
      }

      .resend-link.disabled {
        color: #999;
        cursor: not-allowed;
        pointer-events: none;
      }

      .resend-timer {
        display: inline;
        color: #777;
      }

      .shortmesh-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4b5bdc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 24px auto;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  injectStyles();

  window.ShortMeshWidget = {
    open: createWidget,
  };
})();
