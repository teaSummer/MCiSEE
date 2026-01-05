<script setup lang="ts">
import { ref, computed, inject, h } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
const stores = inject<McISee.Stores>('stores')!;
const theme = computed(() => stores.coreStore.getTheme);

const getThemeIcon = (theme: string) => {
	const rendererIcon =
		(name: string, style?: Record<string, string>, attrs?: Record<string, string>) => 
			h(OhVueIcon, { name, style, ...attrs });
	switch(theme) {
		case 'light':
			return rendererIcon('fa-sun');
		case 'dark':
			return rendererIcon('fa-moon');
		case 'classic':
			return rendererIcon('fa-history');
		case 'auto':
		default:
			return h(OhVueIcon, { label: 'auto' }, [
				rendererIcon('fa-sun', { clipPath: 'polygon(0 0, 100% 0, 0 100%)' }),
				rendererIcon('fa-moon', { clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }),
				rendererIcon('la-slash-solid')
			]);
	}
}

const getThemeLocal = (theme: string) => {
	switch(theme) {
		case 'auto':
			return stores.i18nStore.t('systemTheme');
		case 'dark':
			return stores.i18nStore.t('darkTheme');
		case 'light':
			return stores.i18nStore.t('lightTheme');
		case 'classic':
			return stores.i18nStore.t('earlyTheme');
		default:
			return '';
	}
}

const switchTheme = () => {
	const availableThemes = stores.coreStore.getAvailableThemes;
	const currentThemeIndex = availableThemes.indexOf(theme.value);
	const nextThemeIndex = (currentThemeIndex + 1) % availableThemes.length;
	const nextTheme = availableThemes[nextThemeIndex] as 'auto' | 'light' | 'dark' | 'classic';
	stores.coreStore.setTheme(nextTheme);
}
const switchMobileMenu = () => {
	isShowMobileMenu.value = !isShowMobileMenu.value;
}

const isMobile = computed(() => window.innerWidth <= 768);
const isShowMobileMenu = ref(false);
const isPreview = JSON.parse(import.meta.env.VITE_IS_PREVIEW) as boolean;
const buildInfoStr = computed(() => {
	const deployedSHA = import.meta.env.VERCEL_GIT_COMMIT_SHA?.trim()?.slice(0, 7);
	const isVercel = import.meta.env.VERCEL === '1';
	let str = `Build at ${new Date(import.meta.env.VITE_BUILD_TIMESTAMP).toISOString()} `;
	deployedSHA && (str += `with commit <a href="https://github.com/LateDreamXD/mcisee-next/commit/${deployedSHA}" target="_blank" rel="noopener"><code>${deployedSHA}</code></a>`);
	isVercel && (str += ` on Vercel`);
	return str;
});
</script>

<template>
	<nav class="header-panel">
		<div class="title-panel">
			<router-link to="/">
				<span class="title" v-html="$t('introduction.title')"></span>
			</router-link>
			<search-panel v-if="$route.name !== 'home' && !isMobile" />
		</div>
		<div class="action-panel">
			<button class="icon-button dropdown">
				<v-icon name="io-language" />
				<v-icon class="angle" name="fa-angle-right" />
				<div class="dropdown-content">
					<ul>
						<template v-for="(show, language) in $core.getAvailableLanguages" :key="language">
							<li v-if="show || $i18n.getCurrentLanguage === language"
								:class="{ active: $i18n.getCurrentLanguage === language }">
								<a :href="language" role="button"
									@click.prevent="$i18n.setLanguage(language)">
									{{ $t(`language.${language}`) }}
								</a>
							</li>
						</template>
					</ul>
				</div>
			</button>
			<button class="theme-button icon-button" @click="switchTheme" :title="getThemeLocal(theme)" :aria-label="getThemeLocal(theme)">
				<component :is="getThemeIcon(theme)" />
			</button>
			<button v-if="isMobile" class="theme-button icon-button" @click="switchMobileMenu" :title="$t('menu')">
				<v-icon name="fa-bars" />
			</button>
		</div>
	</nav>
	<router-view />
	<footer>
		<span class="footer-left">
			<p v-if="isPreview" v-html="buildInfoStr" />
			<p v-if="isPreview">This is a preview version, doesn't means final quality.</p>
		</span>
		<span class="footer-right">
			<p v-html="$t('ICP')" />
			<p v-text="$t('credit')" />
		</span>
	</footer>
	<nav v-if="isMobile && isShowMobileMenu" class="mobile-menu" @click.self="switchMobileMenu">
		<ul>
			<li>
				<search-panel />
			</li>
		</ul>
	</nav>
</template>
