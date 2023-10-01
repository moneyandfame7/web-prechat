export interface SignUpPayload {
  silent: boolean
  firstName: string
  lastName?: string
}
export interface SignInPayload {
  firebase_token: string
}
