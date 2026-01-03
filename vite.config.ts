import path from 'path';
import fs from 'fs';
import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';

const getHashFromGit = () => {
	let h = 'unknown';
	try {
		h = fs.readFileSync('./.git/refs/heads/next', 'utf-8').trim().slice(0, 7);
	} catch (e) { console.warn('Failed to get git hash:', e); }
	return h;
}

export default<UserConfig> {
	define: {
		deployed_hash: JSON.stringify(getHashFromGit())
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@comps': path.resolve(__dirname, 'src/components'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@plugins': path.resolve(__dirname, 'src/plugins'),
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
					maxSize: 512 * 1024,
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
						},
						{
							name: 'vue-mcisee-plugin',
							test: /src\/plugins\/core/
						}
					]
				}
			}
		}
	}
};
