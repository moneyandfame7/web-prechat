import {decodeText, encodeText} from './helpers'
export interface EncryptedData {
  iv: Uint8Array
  data: ArrayBuffer
}

export async function encrypt(data: string, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const alg = {name: 'AES-GCM', iv}
  return {
    iv,
    data: await crypto.subtle.encrypt(alg, key, encodeText(data))
  }
}

export async function decrypt(encrypted: EncryptedData, key: CryptoKey) {
  const {iv, data} = encrypted

  const decrypted = await crypto.subtle.decrypt({name: 'AES-GCM', iv}, key, data)
  return decodeText(decrypted)
}
