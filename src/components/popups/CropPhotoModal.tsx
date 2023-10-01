import {type FC, useEffect, useRef, useState} from 'preact/compat'

import Croppie from 'croppie'

import {IS_SMALL_SCREEN} from 'common/environment'

import {IconButton} from 'components/ui'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './CropPhotoModal.scss'

export interface CropPhotoModalProps {
  isOpen: boolean
  onClose: VoidFunction
  selectedFile: File | null
  onSubmit: ({url, file}: {url: string; file: File}) => void
}
const CropPhotoModal: FC<CropPhotoModalProps> = ({
  isOpen,
  selectedFile,
  onClose,
  onSubmit,
}) => {
  useEffect(() => {
    if (isOpen && selectedFile) {
      initializeCroppie(selectedFile)
    }
  }, [isOpen])
  const croppieRef = useRef<HTMLDivElement | null>(null)
  const [croppieInstance, setCroppieInstance] = useState<Croppie | null>(null)
  const initializeCroppie = (file: File) => {
    if (croppieRef.current && !croppieInstance) {
      const newCroppieInstance = new Croppie(croppieRef.current, {
        viewport: {
          width: IS_SMALL_SCREEN ? 240 : 400,
          height: IS_SMALL_SCREEN ? 240 : 400,
          // width: 140,
          // height: 140,
          type: 'circle',
        },
        boundary: IS_SMALL_SCREEN ? {width: 240, height: 240} : {width: 400, height: 400},
        // enforceBoundary: true,
        showZoomer: true,
      })
      setCroppieInstance(newCroppieInstance)

      const reader = new FileReader()
      reader.onload = async () => {
        if (reader.result && newCroppieInstance) {
          await newCroppieInstance.bind({url: reader.result as string})
          const croppedResult = await newCroppieInstance.result({
            type: 'blob',
            circle: false,
          })

          console.log({croppedResult})
          // setResult(croppedResult)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = async () => {
    if (selectedFile && croppieInstance) {
      try {
        const croppedResult = await croppieInstance.result({
          type: 'blob',
          circle: false,
        })

        const url = URL.createObjectURL(croppedResult)
        // console.log(croppedResult)
        // eslint-disable-next-line no-console
        const file = new File([croppedResult], selectedFile.name, {
          type: 'image/png',
        })
        onSubmit({url, file})
        // setResult(croppedResult)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error cropping image:', error)
      }
    }
  }

  const handleSubmit = () => {
    handleCrop()
    setCroppieInstance(null)
    onClose()
  }
  return (
    <Modal
      closeOnEsc
      // shouldCloseOnBackdrop
      className="crop-photo-modal"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader hasCloseButton>
        <ModalTitle>Drag to Reposition</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <div ref={croppieRef} />
      </ModalContent>
      <ModalActions>
        <IconButton variant="contained" color="primary" icon="check" onClick={handleSubmit} />
      </ModalActions>
    </Modal>
  )
}

export default CropPhotoModal
