<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const browseSites = () => router.push({ name: 'sites' });
const handleWheel = (e: WheelEvent) => e.deltaY > 0 && browseSites();

let touchStartY = 0;
const handleTouchStart = (e: TouchEvent) => touchStartY = e.touches[0].clientY;
const handleTouchEnd = (e: TouchEvent) => {
	const touchEndY = e.changedTouches[0].clientY;
	touchEndY < touchStartY - 50 && browseSites();
};
</script>

<template>
	<main @wheel="handleWheel" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
		<span class="title-panel">
			<img class="logo" src="/images/mcisee-uwu.png" :alt="$t('meta.alt')"
				:title="$t('meta.title')" />
		</span>
		<search-panel :isHome="true" />
		<div class="explore-hint" @click="browseSites">
			<v-icon name="pr-angle-up" />
			<span>Explore More...</span>
		</div>
	</main>
</template>

<style scoped lang="scss">
@keyframes float {
	0%, 100% {
		transform: translateY(0);
		opacity: 0.7;
	}
	50% {
		transform: translateY(-10px);
		opacity: 1;
	}
}
main {
	width: 50%;
	height: 80vh;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	@media screen and (max-width: 768px) {
		width: 80%;
	}
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
.explore-hint {
	position: absolute;
	bottom: 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	color: var(--text-color);
	font-size: 0.9rem;
	animation: float 2s ease-in-out infinite;
	cursor: pointer;
	transition: opacity 0.3s;
	&:hover {
		cursor: pointer;
		opacity: 1 !important;
	}
}
</style>
