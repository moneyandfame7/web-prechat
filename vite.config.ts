import preact from '@preact/preset-vite'

import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import { PluginOption, defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-anonymous-default-export
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const { VITE_APP_NAME, VITE_APP_URL, VITE_APP_IMAGE } = process.env as Record<
    string,
    string
  >
  return defineConfig({
    plugins: [
      preact(),
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
      }) as PluginOption
    ],
    css: {
      postcss: {
        plugins: [autoprefixer]
      }
    },
    resolve: {
      alias: {
        /* For avoid conflicts with react-libraries */
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        /* common folders */
        '@components': '/src/components',
        '@hooks': '/src/hooks',
        '@containers': '/src/containers',
        '@modules': '/src/modules',
        '@types': '/src/types',
        '@lib': '/src/lib'
      }
    },
    server: {
      port: 8000,
      open: true
    }
  })
}
