import { defineStore } from 'pinia';

export const useCoreStore = defineStore('core', {
	state: () => ({
		/** if `true`, will show in nav */
		availableLanguages: {
			lzh: true, // for zh Apr.1
			'zh-CN': true,
			'zh-HK': true,
			'zh-TW': true,
			'en-UD': false, // for en Apr.1
			'en-US': true,
			'it-IT': true,
			'pt-BR': true,
		},
		availableThemes: ['auto', 'light', 'dark', 'classic'],
		settings: {
			theme: 'auto',
		}
	}),
	actions: {
		init() {
			const settings = localStorage.getItem('settings');
			if(settings) this.settings = JSON.parse(settings);

			document.documentElement.setAttribute('data-theme', this.settings.theme);
		},
		save() {
			localStorage.setItem('settings', JSON.stringify(this.settings));
		},
		setTheme(theme: 'auto' | 'light' | 'dark' | 'classic') {
			document.documentElement.setAttribute('data-theme', theme);
			this.settings.theme = theme;
			this.save();
		},
	},
	getters: {
		getTheme: (state) => state.settings.theme,
		getAvailableLanguages: (state) => state.availableLanguages,
		getAvailableThemes: (state) => state.availableThemes,
	}
});
