import {type FC, memo} from 'preact/compat'

import {useFastClick} from 'hooks/useFastClick'

import {Portal} from 'components/ui/Portal'

import styles from './UpdateAppPopup.module.scss'

export interface UpdateAppPopupProps {
  onUpdate: VoidFunction
}
const UpdateAppPopup: FC<UpdateAppPopupProps> = (/* {onUpdate} */) => {
  // eslint-disable-next-line no-console
  const clickHandlers = useFastClick(console.log, false)

  return (
    <Portal>
      <div {...clickHandlers} class={styles.root}>
        <div class={styles.container}>
          <h1 class={styles.header}>Prechat has updated...</h1>
          <p class={styles.subtitle}>
            {
              'Another tab is running a newer version of Prechat.\nClick anywhere to reload this tab.'
            }
          </p>
        </div>
      </div>
    </Portal>
  )
}

export default memo(UpdateAppPopup)
