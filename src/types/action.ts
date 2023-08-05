export interface SignUpPayload {
  silent: boolean
  firstName: string
  photo?: File
  lastName?: string
}
export interface SignInPayload {
  firebase_token: string
}
