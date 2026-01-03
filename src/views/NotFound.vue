<template>
	<main class="not-found">
		<h2 class="category-name">404 Not Found</h2>
		<img title="404 Not Found" alt="404 Not Found" src="/images/NotFound.png" />
		<div class="action-panel">
			<router-link role="button" to="/">Back to Home</router-link>
			<button @click="$router.back()">Back to Previous Page</button>
		</div>
	</main>
</template>

<style lang="scss" scoped>
.not-found {
	text-align: center;
	img {
		display: block;
		width: 40%;
		margin: auto;
	}
	.action-panel {
		margin-top: 2rem;
		height: 4rem;
	}
	a[role="button"], button {
		display: inline-block;
		font-size: 1rem;
		font-family: inherit;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		background-color: var(--primary-color);
		color: var(--text-color);
		text-decoration: none;
		box-shadow: 2px 2px 4px #fff8;
		transition: background-color 0.2s;
		&:hover {
			background-color: var(--primary-hover-color);
		}
		&:active {
			background-color: var(--primary-active-color);
		}
		&:not(:last-child) {
			margin-right: 1rem;
		}
	}
}
</style>
