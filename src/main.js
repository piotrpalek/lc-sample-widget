import Livechat from '@livechat/agent-app-widget-sdk';
import App from './App.html';

async function initApp() {
  await Livechat.init();
  await Livechat.watchMessages();

  const app = new App({
    target: document.body
  });

  window.app = app;
}

window.__Livechat = Livechat;
initApp();