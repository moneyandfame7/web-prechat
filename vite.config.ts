import preact from '@preact/preset-vite'

import basicSsl from '@vitejs/plugin-basic-ssl'
import autoprefixer from 'autoprefixer'
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig, loadEnv} from 'vite'
import checker from 'vite-plugin-checker'
import handlebars from 'vite-plugin-handlebars'
import {VitePWA} from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

import manifest from './manifest.json'

const handlebarsPlugin = handlebars({
  context: {
    title: 'Prechat',
    description:
      'Prechat - a web messaging app built with Preact and TypeScript, similar to Telegram. ( Fast 3kB alternative to React with the same modern API )',
    url: 'https://web-prechat.vercel.app',
  },
})

const USE_HTTPS = false
const NO_MINIFY = false
const CHECK_CODE = true

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-anonymous-default-export
export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}
  const {VITE_APP_NAME, VITE_APP_URL, VITE_APP_IMAGE, DEV} = process.env as Record<
    string,
    string
  >
  return defineConfig({
    plugins: [
      svgr(),
      preact(),
      visualizer({
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        filename: 'analyse.html',
      }) as any, // eslint-disable-line
      CHECK_CODE
        ? checker({
            eslint: {
              lintCommand: 'eslint --ext .tsx,.ts src',
            },
          })
        : undefined,
      handlebarsPlugin,
      USE_HTTPS ? basicSsl() : undefined,

      VitePWA({
        manifest,
        devOptions: {
          enabled: true,
        },
        workbox: {
          globPatterns: ['**/*.{js,ts,css,html}', '**/*.{svg,png,jpg,gif,woff2,json}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        },
      }),
      // chunkSplitPlugin({
      //   // customSplitting: {
      //   //   'ui-components': [/[\\/]src[\\/]components[\\/]ui[\\/]/]
      //   // }
      // }),
    ].filter(Boolean),
    build: {
      target: 'es2020',
      sourcemap: false,
      minify: NO_MINIFY ? false : undefined,
    },
    css: {
      postcss: {
        plugins: [autoprefixer({add: true})],
      },
      modules: {
        localsConvention: 'camelCase',
        // generateScopedName: /* DEV ? */ '[name]__[local]___[hash:base64:5]',
        // generateScopedName: '[local]__[hash:base64:10]',
        generateScopedName: '[name]__[local]___[hash:base64:5]',

        // hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/css/mixins.scss";',
        },
      },
    },
    resolve: {
      alias: {
        /* For avoid conflicts with react-libraries */
        react: 'preact/compat',
        'react-dom': 'preact/compat',

        /* common folders */
        components: '/src/components',
        hooks: '/src/hooks',
        containers: '/src/containers',
        modules: '/src/modules',
        types: '/src/types',
        lib: '/src/lib',
        api: '/src/api',
        state: '/src/state',
        assets: '/src/assets',
        common: '/src/common',
        utilities: '/src/utilities',
        context: '/src/context',
        managers: '/src/managers',
        storages: '/src/storages',
        store: '/src/store',
      },
    },
    server: {
      port: 8000,
      open: true,
      https: USE_HTTPS,
    },
  })
}
