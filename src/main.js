import Livechat from '@livechat/agent-app-widget-sdk';
import App from './App.html';
import sectionJson from './widgetConfigSample';

async function initApp() {
	await Livechat.init();
	await Livechat.modifyCustomerDetailsSection(JSON.parse(sectionJson));

	const app = new App({
		target: document.body
	});

	window.app = app;
}

initApp();