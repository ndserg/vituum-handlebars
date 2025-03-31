import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import pages from 'vituum/plugins/pages.js';
import handlebars from '@vituum/vite-plugin-handlebars';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

const getTemplateFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.hbs'))
    .map((file) => path.join(dir, `${file}.html`));
};

export default defineConfig(({ mode }) => {
  return {
    base: '/',
    plugins: [
      pages(),
      handlebars({
        root: './src',
      }),
      mode === 'development' ? {} : ViteMinifyPlugin({}),
    ],
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {
      rollupOptions: {
        input: getTemplateFiles('./src/pages'),
        output: {
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'img/[name]-[hash][extname]';
            }

            if (/\.css$/.test(name ?? '')) {
              const cssFileName = mode === 'development' ? 'css/[name]-[hash][extname]' : 'css/[name]-[hash].min[extname]';
              return cssFileName;
            }

            return 'assets/[name]-[hash][extname]';
          },
          sourcemapFileNames: 'sourcemaps/js/[name].[hash].js.map',
        },
      },
      sourcemap: mode === 'development' ? true : false,
      minify: mode === 'development' ? false : true,
      outDir: 'dist',
    },
    server: {
      open: true,
    },
  };
});
