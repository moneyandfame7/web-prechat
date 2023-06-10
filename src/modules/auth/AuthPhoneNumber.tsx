import { FC, memo, useState } from 'preact/compat'

import { InputText } from 'components/Input'
import { t } from 'state/i18n'

import './AuthPhoneNumber.scss'

const AuthPhoneNumber: FC = () => {
  const [phone, setPhone] = useState('')
  return (
    <>
      <h1 class="title text-center">{t('Auth.Title')}</h1>
      <p class="subtitle text-center">{t('Auth.Subtitle')}</p>
      <InputText
        onInput={(value) => {
          setPhone(value)
        }}
        placeholder="Search"
        disabled
        value={phone}
      />
      <InputText
        label="Country"
        onInput={(value) => {
          setPhone(value)
        }}
        placeholder="Search"
        value={phone}
      />
      <InputText
        onInput={(value) => {
          setPhone(value)
        }}
        placeholder="Search"
        error="Lox ebaniy aahhaha"
        maxLength={10}
        value={phone}
      />
      <InputText
        label="Enter password"
        onInput={(value) => {
          setPhone(value)
        }}
        value={phone}
      />
      <input placeholder="Phone number"></input>
      <button>Continue</button>
    </>
  )
}

export default memo(AuthPhoneNumber)
