<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import SiteItem from '@comps/SiteItem.vue';

const sites = ref<SitesDataV2[]>([]);

const getFavicon = (url: string) => {
	if(url === '#') return 'https://zh.minecraft.wiki/images/Barrier_JE2_BE2.png?81f6a&format=original';
	else if(url.startsWith('#')) return 'https://mcisee.top/assets/icon/favicon.ico';
	return `https://www.faviconextractor.com/favicon/${url.split('/')[2]}?larger=true`;
}

const route = useRoute();
const searchKeywords = computed(() => route.query.s?.toString() || '');

const filterSites = (keyword: string, category: string, type?: 'category' | 'site'): any => {
	if(type === 'category')
		return sites.value.find(c => c.category === category)?.sites.filter(
			site => site.name.toLowerCase().includes(keyword.trim().toLowerCase())
		) || [];
	else if(type === 'site') return sites.value.find(c => c.category === category)?.sites.filter(
			site => site.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
					site.desc?.toLowerCase().includes(keyword.trim().toLowerCase())
		) || [];
	else return sites.value;
}

onBeforeMount(async() => {
	const raw_data = await (await fetch('https://mcisee.top/data/utilityWebsite.json')).text();
	sites.value = JSON.parse(raw_data);
});
</script>

<template>
	<main class="sites">
		<template v-for="(category, i) in sites" :key="category.category">
			<div v-if="filterSites(searchKeywords, category.category, 'category').length" class="site-category">
				<h2 :id="category.category" class="category-name">{{ category.category }}</h2>
				<div class="site-list">
					<template v-for="site in category.sites" :key="site.name">
						<SiteItem v-if="filterSites(searchKeywords, category.category, 'site').includes(site)" :site="{
							...site,
							icon: getFavicon(site.url)
						}" />
					</template>
				</div>
			</div>
		</template>
	</main>
</template>

<style lang="scss" scoped>
.sites {
	width: 100%;
	height: 90%;
	.site-category {
		width: 80%;
		margin: auto;
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
