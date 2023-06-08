import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export const authentication = getAuth(firebaseApp)

// export const generateRecaptcha = () => {
//   console.log('INITIALIZATE')
//   window.recaptchaVerifier = new RecaptchaVerifier(
//     AUTH_CAPTCHA_EL,
//     {
//       size: 'invisible',
//       callback: (/* res */) => {
//         // do nthg
//       }
//     },
//     authentication
//   )
//   window.recaptchaVerifier.render().then((id) => {
//     window.recaptchaVerifierId = id
//   })
// }

export const resetCaptcha = () => {
  // window.recaptchaVerifier.clear()
  // ;(window.recaptchaVerifier as any).recaptcha.reset(window.recaptchaVerifierId)
  // const container = document.getElementById(AUTH_CAPTCHA_CONTAINER)
  // if (container?.innerHTML) {
  //   container.innerHTML = `<div id=${AUTH_CAPTCHA_EL}></div>`
  // }
  // generateRecaptcha()
}
