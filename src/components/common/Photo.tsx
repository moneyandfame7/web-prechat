import {type FC, useState} from 'preact/compat'

import {Blurhash} from 'react-blurhash'

import './Photo.scss'

interface PhotoProps {
  url: string
  blurHash: string
  width?: number | string
  height?: number | string
  alt: string
}
const Photo: FC<PhotoProps> = ({url, blurHash, width, height, alt}) => {
  const [imgIsLoad, setImgIsLoad] = useState(false)
  return (
    <div class="media-photo-container" style={{width, height}}>
      {/* @ts-expect-error Preact types are confused */}
      {blurHash && <Blurhash hash={blurHash} width="100%" height="100%" />}

      <img
        alt={alt}
        class="media-photo"
        width="100%"
        height="100%"
        style={{
          opacity: imgIsLoad ? 1 : 0,
        }}
        src={url}
        onLoad={() => setImgIsLoad(true)}
      />
    </div>
  )
}
export {Photo}
