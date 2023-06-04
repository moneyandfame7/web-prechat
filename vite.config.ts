import preact from '@preact/preset-vite'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import { APP_NAME, BASE_URL } from './src/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    createHtmlPlugin({
      inject: {
        data: {
          appName: APP_NAME,
          baseUrl: BASE_URL
        }
      }
    })
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
      '@types': '/src/types'
    }
  },
  server: {
    port: 8000,
    open: true
  }
})
