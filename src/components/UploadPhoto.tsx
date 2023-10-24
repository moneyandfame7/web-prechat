import {useSignal} from '@preact/signals'
import type {FC} from 'preact/compat'
import {useEffect, useRef, useState} from 'preact/hooks'

import {useBoolean} from 'hooks/useFlag'

import CropPhotoModal from './popups/CropPhotoModal.async'
// import 'croppie/croppie.css'
import {Icon} from './ui'

import './UploadPhoto.scss'

interface UploadProfilePhotoProps {
  size?: 'large' | 'small'
  onSubmit: (file: File) => void
}

export const UploadProfilePhoto: FC<UploadProfilePhotoProps> = ({size, onSubmit}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    // console.log({selectedImage})
    if (selectedImage) {
      openModal()
    } /* else {
      closeModal()
      if (inputRef.current) {
        inputRef.current.files = null
      }
    } */
  }, [selectedImage])

  const {value: isModalOpen, setFalse: closeModal, setTrue: openModal} = useBoolean()
  const previewUrl = useSignal('')
  const handleSubmit = ({url, file}: {url: string; file: File}) => {
    previewUrl.value = url
    onSubmit(file)
    closeModal()
  }
  return (
    <div>
      <div class="UploadPhoto large">
        <Icon name="cameraAdd" />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          id="uploadPhotoInput"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0]
            if (file) {
              e.currentTarget.value = ''
              // inputRef.current.value=""
              setSelectedImage(file)
            }
          }}
        />
        {previewUrl.value && (
          <img src={previewUrl} width={150} height={150} alt="User profile avatar" />
        )}
      </div>
      {/* <CommonModal isOpen={!!selectedImage} /> */}
      <CropPhotoModal
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => {
          closeModal()
          setSelectedImage(null)
        }}
        selectedFile={selectedImage}
      />
    </div>
  )
}
