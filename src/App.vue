<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18nStore } from './store/i18n';
const { t: $t } = useI18nStore();
const router = useRouter();

const isHome = computed(() => router.currentRoute.value.path === '/');
</script>

<template>
	<nav>
		<div class="logo-panel">
			<router-link to="/">
				<span class="title" v-html="$t('introduction.title')"></span>
			</router-link>
		</div>
		<search-panel v-if="!isHome" />
	</nav>
	<router-view />
	<footer>
		<p v-html="$t('ICP')"></p>
		<p>{{ $t('credit') }}</p>
	</footer>
</template>
