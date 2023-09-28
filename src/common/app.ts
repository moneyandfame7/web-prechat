// export const API_URL =
//   import.meta.env.NODE_ENV === 'development'
//     ? 'http://localhost:8001/graphql'
//     : import.meta.env.NODE_ENV === 'production'
//     ? import.meta.env.VITE_API_URL
//     : ''
import {signal} from '@preact/signals'

export const MOCK_TWO_FA = signal(true)

export const MOCK_CHAT_FETCH = signal(false)
export const FOLDER_ID_ALL = 0
