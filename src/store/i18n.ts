import { defineStore } from 'pinia';

export const useI18nStore = defineStore('i18n', {
	state: () => ({
		language: navigator.language || 'en-US',
		translations: {} as Record<string, string>
	}),
	getters: {
		getCurrentLanguage: (state) => state.language,
		getTranslation: (state) => (key: string) => {
			return state.translations?.[key] || key;
		}
	},
	actions: {
		setLanguage(language: string) {
			this.language = language;
		},
		async getTranslations() {
			const response = await fetch(`https://mcisee.top/locales/${this.language}.json`);
			if(response.status === 404) return 404;
			if(response.ok) this.translations = (await response.json())?.data;
		},
		async init() {
			try {await this.getTranslations();} catch {}
			document.documentElement.lang = this.language;
		},
		t(key: string, values?: Record<string, string>) {
			let translation = this.getTranslation(key);
			if(values)
				Object.keys(values).forEach((k) => {
					translation = translation.replace(`\${${k}}`, values[k]);
				});
			return translation;
		}
	}
});
