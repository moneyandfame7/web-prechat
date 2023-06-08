import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAicbQYsgKQO4AhNjxVFmtUYI8evRkpCK4',
  authDomain: 'nestjs-chat-a42f4.firebaseapp.com',
  databaseURL:
    'https://nestjs-chat-a42f4-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'nestjs-chat-a42f4',
  storageBucket: 'nestjs-chat-a42f4.appspot.com',
  messagingSenderId: '1033280273288',
  appId: '1:1033280273288:web:3946408e9eb4124e0bd83d'
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
