import electronApp from "../electron/preload.cjs";
declare global {
  interface Window {
    electronApp: typeof electronApp;
  }
}
