import preact from '@preact/preset-vite'

import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'

import manifest from './public/manifest.json'

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-anonymous-default-export
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const { VITE_APP_NAME, VITE_APP_URL, VITE_APP_IMAGE } = process.env as Record<string, string>
  return defineConfig({
    build: {
      cssCodeSplit: true
    },
    plugins: [
      preact({ include: '**/*.tsx' }),
      createHtmlPlugin({
        inject: {
          data: {
            appName: VITE_APP_NAME,
            appImage: VITE_APP_IMAGE,
            appUrl: VITE_APP_URL
          }
        }
      }),
      visualizer({
        template: 'sunburst', // or sunburst
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'analyse.html' // will be saved in project's root
      }) as any,
      VitePWA({
        manifest,
        // includeAssets: ['/icons/preact.svg', '/icons/vite.svg'],
        devOptions: {
          enabled: true
        },
        workbox: {
          globDirectory: 'dist'
        }
        // workbox: {
        //   globPatterns: ['**/*.{js,ts,css,html}'] /* .{svg,png,jpg,gif} */
        // }
      })
    ],
    css: {
      postcss: {
        plugins: [autoprefixer]
      },
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/css/_mixins.scss";'
        }
      }
    },
    resolve: {
      alias: {
        /* For avoid conflicts with react-libraries */
        'react': 'preact/compat',
        'react-dom': 'preact/compat',

        /* common folders */
        'components': '/src/components',
        'hooks': '/src/hooks',
        'containers': '/src/containers',
        'modules': '/src/modules',
        'types': '/src/types',
        'lib': '/src/lib',
        'api': '/src/api',
        'state': '/src/state',
        'assets': '/src/assets',
        'common': '/src/common'
      }
    },
    server: {
      port: 8000,
      open: true
    }
  })
}
