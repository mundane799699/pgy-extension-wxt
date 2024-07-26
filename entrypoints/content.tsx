import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
export default defineContentScript({
  matches: ["*://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/*"],
  // matches: ["*://*/*"],
  cssInjectionMode: "ui",
  runAt: "document_end",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-ui",
      position: "inline",
      append: "first",
      onMount: (container) => {
        const shadowContainer = container.attachShadow({ mode: "open" });
        const shadowRootElement = document.createElement("div");
        shadowContainer.appendChild(shadowRootElement);

        const cache = createCache({
          key: "css",
          prepend: true,
          container: shadowContainer,
        });

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(shadowRootElement);
        root.render(
          <CacheProvider value={cache}>
            <App />
          </CacheProvider>
        );
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();

    injectJs();
  },
});

function injectJs() {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", browser.runtime.getURL("/injected.js"));
  script.addEventListener("load", function () {
    console.log("Injected script loaded successfully");
  });
  script.onerror = function () {
    console.error("Failed to load the injected script");
  };
  (document.head || document.documentElement).appendChild(script);
}
