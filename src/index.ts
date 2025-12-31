import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useI18nStore } from './store/i18n';

import './index.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, fab, far);

const app = createApp(App);
app.component('fa-icon', FontAwesomeIcon);
app.use(router);
app.use(createPinia());
app.mount('#app');

const i18nStore = useI18nStore();
i18nStore.init();

declare module 'vue' {
	export interface GlobalComponents {
		'fa-icon': typeof import('@fortawesome/vue-fontawesome').FontAwesomeIcon;
	}
}
