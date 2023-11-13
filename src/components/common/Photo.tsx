import {useSignal} from '@preact/signals'
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

// import {useForceUpdate} from 'hooks/useForceUpdate'
import './Photo.scss'

interface PhotoProps {
  url: string
  blurHash?: string
  width?: number | string
  height?: number | string
  alt: string
  lazy?: boolean
  mountBlurhash?: boolean
  withSpoiler?: boolean
  interactive?: boolean
  canAutoLoad?: boolean
  withLoader?: boolean
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
    canAutoLoad = false,
    withLoader,
  }) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const [imgIsLoad, setImgIsLoad] = useState(photoCache.has(url))
    const [isImgLoading, setIsImgLoading] = useState(canAutoLoad)
    const spoilerShown = useSignal(withSpoiler)
    const abortRef = useRef<VoidFunction | null>(null)

    const handleLoadImage = useCallback(() => {
      fetchWithProgress({
        url,
        onProgress: (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            console.log({percentComplete})
            progress.value = percentComplete
          }
        },
        onAbort: (abortHandler) => {
          abortRef.current = abortHandler
        },
        onReady: (response) => {
          if (imageRef.current) {
            imageRef.current!.src = URL.createObjectURL(response)
            setImgIsLoad(true)
            setIsImgLoading(false)
          }
        },
        onStart: () => {
          setIsImgLoading(true)
        },
      })
    }, [])

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
    }, [url])

    const handleClick = () => {
      if (withSpoiler && spoilerShown.value) {
        spoilerShown.value = false
        if (canAutoLoad && interactive) {
          handleLoadImage()
        }
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
    })
    const progress = useSignal(0)
    useLayoutEffect(() => {
      if (!interactive || !canAutoLoad || spoilerShown.value) {
        return
      }
      handleLoadImage()
    }, [])

    return (
      <div class={buildedClass} style={{width, height}} onClick={handleClick}>
        {blurHash /* && !imgIsLoad */ && (
          // @ts-expect-error Preact types are confused
          <Blurhash className="media-blurhash" hash={blurHash} width="100%" height="100%" />
        )}
        {(interactive || withLoader) && !spoilerShown.value && (
          <Loader
            isLoading={interactive || !imgIsLoad}
            isPending={!canAutoLoad && !isImgLoading && interactive}
            isVisible
            size="large"
            isCancelable={interactive}
          />
        )}
        {/* <Loader isLoading isPending={false} isVisible size="large" isCancelable={true} /> */}
        {/* {interactive } */}

        <SingleTransition
          className="media-progress"
          in={isImgLoading && !spoilerShown.value}
          timeout={150}
          name="zoomFade"
        >
          {progress}%
        </SingleTransition>
        {withSpoiler && spoilerShown.value ? null : (
          <img
            ref={imageRef}
            onError={() => {
              setImgIsLoad(false)
            }}
            loading={lazy ? 'lazy' : 'eager'}
            alt={alt}
            class="media-photo"
            width="100%"
            height="100%"
            style={{
              opacity: imgIsLoad ? 1 : 0,
            }}
            src={interactive ? undefined : url}
            onLoad={() => {
              setImgIsLoad(true)
            }}
          />
        )}

        {withSpoiler && ( // ЗАЛИШИТИ imgIsLoad чи ні ???
          <Spoiler
            shown={
              interactive
                ? spoilerShown.value
                : spoilerShown.value || !imgIsLoad /* || !imgIsLoad */
            }
          />
        )}
      </div>
    )
  }
)
export {Photo}
