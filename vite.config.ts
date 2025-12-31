import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default <UserConfig>{
	resolve: {
		alias: {
			'@': '/src',
			'@views': '/src/views',
			'@store': '/src/store',
		},
	},
	plugins: [vue()],
};
