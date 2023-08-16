import {ScreenLoader} from 'components/ScreenLoader'

import {type FC, Suspense, memo, lazy} from 'preact/compat'
import {timeout} from 'utilities/schedulers/timeout'
// import {timeout} from 'utilities/timeout'
// import {timeout} from 'utilities/timeout'

const ContactsAsync: FC = (props) => {
  const Contacts = lazy(() =>
    import('./Contacts').then((module) => module.default).then(timeout(0))
  )

  return (
    <Suspense fallback={<ScreenLoader />}>
      <Contacts {...props} />
    </Suspense>
  )
}

export default memo(ContactsAsync)
