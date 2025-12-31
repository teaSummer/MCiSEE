<script setup lang="ts">
import { useI18nStore } from './store/i18n';
const i18nStore = useI18nStore();
const $t = i18nStore.t;
</script>

<template>
	<router-view></router-view>
	<footer>
		<p v-html="$t('ICP')"></p>
		<p>{{ $t('credit') }}</p>
	</footer>
</template>
