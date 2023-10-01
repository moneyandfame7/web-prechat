/* eslint-disable no-console */
interface Algorithm {
  name: 'AES-GCM'
  iv: ArrayBuffer
}

const salt = crypto.getRandomValues(new Uint8Array(16))

async function sha256(data: string, salt: Uint8Array) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data + salt))
}

export async function saveEncryptSession(dataToEncrypt: object, password: string) {
  console.time('ENCRYPT_SESSION')

  const hash = await sha256(password, salt)

  console.log(`ENCRYPT SESSION, password: ${password}, hash:`, hash)
  localStorage.setItem(
    'CREDENTIALS',
    JSON.stringify({
      hash: Array.from(new Uint8Array(hash)),
      salt: Array.from(new Uint8Array(salt)),
    })
  )
  /* without array.from, just idb.set('passcode', ...) */

  const encrypted = await encrypt(dataToEncrypt, hash)
  console.log('ENCRYPT SESSION, data:', dataToEncrypt, 'encrypted:', encrypted)
  localStorage.setItem('ENCRYPTED', JSON.stringify(Array.from(new Uint8Array(encrypted))))

  const encryptedPasscodeData = {
    password: {
      hash: Array.from(new Uint8Array(hash)),
      salt: Array.from(new Uint8Array(salt)),
    },
    data: Array.from(new Uint8Array(encrypted)),
  }

  localStorage.setItem('PASSCODE-ENCRYPTED', JSON.stringify(encryptedPasscodeData))
  console.timeEnd('ENCRYPT_SESSION')
}

export async function decryptSession(inputPassword: string) {
  console.time('DECRYPT_SESSION')
  const stored = JSON.parse(localStorage.getItem('CREDENTIALS') || '{}')
  const stored2 = localStorage.getItem('PASSCODE-ENCRYPTED')
  console.log({stored2})
  if (!stored) {
    return false
  }

  console.log({stored})
  const inputPasswordHash = await sha256(inputPassword, new Uint8Array(stored.salt))

  // if (areArraysEqual(stored.hash, Array.from(new Uint8Array(inputPasswordHash)))) {

  const encrypted = JSON.parse(localStorage.getItem('ENCRYPTED')!)
  //   if (!encryptedBase64) {
  //     return
  //   }
  //   const encrypted = Uint8Array.from(atob(encryptedBase64), (c) =>
  //     c.charCodeAt(0)
  //   ).buffer

  /* TRY JUST WITHOUT CHECK PASSWORD! */

  const decrypted = await decrypt(new Uint8Array(encrypted).buffer, inputPasswordHash)

  console.log({decrypted: JSON.parse(decrypted)})
  console.timeEnd('DECRYPT_SESSION')

  return true
  // }
}

async function encryptionKey(hash: ArrayBuffer, alg: Algorithm) {
  return crypto.subtle.importKey('raw', hash, alg, false, ['encrypt', 'decrypt'])
}

export async function encrypt(data: object, passwordHash: ArrayBuffer) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const alg = {name: 'AES-GCM', iv} as const
  const key = await encryptionKey(passwordHash, alg)

  const objectToEncrypt = JSON.stringify(data)
  const encrypted = await crypto.subtle.encrypt(
    alg,
    key,
    new TextEncoder().encode(objectToEncrypt)
  )
  const encryptedWithIv = new Uint8Array(encrypted.byteLength + iv.byteLength)
  encryptedWithIv.set(iv, 0)
  encryptedWithIv.set(new Uint8Array(encrypted), iv.byteLength)

  return encryptedWithIv.buffer
}

export async function decrypt(encryptedWithIv: ArrayBuffer, passwordHash: ArrayBuffer) {
  const data = new Uint8Array(encryptedWithIv)

  const iv = data.slice(0, 12)
  const encrypted = data.slice(12)

  const alg = {name: 'AES-GCM', iv} as const
  const key = await encryptionKey(passwordHash, alg)
  const decrypted = await crypto.subtle.decrypt(alg, key, encrypted)

  return new TextDecoder().decode(decrypted)
}
