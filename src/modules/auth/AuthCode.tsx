import { FC, memo } from 'preact/compat'

import './AuthCode.scss'

const AuthCode: FC = () => {
  // const [number, setNumber] = useState('')
  // const [code, setCode] = useState('')

  // useEffect(() => {
  //   if (!window.recaptchaVerifier) {
  //     generateRecaptcha()
  //   }
  // }, [])
  // const handleSubmit = (e: TargetedEvent<HTMLFormElement, Event>) => {
  //   e.preventDefault()
  //   sendCode(number)
  // }

  // const handleChangeNumber = (e: TargetedEvent<HTMLInputElement, Event>) => {
  //   e.preventDefault()
  //   setNumber(e.currentTarget.value)
  // }

  // const handleChangeCode = (e: TargetedEvent<HTMLInputElement, Event>) => {
  //   e.preventDefault()
  //   const { value } = e.currentTarget
  //   setCode(value)

  //   if (value.length === 6) {
  //     /* Verify here */
  //     console.log(value)
  //     window.confirmResult
  //       .confirm(value)
  //       .then((res) => {
  //         console.log(res)
  //       })
  //       .catch((err) => {
  //         console.log({ err })
  //       })
  //   }
  // }
  // const handleResetCode = () => {
  //   resetCaptcha()
  //   sendCode(number)
  // }
  return <h1>Code</h1>
}

export default memo(AuthCode)
