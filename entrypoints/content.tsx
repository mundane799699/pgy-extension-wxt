import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
export default defineContentScript({
  // matches: ["*://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/*"],
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  runAt: "document_start",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-ui",
      position: "inline",
      append: "first",
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement("div");
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(<App />);
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
