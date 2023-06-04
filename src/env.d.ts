/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TEST_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_IMAGE: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
