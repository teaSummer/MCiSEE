import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useI18nStore } from './store/i18n';
import { useCoreStore } from './store/core';

import './index.scss';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import * as FaIcon from 'oh-vue-icons/icons/fa';
import * as PrIcon from 'oh-vue-icons/icons/pr';
import { IoLanguage } from 'oh-vue-icons/icons';

addIcons(...Object.values(FaIcon), ...Object.values(PrIcon), IoLanguage);

const SearchPanel = defineAsyncComponent(() => import('@comps/SearchPanel.vue'));

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.component('search-panel', SearchPanel);
app.use(router);
app.use(createPinia());
app.mount('#app');

const i18nStore = useI18nStore();
i18nStore.init();

const coreStore = useCoreStore();
coreStore.init();

declare module 'vue' {
	export interface GlobalComponents {
		'v-icon': typeof import('oh-vue-icons').OhVueIcon;
		'search-panel': typeof SearchPanel;
	}
}
