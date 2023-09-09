import type {ApiChat, ApiUser} from '.'

export type AddContactInput = {
  firstName: string
  lastName?: string
} & (
  | {
      userId: string
    }
  | {
      phoneNumber: string
    }
)

export interface AddContactResponse {
  user: ApiUser
  chat: ApiChat
}
