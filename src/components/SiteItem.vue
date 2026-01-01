<script setup lang="ts">
defineProps<{
	site: {
		name: string;
		icon?: string | null;
		desc?: string;
		url: string;
	}
}>();
const open = (url: string) => {
	if(url === '#') return;
	return window.open(url, '_blank', 'noopener');
}
</script>

<template>
	<a :href="site.url" :target="site.url.startsWith('http')? '_blank': void 0"
	   :title="site.desc || site.name"
	   :class="{ [$style['site-item']]: true, [$style.disabled]: site.url === '#' }"
	   @click.prevent="open(site.url)">
		<img :class="$style['site-icon']" :alt="site.name"
			 :src="site.icon || 'https://zh.minecraft.wiki/images/Barrier_JE2_BE2.png?81f6a&format=original'" />
		<div :class="$style['site-item-info']">
			<span :class="$style['site-item-name']">{{ site.name }}</span>
			<span v-if="site.desc" :class="$style['site-item-desc']">{{ site.desc }}</span>
		</div>
	</a>
</template>

<style lang="scss" module>
@keyframes shake {
	0% { transform: translateX(0); }
	10% { transform: translateX(-5px); }
	25% { transform: translateX(5px); }
	45% { transform: translateX(-5px); }
	50%, 100% { transform: translateX(0); }
}
.site-item {
	padding: 0.4rem;
	color: var(--text-color);
	background-color: var(--primary-color);
	border-radius: 4px;
	display: flex;
	gap: 0.4rem;
	align-items: center;
	text-decoration: none !important;
	transition: background-color 0.2s, transform 0.2s;
	width: 100%;
	&.disabled {
		color: var(--muted-color);
		cursor: not-allowed;
		opacity: 0.5;
		&:hover {
			animation: shake 0.4s infinite;
		}
	}
	&:hover {
		transform: scale(1.2);
		backdrop-filter: blur(8px);
		background-color: var(--primary-hover-color);
		outline: 2px solid var(--border-color);
	}
	.site-icon {
		width: 40px;
		height: 40px;
	}
	.site-item-info {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 80%;
		>* {
			display: block;
		}
	}
	.site-item-name {
		font-size: 16px;
		font-weight: bold;
	}
	.site-item-desc {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
