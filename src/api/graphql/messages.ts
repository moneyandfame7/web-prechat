import {type DocumentNode, gql} from '@apollo/client'

export const FRAGMENT_MESSAGE: DocumentNode = gql`
  fragment AllMessageFields on Message {
    id
    senderId
    chatId
    media {
      __typename
    }
    text
    createdAt
    updatedAt
    isPost
    postAuthor
    views
  }
`

export const FRAGMENT_PHOTO: DocumentNode = gql`
  fragment AllPhotoFields on Photo {
    id
    date
    blurHash
    url
  }
`
