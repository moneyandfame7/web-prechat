import { type FirebaseOptions, initializeApp } from 'firebase/app'
import { inMemoryPersistence, initializeAuth } from 'firebase/auth'

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CREDENTIALS) as FirebaseOptions

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export const authentication = initializeAuth(firebaseApp, {
  persistence: inMemoryPersistence
})
