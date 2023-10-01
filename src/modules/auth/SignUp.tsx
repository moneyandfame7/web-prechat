import {type FC, type TargetedEvent, memo, useCallback, useState} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {t} from 'lib/i18n'

import {UploadProfilePhoto} from 'components/UploadPhoto'
import {Button, InputText} from 'components/ui'
import {Checkbox} from 'components/ui/Checkbox'

import './SignUp.scss'

const SignUp: FC = () => {
  const {auth} = getGlobalState()
  const {signUp, uploadProfilePhoto} = getActions()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  /**
   * @todo переробити на signal?
   */
  const [silentSignUp, setSilentSignUp] = useState(false)
  const handleChangeName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    setFirstName(e.currentTarget.value)
  }, [])
  const handleChangeLastName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    setLastName(e.currentTarget.value)
  }, [])

  const handleChangeSilentSignUp = useCallback(() => {
    setSilentSignUp((prev) => !prev)
  }, [])

  const handleSubmit = useCallback(
    async (e: TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault()
      console.log({photo})
      await signUp({
        firstName,
        lastName: lastName.length === 0 ? undefined : lastName,
        // photo,
        silent: silentSignUp,
      })
      if (photo) {
        uploadProfilePhoto(photo)
      }
      /* then upload photo???? */

      console.log('THEN I NEED TO UPLOAD PHOTO')
    },
    [silentSignUp, lastName, photo]
  )
  const handleSubmitPhoto = (file: File) => {
    setPhoto(file)
  }

  return (
    <div class="Auth_signup">
      <UploadProfilePhoto size="large" onSubmit={handleSubmitPhoto} />
      <h1 class="title">Sign up</h1>
      <p class="subtitle">{t('Auth.SignUp')}</p>
      <form onSubmit={handleSubmit}>
        <InputText label={t('Name')} value={firstName} onInput={handleChangeName} />
        <InputText
          label={t('LastNameOptional')}
          value={lastName}
          onInput={handleChangeLastName}
        />
        <Checkbox
          label={t('Auth.SilentAuth')}
          onToggle={handleChangeSilentSignUp}
          checked={silentSignUp}
        />
        {firstName.length > 3 && (
          <Button isLoading={auth.isLoading} type="submit">
            {t('Auth.StartMessaging')}
          </Button>
        )}
      </form>
    </div>
  )
}

export default memo(SignUp)
