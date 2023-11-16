import {type Signal, useComputed, useSignal} from '@preact/signals'
import {
  type FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/compat'

import clsx from 'clsx'
import {Blurhash} from 'react-blurhash'

import {fetchWithProgress} from 'api/helpers/fetchWithProgress'

import {SingleTransition} from 'components/transitions'
import {Loader} from 'components/ui/Loader'

import {Spoiler} from './Spoiler'

import './Photo.scss'

interface PhotoProps {
  url: string
  blurHash?: string
  width?: number | string
  height?: number | string
  alt: string
  lazy?: boolean
  hideBlurhash?: boolean
  withSpoiler?: boolean
  interactive?: boolean
  canAutoLoad?: boolean
  withLoader?: boolean

  isUploading?: boolean

  customProgress?: Signal<number>
}
const photoCache = new Set<string>()

/**
 * @todo cache urls, usestate init true if url in cache?
 */
const Photo: FC<PhotoProps> = memo(
  ({
    url,
    blurHash,
    width,
    height,
    alt,
    lazy = false,
    withSpoiler = false,
    interactive = false,
    // canAutoLoad = false,
    isUploading = false,
    withLoader,
    customProgress,
    hideBlurhash: mountBlurhash,
  }) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const abortRef = useRef<VoidFunction | null>(null)
    const [imgIsLoad, setImgIsLoad] = useState(photoCache.has(url))
    const [isImgLoading, setIsImgLoading] = useState(/* canAutoLoad || */ isUploading)
    const [isSpoilerShown, setIsSpoilerShown] = useState(withSpoiler)
    const handleLoadImage = useCallback(() => {
      if (imgIsLoad) {
        return
      }
      fetchWithProgress({
        url,
        onProgress: (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            progress.value = percentComplete
          }
        },
        onAbort: (abortHandler) => {
          abortRef.current = abortHandler
        },
        onReady: (response) => {
          // if (!imageRef.current) {
          //   return
          // }
          // if (imageRef.current) {
          // const newSrc = URL.createObjectURL(response)
          // imageRef.current!.src = newSrc
          // setImgIsLoad(true)
          setIsImgLoading(isUploading || false)
          // }
        },
        onStart: () => {
          // setIsImgLoading(true)
        },
      })
    }, [isUploading, imgIsLoad])

    // useEffect(()=>)
    const handleAbortLoading = useCallback(() => {
      if (!abortRef.current) {
        return
      }
      progress.value = 0
      setImgIsLoad(false)
      setIsImgLoading(false)
      abortRef.current()
    }, [])
    useEffect(() => {
      photoCache.add(url)
    }, [])

    useLayoutEffect(() => {
      setIsImgLoading(isUploading)
    }, [isUploading])
    useLayoutEffect(() => {
      // if (canAutoLoad) {
      handleLoadImage()
      // }
    }, [])
    const handleClick = () => {
      if (withSpoiler && isSpoilerShown) {
        setIsSpoilerShown(false)
        // if (canAutoLoad && interactive) {
        // handleLoadImage()
        // }
      } else if (!isImgLoading && !imgIsLoad) {
        handleLoadImage()
      } else if (!imgIsLoad && isImgLoading && abortRef.current) {
        handleAbortLoading()
      }
    }
    // якщо зі спойлером і спойлер НЕ ПОКАЗАНИЙ - не показувати img
    const buildedClass = clsx('media-photo-container', {
      'is-load': imgIsLoad,
      'has-spoiler': withSpoiler,
      blured: !blurHash,
    })
    const progress = useSignal(0)

    const computedProgress = useComputed(() =>
      customProgress ? customProgress.value : progress.value
    )
    /* mountBlurhash?imgIsLoad?null:blurhash:blurhash */
    return (
      <div class={buildedClass} style={{width, height}} onClick={handleClick}>
        {/* {blurHash &&
          (mountBlurhash ? (
            imgIsLoad ? null : (
              // @ts-expect-error Preact types are confused
              <Blurhash
                className="media-blurhash"
                hash={blurHash}
                width="100%"
                height="100%"
              />
            )
          ) : (
            // @ts-expect-error Preact types are confused
            <Blurhash className="media-blurhash" hash={blurHash} width="100%" height="100%" />
          ))} */}
        {withSpoiler && ( // ЗАЛИШИТИ imgIsLoad чи ні ???
          <Spoiler
            shown={
              /* interactive ? isSpoilerShown : */ isSpoilerShown ||
              !imgIsLoad /* || !imgIsLoad */
            }
          />
        )}
        {blurHash && (
          // @ts-expect-error Preact types are confused
          <Blurhash
            className="media-blurhash"
            hash={blurHash}
            width="100%"
            height="100%"
            style={{
              visibility: mountBlurhash ? (imgIsLoad ? 'hidden' : 'visible') : 'visible',
            }}
          />
        )}
        {(interactive || withLoader) /* && !isSpoilerShown */ && (
          <Loader
            isVisible={(!imgIsLoad && withLoader && !isSpoilerShown) || isUploading}
            isLoading={isImgLoading}
            isCancelable={interactive}
          />
        )}
        {/* <Loader isLoading isPending={false} isVisible size="large" isCancelable={true} /> */}
        {/* {interactive } */}
        {(interactive || withLoader) && (
          <SingleTransition
            className="media-progress"
            in={isImgLoading}
            timeout={150}
            name="zoomFade"
          >
            {computedProgress}%
          </SingleTransition>
        )}

        {
          /* withSpoiler && isSpoilerShown ? null : */ <img
            ref={imageRef}
            // onError={() => {
            //   setImgIsLoad(false)
            // }}
            loading={lazy ? 'lazy' : 'eager'}
            alt={alt}
            class="media-photo"
            width="100%"
            height="100%"
            style={{
              opacity: imgIsLoad ? 1 : 0,
            }}
            src={url}
            onLoad={() => {
              setImgIsLoad(true)
            }}
          />
        }
      </div>
    )
  }
)
export {Photo}
