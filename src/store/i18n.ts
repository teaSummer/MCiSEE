import { defineStore } from 'pinia';

export const useI18nStore = defineStore('i18n', {
	state: () => ({
		language: navigator.language || 'en-US',
		translations: {} as Record<string, string>
	}),
	getters: {
		getCurrentLanguage: (state) => state.language,
		getTranslation: (state) => (key: string) => {
			return state.translations?.[key] || '';
		}
	},
	actions: {
		setLanguage(language: string) {
			this.language = language;
			this.init();
		},
		async getTranslations() {
			const response = await fetch(`https://mcisee.top/locales/${this.language}.json`);
			if(response.status === 404) return 404;
			if(response.ok) this.translations = {
				'language.lzh': '文言 (華夏)',
				'language.zh-CN': '简体中文 (中国大陆)',
				'language.zh-HK': '繁體中文 (中国香港)',
				'language.zh-TW': '繁體中文 (中国台灣)',
				'language.en-UD': 'ɥsᴉꞁᵷuƎ',
				'language.en-US': 'English',
				'language.it-IT': 'Italiano',
				'language.pt-BR': 'Português (Brasil)',
				...(await response.json())?.data
			};
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
