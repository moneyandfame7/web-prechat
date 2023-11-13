import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiPhoto} from 'api/types'

export const FRAGMENT_PHOTO: DocumentNode = gql`
  fragment AllPhotoFields on Photo {
    id
    date
    blurHash
    url
    width
    height
    withSpoiler
  }
`

export const FRAGMENT_DOCUMENT: DocumentNode = gql`
  fragment AllDocumentFields on Document {
    id
    isMedia
    date
    blurHash
    fileName
    url
    size
    mimeType
  }
`

export const MUTATION_UPLOAD_PROFILE_PHOTO: TypedDocumentNode<
  {uploadProfilePhoto: ApiPhoto},
  void
> = gql`
  mutation UploadProfilePhoto($file: Upload!) {
    uploadProfilePhoto(file: $file) {
      ...AllPhotoFields
    }
  }
  ${FRAGMENT_PHOTO}
`
