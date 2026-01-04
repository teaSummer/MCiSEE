import { createApp } from 'vue';
import router from './router';
import McISeePlugin from './plugins/core';
import App from './App.vue';

import './index.scss';

const app = createApp(App);

app.use(router).use(McISeePlugin).mount('#app');
