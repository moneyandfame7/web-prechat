import {generateSalt, sha256} from './helpers'

export async function hashPassword(password: string) {
  const salt = generateSalt()
  const hashed = await sha256(password + salt)
  return {salt, hashed}
}

export async function verifyPassword(enteredPassword: string) {
  const savedHash = /* await db.get('passwordHash'); */ null

  const {hashed} = await hashPassword(enteredPassword)

  return hashed === savedHash
}
