import { FC, memo, useState } from 'preact/compat'

import { Button } from 'components/Button'
import { InputText } from 'components/Input'
import { t } from 'state/i18n'

import './AuthPhoneNumber.scss'

const AuthPhoneNumber: FC = () => {
  const [phone, setPhone] = useState('')
  return (
    <>
      <h4 class="text-center">{t('Auth.Title')}</h4>
      <p class="subtitle text-center">{t('Auth.Subtitle')}</p>
      <InputText
        // label="Country"
        onInput={(value) => {
          setPhone(value)
        }}
        placeholder="Search"
        // error="Lox ebaniy aahhaha"
        disabled
        value={phone}
        // placeholder="Aooo"
      />
      <InputText
        label="Country"
        onInput={(value) => {
          setPhone(value)
        }}
        placeholder="Search"
        // error="Lox ebaniy aahhaha"
        // disabled
        value={phone}
        // placeholder="Aooo"
      />
      <InputText
        label="Enter password"
        onInput={(value) => {
          setPhone(value)
        }}
        // placeholder="Search"
        // error="Lox ebaniy aahhaha"
        // disabled
        maxLength={10}
        value={phone}
        // placeholder="Aooo"
      />
      <input placeholder="Phone number"></input>
      <Button>Change to ukrainian</Button>
      <button>Continue</button>
    </>
  )
}

export default memo(AuthPhoneNumber)
