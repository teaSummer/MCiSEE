import path from 'path';
import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';

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
	plugins: [vue(), Components({
		dts: true,
		dirs: ['src/components'],
		deep: true,
	})],
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
							name: 'ov-icons',
							test: /node_modules\/oh-vue-icons/
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
