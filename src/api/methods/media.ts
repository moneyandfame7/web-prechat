import {ApiBaseMethod} from 'api/base'
import {MUTATION_UPLOAD_PROFILE_PHOTO} from 'api/graphql/media'
import {cleanupResponse} from 'api/helpers/cleanupResponse'

export class ApiMedia extends ApiBaseMethod {
  public async uploadProfilePhoto(file: File) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_UPLOAD_PROFILE_PHOTO,
      variables: {
        file,
      },
    })
    if (!data?.uploadProfilePhoto) {
      return undefined
    }

    return cleanupResponse(data.uploadProfilePhoto)
  }
}
