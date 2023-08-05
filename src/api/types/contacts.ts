// export interface AddContactInput {
//   firstName: string
//   lastName?: string
//   phoneNumber?: string
//   userId?: string
// }
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
