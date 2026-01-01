<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import * as jsonc from 'jsonc-parser';
import SiteItem from '@comps/SiteItem.vue';

const sites = ref<SitesDataV2[]>([]);

const getFavicon = (url: string) => {
	if(url === '#') return 'https://zh.minecraft.wiki/images/Barrier_JE2_BE2.png?81f6a&format=original';
	else if(url.startsWith('#')) return 'https://mcisee.top/assets/icon/favicon.ico';
	return `https://www.faviconextractor.com/favicon/${url.split('/')[2]}?larger=true`;
}

onBeforeMount(async() => {
	const formatHelper = await import('@utils/format-helper');
	const raw_data = await (await fetch('https://mcisee.top/data/utilityWebsite.jsonc')).text();
	sites.value = formatHelper.convertToV2(jsonc.parse(raw_data));
});
</script>

<template>
	<main class="sites">
		<div class="site-category" v-for="(category, i) in sites" :key="category.category">
			<h2 :id="category.category" class="category-name">{{ category.category }}</h2>
			<div class="site-list">
				<SiteItem v-for="site in category.sites" :key="site.name" :site="{
					...site,
					icon: getFavicon(site.url)
				}" />
			</div>
		</div>
	</main>
</template>

<style lang="scss" scoped>
.sites {
	width: 80%;
	height: 100%;
	margin: auto;
	.site-category {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.8rem;
		.category-name {
			font-size: 20px;
			font-weight: bold;
		}
		.site-list {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1.2rem;
		}
	}
}
</style>
