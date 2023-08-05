import type {FC, TargetedEvent} from 'preact/compat'
import {memo, useCallback, useState} from 'preact/compat'

import {getActions} from 'state/action'

import {t} from 'lib/i18n'

import {Button, InputText} from 'components/ui'
import {Checkbox} from 'components/ui/Checkbox'
import {UploadPhoto} from 'components/UploadPhoto'

import './SignUp.scss'
import {getGlobalState} from 'state/signal'

const SignUp: FC = () => {
  const {auth} = getGlobalState()
  const {signUp} = getActions()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  /**
   * @todo переробити на signal?
   */
  const [silentSignUp, setSilentSignUp] = useState(false)
  const handleChangeName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    setFirstName(e.currentTarget.value)
  }, [])
  const handleChangeLastName = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      e.preventDefault()

      setLastName(e.currentTarget.value)
    },
    []
  )

  const handleChangeSilentSignUp = useCallback(() => {
    setSilentSignUp((prev) => !prev)
  }, [])

  const handleSubmit = useCallback(
    (e: TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault()
      signUp({
        firstName,
        lastName: lastName.length === 0 ? undefined : lastName,
        // photo,
        silent: silentSignUp
      })
    },
    [silentSignUp, lastName]
  )

  return (
    <>
      <UploadPhoto />
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
    </>
  )
}

export default memo(SignUp)
