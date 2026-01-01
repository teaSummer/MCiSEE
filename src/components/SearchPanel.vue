<script setup lang="ts">
import * as jsonc from 'jsonc-parser';
import { ref, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18nStore } from '@store/i18n';

const { t: $t } = useI18nStore();
const router = useRouter();
const searchExternal = ref([] as Searchable[]);
const showSearchSelectPopup = ref(false);

const searchForm = reactive({
	from: 'local',
	keywords: ''
});

const getSearch = (str: string) => {
	return searchExternal.value.find(s => s.abbr === str || s.title === str);
}

const search = () => {
	if(!searchForm.keywords) return;
	searchForm.from === 'local'?
		router.push({name: 'Search', query: {q: searchForm.keywords}}):
		open(getSearch(searchForm.from)?.search?.replace(
			'<T>', encodeURIComponent(searchForm.keywords)
		), '_blank', 'noopener');
}

defineProps<{
	'is-home'?: boolean
}>();

onBeforeMount(async() => {
	searchExternal.value = await jsonc.parse(
		await (await fetch('https://mcisee.top/data/searchable.jsonc')).text()
	);
});
</script>

<template>
	<span :class="$style['search-panel']">
		<div v-if="!$props['is-home']" :class="{
				[$style['search-select']]: true,
				[$style.active]: showSearchSelectPopup
			}"
			:title="searchForm.from === 'local' && $t('siteSearch') || searchForm.from"
			@click="showSearchSelectPopup = !showSearchSelectPopup">
			<span :class="$style['current-engine']">
				<img :class="$style['icon']" :src="searchForm.from === 'local'?
					'https://mcisee.top/assets/icon/favicon.ico':
					`https://www.faviconextractor.com/favicon/${getSearch(searchForm.from)!.url.split('/')[2]}?larger=true`"
					draggable="false" />
				<fa-icon :class="$style['angle']" icon="angle-right" />
			</span>
		</div>
		<input :class="$style['search-input']" type="text"
			   :style="$props['is-home']? { 'border-radius': '8px 0 0 8px' }: null"
			   :placeholder="searchForm.from === 'local' ?
			   $t('siteSearch') : $t('searchFrom', {
				   linkSearchFrom: getSearch(searchForm.from)?.abbr! ||
					   getSearch(searchForm.from)?.title!
			   })" v-model="searchForm.keywords" @keyup.enter="search" />
		<button :class="$style['search-button']" type="submit" :aria-label="$t('search')"
				:title="$t('search')" @click="search">
			<fa-icon icon="search" />
		</button>
		<div :class="$style['search-select-popup']" v-if="showSearchSelectPopup">
			<dl :class="$style['search-select-list']">
				<dt :class="$style['search-select-item']" role="button">
					<button type="button" @click="searchForm.from = 'local'; showSearchSelectPopup = false;">
						<img :class="$style['icon']" src="https://mcisee.top/assets/icon/favicon.ico" draggable="false" />
						{{ $t('siteSearch') }}
					</button>
				</dt>
				<template v-for="s in searchExternal">
					<dt v-if="s.search" :class="$style['search-select-item']" role="button" :title="s.title">
						<button type="button"
							@click="searchForm.from = s.abbr || s.title; showSearchSelectPopup = false;">
							<img :class="$style['icon']"
								:src="`https://www.faviconextractor.com/favicon/${s.url.split('/')[2]}?larger=true`"
								draggable="false" />
							{{ s.abbr || s.title }}
						</button>
					</dt>
				</template>
			</dl>
		</div>
	</span>
</template>

<style module lang="scss">
@keyframes popup {
	0% {top: calc(100% + 0.4rem);}
	50% {top: calc(100% + 1.2rem);}
	100% {top: calc(100% + 0.4rem);}
}
.search-panel {
	display: flex;
	align-items: center;
	position: relative;
	.search-select-popup {
		animation: popup 0.2s ease-in-out;
		position: absolute;
		top: calc(100% + 0.4rem);
		left: 0;
		width: 100%;
		max-height: 120px;
		overflow: hidden;
		background-color: var(--primary-color);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		z-index: 100;
		.search-select-list {
			margin: 0;
			padding: 0.4rem;
			overflow-x: scroll;
			display: flex;
			align-items: center;
			flex-direction: row;
			gap: 0.8rem;
			.search-select-item {
				display: flex;
				align-items: center;
				flex-direction: column;
				gap: 0.25rem;
				border-radius: 8px;
				user-select: none;
				transition: outline 0.2s, transform 0.2s;
				.icon {
					width: 45px;
					height: 45px;
					filter: drop-shadow(2px 2px 2px var(--border-color));
				}
				&:hover {
					transform: scale(1.1);
				}
				button {
					background-color: transparent;
					border: none;
					cursor: pointer;
					font-size: 0.75rem;
					word-break: keep-all;
				}
			}
		}
	}
	.search-select {
		padding: 0.4rem 1rem;
		background-color: var(--primary-color);
		border: 1px solid var(--border-color);
		border-right: none;
		border-radius: 8px 0 0 8px;
		text-align: center;
		user-select: none;
		transition: background-color 0.2s;
		&:hover {
			background-color: var(--primary-hover-color);
		}
		&.active {
			background-color: var(--primary-active-color);
			.current-engine>.angle {
				transform: rotate(90deg);
			}
		}
		.current-engine {
			display: inline-flex;
			align-items: baseline;
			gap: 0.6rem;
			width: 32px;
			height: 18px;
			>.angle {
				transition: transform 0.2s;
			}
			>.icon {
				width: auto;
				height: 100%;
				filter: drop-shadow(2px 2px 2px var(--border-color));
			}
		}
		// &::before {
		// 	content: '';
		// 	position: absolute;
		// 	top: 50%;
		// 	left: 10px;
		// 	transform: translateY(-50%);
		// 	width: 20px;
		// 	height: 20px;
		// 	background-size: cover;
		// 	background-image: url(attr(data-icon));
		// }
	}
	.search-input {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid var(--border-color);
	}
	.search-button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid var(--border-color);
		border-left: none;
		border-radius: 0 8px 8px 0;
		background-color: var(--primary-color);
		cursor: pointer;
		transition: background-color 0.2s;
		&:hover {
			background-color: var(--primary-hover-color);
		}
		&:active {
			background-color: var(--primary-active-color);
		}
	}
}
</style>
