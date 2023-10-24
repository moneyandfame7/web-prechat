import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {OwnProps} from './editContact'

const EditContactAsync: FC<OwnProps> = (props) => {
  const EditContact = useLazyComponent('EditContact')

  return EditContact ? <EditContact {...props} /> : null
}
export default memo(EditContactAsync)
