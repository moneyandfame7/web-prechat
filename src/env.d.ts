/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_IMAGE: string

  readonly VITE_API_URL: string

  readonly VITE_FIREBASE_CREDENTIALS: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
