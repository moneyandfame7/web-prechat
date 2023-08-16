export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

export async function sha256(data: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', encodeText(data))
}

export function encodeText(text: string): ArrayBuffer {
  return new TextEncoder().encode(text)
}

export function decodeText(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer)
}
