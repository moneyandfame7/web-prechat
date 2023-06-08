/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TEST_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_IMAGE: string

  readonly VITE_FIREBASE_KEY: string
  readonly VITE_FIREBASE_DOMAIN: string
  readonly VITE_FIREBASE_URL: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE: string
  readonly VITE_FIREBASE_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
