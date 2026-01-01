<script setup lang="ts">
import { useI18nStore } from '@store/i18n';

const { t: $t } = useI18nStore();
</script>

<template>
	<main>
		<span class="title-panel">
			<img class="logo" src="/images/mcisee-uwu.png" :alt="$t('meta.alt')"
				:title="$t('meta.title')" />
		</span>
		<search-panel :isHome="true" />
	</main>
</template>

<style scoped lang="scss">
main {
	width: 50%;
	height: 80vh;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.container {
	width: 100%;
	height: 100%;
}
.title-panel {
	display: block;
	width: 30%;
	height: auto;
	.logo {
		width: 100%;
		height: 100%;
	}
}
</style>
