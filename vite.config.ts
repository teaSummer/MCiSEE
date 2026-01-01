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
		rolldownOptions: {
			output: {
				advancedChunks: {
					groups: [
						{
							name: 'vue-bundled',
							test: /node_modules\/(vue|vue-router|pinia)/
						},
						{
							name: 'font-awesome',
							test: /node_modules\/@fortawesome/
						},
						{
							name: 'jsonc-parser',
							test: /node_modules\/jsonc-parser/
						},
						{
							name: 'utils-bundled',
							test: /src\/utils/
						},
						{
							name: 'stores-bundled',
							test: /src\/store/
						}
					]
				}
			}
		}
	}
};
