import { type FC, Suspense, lazy, memo } from 'preact/compat'

import { timeout } from 'utilities/timeout'

const ContactsAsync: FC = (props) => {
  const Contacts = lazy(() =>
    import('./Contacts').then((module) => module.default).then(timeout(5000))
  )
  return (
    <Suspense fallback="LOADING...">
      <Contacts {...props} />
    </Suspense>
  )
}

export default memo(ContactsAsync)
