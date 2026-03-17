# ShortMesh Widget

A lightweight, embeddable widget that lets users pick their preferred messaging platform (WhatsApp, Telegram, Signal). Drop it into any HTML page or React app — the widget handles the UI, you handle the rest.

---

![ShortMesh widget image] (/1.svg)

---

## How it works

1. The widget fetches your available platforms from your API.
2. The user picks one.
3. The widget calls your `onSelect` callback with the chosen platform key and closes itself.
4. You take it from there — send an OTP, open a chat link, whatever fits your flow.

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
[{ "platform": "wa" }, { "platform": "telegram" }, { "platform": "signal" }]
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
| `telegram` | Telegram |
| `signal`   | Signal   |

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

## License

See [LICENSE](LICENSE) for details.
