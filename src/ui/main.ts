import App from './App.svelte';

import '@picocss/pico/css/pico.css';

const app = new App({
	target: document.getElementById('app') as Element,
});

export default app;
