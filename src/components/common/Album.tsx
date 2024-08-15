import type {FC} from 'preact/compat'

import type {ApiMessage} from 'api/types'

import {Photo} from './Photo'

import './Album.scss'

interface OwnProps {
  message: ApiMessage
}
export const Album: FC<OwnProps> = ({message}) => {
  return (
    <div class="album">
      {message.content.photos?.map((photo) => (
        <div class="album-item" key={photo.id}>
          <Photo
            lazy
            withSpoiler={photo.withSpoiler}
            alt=""
            url={photo.url}
            blurHash={photo.blurHash}
            width={photo.width}
            height={photo.height}
          />
        </div>
      ))}
    </div>
  )
}
