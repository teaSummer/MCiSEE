import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default<UserConfig> {
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@comps': path.resolve(__dirname, 'src/components'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		},
	},
	plugins: [vue()],
	build: {
		modulePreload: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vue: ['vue'],
					'vue-router': ['vue-router'],
					jsonc: ['jsonc-parser'],
				}
			}
		}
	}
};
