<script setup lang="ts">
import { computed } from 'vue';
import { useCoreStore } from './store/core';
import { useI18nStore } from './store/i18n';
const i18nStore = useI18nStore();
const { t: $t } = i18nStore;
const coreStore = useCoreStore();
const theme = computed(() => coreStore.getTheme);

const getThemeIcon = (theme: string) => {
	switch(theme) {
		case 'light':
			return 'fa-sun';
		case 'dark':
			return 'fa-moon';
		case 'classic':
			return 'fa-history';
		case 'auto':
		default:
			return '';
	}
}

const getThemeLocal = (theme: string) => {
	switch(theme) {
		case 'auto':
			return $t('systemTheme');
		case 'dark':
			return $t('darkTheme');
		case 'light':
			return $t('lightTheme');
		case 'classic':
			return $t('earlyTheme');
		default:
			return '';
	}
}

const switchTheme = () => {
	const availableThemes = coreStore.getAvailableThemes;
	const currentThemeIndex = availableThemes.indexOf(theme.value);
	const nextThemeIndex = (currentThemeIndex + 1) % availableThemes.length;
	const nextTheme = availableThemes[nextThemeIndex] as 'auto' | 'light' | 'dark' | 'classic';
	coreStore.setTheme(nextTheme);
}
</script>

<template>
	<nav>
		<div class="title-panel">
			<router-link to="/">
				<span class="title" v-html="$t('introduction.title')"></span>
			</router-link>
			<search-panel v-if="$route.name !== 'home'" />
		</div>
		<div class="action-panel">
			<button class="icon-button dropdown">
				<v-icon name="io-language" />
				<v-icon class="angle" name="fa-angle-right" />
				<div class="dropdown-content">
					<ul>
						<template v-for="(show, language) in coreStore.getAvailableLanguages" :key="language">
							<li v-if="show || i18nStore.getCurrentLanguage === language"
								:class="{ active: i18nStore.getCurrentLanguage === language }">
								<a :href="language" role="button"
									@click.prevent="i18nStore.setLanguage(language)">
									{{ $t(`language.${language}`) }}
								</a>
							</li>
						</template>
					</ul>
				</div>
			</button>
			<button class="theme-button icon-button" @click="switchTheme" :title="getThemeLocal(theme)" :aria-label="getThemeLocal(theme)">
				<v-icon v-if="theme !== 'auto'" :name="getThemeIcon(theme)" />
				<svg v-else xmlns="http://www.w3.org/2000/svg" class="ov-icon" width="19.2" height="19.2" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z" /></svg>
			</button>
		</div>
	</nav>
	<router-view />
	<footer>
		<p v-html="$t('ICP')"></p>
		<p>{{ $t('credit') }}</p>
	</footer>
</template>
