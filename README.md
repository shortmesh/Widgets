# ShortMesh Widget

A lightweight, embeddable widget that lets users pick from available platforms to receive an authentication code.

> **Self-hosted only.** This widget is designed to be served from your own infrastructure. Clone this repository, serve the `widget/` directory (along with the SVG assets) from your own domain or CDN, and reference your own URL in the examples below.

---

![ShortMesh widget image](/1.svg)

---

## How it works

1. The widget fetches your available platforms from your API.
2. The user picks one.
3. The widget calls your `onSelect` callback with the chosen platform key and closes itself.
4. You take it from there — send OTP and verify.

---

## Hosting your own instance

1. Clone this repository:
   ```bash
   git clone https://github.com/shortmesh/Widgets.git
   ```
2. Serve the repo root (or `widget/` and its sibling SVG assets) as static files from your own domain.

3. Replace every `https://your-widget-host.com` placeholder in the examples below with your actual URL.

---

## Setup

### HTML

Add one script tag — no build step, no dependencies.

```html
<script src="https://your-widget-host.com/widget/widget.js"></script>
```

Then open the widget from any button or event:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <script src="https://your-widget-host.com/widget/widget.js"></script>
  </head>
  <body>
    <button id="platform-btn">Choose platform</button>

    <script>
      document
        .getElementById("platform-btn")
        .addEventListener("click", function () {
          ShortMeshWidget.open({
            endpoints: {
              platforms: "https://api.yoursite.com/platforms",
            },
            onSelect: function (platform) {
              // platform is the key your API returned, e.g. "wa", "telegram", "signal"
              console.log("User chose:", platform);
            },
            onError: function (error) {
              console.error("Failed to load platforms:", error);
            },
          });
        });
    </script>
  </body>
</html>
```

---

### React

Load the script once (e.g. in `index.html` or via `useEffect`), then call `window.ShortMeshWidget.open()`.

**Option A — script tag in `index.html`**

```html
<!-- public/index.html -->
<script src="https://your-widget-host.com/widget/widget.js"></script>
```

**Option B — load dynamically in a hook**

```js
// src/hooks/useShortMesh.js
import { useEffect } from "react";

export function useShortMesh() {
  useEffect(() => {
    if (document.getElementById("shortmesh-script")) return;
    const script = document.createElement("script");
    script.id = "shortmesh-script";
    script.src = "https://your-widget-host.com/widget/widget.js";
    document.body.appendChild(script);
  }, []);

  return function openWidget({ onSelect, onError } = {}) {
    window.ShortMeshWidget?.open({
      endpoints: {
        platforms: "https://api.yoursite.com/platforms",
      },
      onSelect,
      onError,
    });
  };
}
```

Then use it in any component:

```jsx
// src/components/PlatformPicker.jsx
import { useShortMesh } from "../hooks/useShortMesh";

export function PlatformPicker() {
  const openWidget = useShortMesh();

  function handleClick() {
    openWidget({
      onSelect: (platform) => {
        console.log("User chose:", platform); // "wa" | "telegram" | "signal"
        // kick off your OTP flow here
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }

  return <button onClick={handleClick}>Choose platform</button>;
}
```

---

## Configuration

| Option                | Type     | Required | Description                                                |
| --------------------- | -------- | -------- | ---------------------------------------------------------- |
| `endpoints.platforms` | string   | Yes      | URL that returns your available platforms                  |
| `onSelect`            | function | No       | Called with the chosen platform key when the user confirms |
| `onError`             | function | No       | Called if the platforms request fails                      |

### Platforms endpoint

Your endpoint should return a JSON array:

```json
[{ "platform": "wa" }]
```

The widget maps these against its built-in registry and only shows platforms it recognises. Unknown platforms are silently skipped.

### `onSelect` callback

```js
onSelect: (platform) => {
  // platform is a string key, e.g. "wa", "telegram", "signal"
};
```

The modal closes automatically after `onSelect` is called.

---

## Supported platforms

| Key        | Platform |
| ---------- | -------- |
| `wa`       | WhatsApp |
| `signal`       | Signal |

[Authy](https://github.com/shortmesh/Authy-API) is working to add more platforms.

---

## Troubleshooting

### Assets 404 in Vite dev server

The widget loads its platform icons (e.g. `WhatsApp.svg`, `Telegram.svg`, `Signal.svg`) relative to the URL of `widget.js` itself. During local development with Vite, `document.currentScript.src` resolves to `localhost`, so those asset requests hit your local dev server and may return 404 if the files are not being served there.

**Fix** — copy (or symlink) the SVG assets into your Vite project's `public/` directory so Vite serves them alongside `widget.js`, or add proxy rules in `vite.config.js` pointing to your self-hosted instance:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/widget/widget.js': {
        target: 'https://your-widget-host.com',
        changeOrigin: true,
        secure: true,
      },
      '/Whatsapp.svg': {
        target: 'https://your-widget-host.com',
        changeOrigin: true,
        secure: true,
      },
      '/Telegram.svg': {
        target: 'https://your-widget-host.com',
        changeOrigin: true,
        secure: true,
      },
      '/Signal.svg': {
        target: 'https://your-widget-host.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
```

> Replace `https://your-widget-host.com` with the URL where you are serving your own instance of the widget.

---

## License

See [LICENSE](LICENSE) for details.
