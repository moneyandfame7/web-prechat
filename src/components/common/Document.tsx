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

import './Document.scss'

interface OwnProps {
  document: ApiDocument
}
export const Document: FC<OwnProps> = ({document}) => {
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
  const isFetchingRef = useRef(false)
  const abortRef = useRef<VoidFunction | null>(null)
  const handleClick = () => {
    if (isFetchingRef.current) {
      console.log('FETCHING NOW!')
      abortRef.current?.()
      return
    }
    fetchWithProgress({
      url: document.url,
      onProgress: (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          console.log(`Progress: ${percentComplete}%`)

          formattedDownloadProgress.value = `${convertFileSize(e.loaded)} / `
        }
      },
      onReady: (response) => {
        isFetchingRef.current = false
        setIsFetching(false)
        downloadFile(response, document.fileName)
        formattedDownloadProgress.value = ''
      },
      onAbort: (abortHandler) => {
        abortRef.current = () => {
          isFetchingRef.current = false
          setIsFetching(false)
          formattedDownloadProgress.value = ''
          abortHandler()
        }
      },
    })
    isFetchingRef.current = true
    setIsFetching(true)
  }

  const clickHandlers = useFastClick(handleClick, true)
  // const activeTransitionKey=isFetching?1:0

  const buildedClass = clsx('document', {
    'is-loading': isFetching,
  })
  return (
    <div class={buildedClass} {...clickHandlers}>
      {/* <SingleTransition in={isFetching} name="zoomIcon">
        <Icon name="download" />
      </SingleTransition> */}
      <div class="document-preview">
        <Loader isVisible={isFetching} isCancelable size="small" withBackground={false} />

        <Icon name="download" color="white" />
        <div class="document-extension">
          .{document.extension || getFileExtension(document.fileName)}
        </div>
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
