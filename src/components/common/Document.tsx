import {useSignal} from '@preact/signals'
import {type FC, useRef, useState} from 'preact/compat'

import clsx from 'clsx'

import {fetchWithProgress} from 'api/helpers/fetchWithProgress'
import {type ApiDocument} from 'api/types'

import {useFastClick} from 'hooks/useFastClick'

import {convertFileSize} from 'utilities/convertFileSize'
import {downloadFile} from 'utilities/file/downloadFile'
import {getFileExtension} from 'utilities/file/getFileExtension'

import {Icon} from 'components/ui'
import {Loader} from 'components/ui/Loader'

import {Photo} from './Photo'

import './Document.scss'

interface OwnProps {
  document: ApiDocument
  isUploading?: boolean
}
export const Document: FC<OwnProps> = ({document, isUploading}) => {
  // const handleDownloadDocument = async () => {
  //   const response = await fetch(document.url)
  //   const blob = await response.blob()

  //   const blobUrl = window.URL.createObjectURL(blob)

  //   const link = window.document.createElement('a')
  //   link.style.display = 'none'
  //   link.href = blobUrl
  //   link.download = document.fileName
  //   link.click()

  //   window.URL.revokeObjectURL(blobUrl)
  // }
  const formattedDownloadProgress = useSignal('')
  const [isFetching, setIsFetching] = useState(false)
  const abortRef = useRef<VoidFunction | null>(null)

  const shouldRenderLoader = isUploading || isFetching

  const handleClick = () => {
    if (isFetching) {
      abortRef.current?.()
      return
    }
    fetchWithProgress({
      url: document.url,
      onProgress: (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          console.log(`Progress: ${percentComplete}%`)
          const convertedLoadedSize = `${convertFileSize(e.loaded)} / `
          console.log(e.loaded, e.total, convertedLoadedSize)
          formattedDownloadProgress.value = convertedLoadedSize
        }
      },
      onReady: (response) => {
        setIsFetching(false)
        downloadFile(response, document.fileName)
        formattedDownloadProgress.value = ''
      },
      onAbort: (abortHandler) => {
        abortRef.current = () => {
          setIsFetching(false)
          formattedDownloadProgress.value = ''
          abortHandler()
        }
      },
    })
    setIsFetching(true)
  }

  const clickHandlers = useFastClick(handleClick, true)
  // const activeTransitionKey=isFetching?1:0

  const buildedClass = clsx('document', {
    'is-loading': isFetching,
    'is-media': document.isMedia,
  })

  function renderPreview() {
    if (document.isMedia) {
      return (
        <Photo
          hideBlurhash
          blurHash={document.blurHash}
          url={document.url}
          alt=""
          height={50}
          width={50}
        />
      )
    }

    return (
      <div class="document-extension">
        .{document.extension || getFileExtension(document.fileName)}
      </div>
    )
  }
  return (
    <div class={buildedClass} {...clickHandlers}>
      {/* <SingleTransition in={isFetching} name="zoomIcon">
        <Icon name="download" />
      </SingleTransition> */}
      <div class="document-preview">
        <Loader
          isVisible={shouldRenderLoader}
          isCancelable
          size="small"
          withBackground={false}
        />

        <Icon name="download" color="white" />
        {renderPreview()}
      </div>
      <div class="document-info">
        <p class="document-info__title">{document.fileName}</p>
        {document.size && (
          <p class="document-info__subtitle">
            {formattedDownloadProgress}
            {convertFileSize(document.size)}
          </p>
        )}
      </div>
    </div>
  )
}
