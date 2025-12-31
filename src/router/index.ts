import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: () => import('@views/Home.vue')
	},
];

export default createRouter({
	history: createWebHistory(),
	routes
});
