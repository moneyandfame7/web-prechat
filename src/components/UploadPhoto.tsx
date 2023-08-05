import type {FunctionComponent} from 'preact'
import {useRef, useState} from 'preact/hooks'
import type {TargetedEvent} from 'preact/compat'

import {Icon} from './ui'

import Croppie from 'croppie'
import 'croppie/croppie.css'
import './UploadPhoto.scss'

export const UploadPhoto: FunctionComponent = () => {
  return (
    <div class="UploadPhoto">
      <Icon name="cameraAdd" width={40} height={40} />
    </div>
  )
}

export const ImageUpload: React.FC = () => {
  const croppieRef = useRef<HTMLDivElement | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [croppieInstance, setCroppieInstance] = useState<Croppie | null>(null)

  const handleImageChange = (event: TargetedEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) {
      setSelectedImage(file)
      initializeCroppie(file)
    }
  }
  /* 
коли будемо робити upload image, в cropp передаємо розмір зображення початковий, щоб від нього вже зробити boundary ????
*/
  const initializeCroppie = (file: File) => {
    if (croppieRef.current) {
      const newCroppieInstance = new Croppie(croppieRef.current, {
        viewport: {width: 200, height: 200, type: 'circle'},
        boundary: {width: 300, height: 300},
        showZoomer: true
      })
      setCroppieInstance(newCroppieInstance)

      const reader = new FileReader()
      reader.onload = async () => {
        if (reader.result && newCroppieInstance) {
          await newCroppieInstance.bind({url: reader.result as string})
          const croppedResult = await newCroppieInstance.result({
            type: 'base64'
          })
          setResult(croppedResult)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = async () => {
    if (selectedImage && croppieInstance) {
      try {
        const croppedResult = await croppieInstance.result({
          type: 'base64',
          circle: true
        })

        console.log(croppieRef.current)
        setResult(croppedResult)
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div ref={croppieRef} />
      <button onClick={handleCrop} disabled={!croppieInstance}>
        Crop
      </button>
      {result && <img src={result} alt="Cropped" />}
    </div>
  )
}
