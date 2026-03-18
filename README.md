# ShortMesh Widget

A lightweight, embeddable widget that lets users pick from available platforms to receive an authentication code. Drop it into any HTML page or React app — the widget handles the UI, you handle the rest.

---

![ShortMesh widget image](/1.svg)

---

## How it works

1. The widget fetches your available platforms from your API.
2. The user picks one.
3. The widget calls your `onSelect` callback with the chosen platform key and closes itself.
4. You take it from there — send OTP and verify.

---

## Setup

### HTML

Add one script tag — no build step, no dependencies.

```html
<script src="https://shortmesh.com/widget.js"></script>
```

Then open the widget from any button or event:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <script src="https://shortmesh.com/widget.js"></script>
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
<script src="https://shortmesh.com/widget.js"></script>
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
    script.src = "https://shortmesh.com/widget.js";
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

[Authy](https://github.com/shortmesh/Authy-API) is working to add more platforms.

---

## File structure

```
shortmesh-widget/
├── widget/
│   └── widget.js   # Widget source
├── index.html      # Local demo
├── README.md
└── LICENSE
```

---

## Troubleshooting

### Assets 404 in Vite dev server

The widget loads its platform icons (e.g. `WhatsApp.svg`, `Logo.svg`, `Signal-Logo.svg`) relative to the URL of `widget.js` itself. In production this is `https://shortmesh.com`, so the assets resolve correctly. During local development with Vite, `document.currentScript.src` resolves to `localhost`, so those asset requests hit your local dev server and return 404.

**Fix** — add proxy rules to `vite.config.js` so those paths are forwarded to the CDN:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/widget.js': {
        target: 'https://shortmesh.com',
        changeOrigin: true,
        secure: true,
      },
      '/WhatsApp.svg': {
        target: 'https://shortmesh.com',
        changeOrigin: true,
        secure: true,
      },
      '/Logo.svg': {
        target: 'https://shortmesh.com',
        changeOrigin: true,
        secure: true,
      },
      '/Signal-Logo.svg': {
        target: 'https://shortmesh.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
```

> If you are pointing at a staging environment (e.g. `beta.shortmesh.com`) just replace the `target` values accordingly.

---

## License

See [LICENSE](LICENSE) for details.
