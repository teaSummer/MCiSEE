import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: () => import('@views/Home.vue')
	},
	{
		path: '/sites',
		name: 'sites',
		component: () => import('@views/Sites.vue')
	},
];

export default createRouter({
	history: createWebHistory(),
	routes
});
