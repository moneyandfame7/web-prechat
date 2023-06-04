/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
