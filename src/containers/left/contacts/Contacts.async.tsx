import {type FC, Suspense, lazy, memo} from 'preact/compat'

const ContactsAsync: FC = (props) => {
  const Contacts = lazy(() => import('./Contacts'))

  return (
    <Suspense fallback={null}>
      <Contacts {...props} />
    </Suspense>
  )
}

export default memo(ContactsAsync)
