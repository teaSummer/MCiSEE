// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mcisee.top',
  integrations: [react()],

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'zh-TW', 'zh-HK', 'en-US', 'en-UD', 'it-IT', 'pt-BR', 'lzh'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    }
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
});