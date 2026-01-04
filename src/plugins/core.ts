import { defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import { useI18nStore } from '@store/i18n';
import { useCoreStore } from '@store/core';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import * as FaIcon from 'oh-vue-icons/icons/fa';
import * as PrIcon from 'oh-vue-icons/icons/pr';
import { IoLanguage } from 'oh-vue-icons/icons/io';
import { LaSlashSolid } from 'oh-vue-icons/icons/la';

addIcons(...Object.values(FaIcon), ...Object.values(PrIcon), IoLanguage, LaSlashSolid);

const SearchPanel = defineAsyncComponent(() => import('@comps/SearchPanel.vue'));

export default {
	install(app: import('vue').App) {
		const pinia = createPinia();
		app.use(pinia);

		const i18nStore = useI18nStore();
		i18nStore.init();

		const coreStore = useCoreStore();
		coreStore.init();

		app.component('v-icon', OhVueIcon)
			.component('search-panel', SearchPanel)
			.provide('stores', {
				i18nStore,
				coreStore
			});

		app.config.globalProperties.$t = i18nStore.t;
		app.config.globalProperties.$i18n = i18nStore;
		app.config.globalProperties.$core = coreStore;
	}
}

declare global {
	namespace McISee {
		interface Stores {
			/** i18n store */
			i18nStore: ReturnType<typeof useI18nStore>;
			/** core store */
			coreStore: ReturnType<typeof useCoreStore>;
		}
	}
}

declare module 'vue' {
	export interface GlobalComponents {
		'v-icon': typeof import('oh-vue-icons').OhVueIcon;
		'search-panel': typeof SearchPanel;
	}
	export interface ComponentCustomProperties {
		$t: McISee.Stores['i18nStore']['t'];
		$i18n: McISee.Stores['i18nStore'];
		$core: McISee.Stores['coreStore'];
	}
}
