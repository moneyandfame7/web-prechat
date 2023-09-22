import {type FC} from 'preact/compat'

import {Icon} from 'components/ui'

import styles from './NoMessages.module.scss'

interface NoMessagesProps {
  isSavedMessages?: boolean
}
const NoMessages: FC<NoMessagesProps> = ({isSavedMessages}) => {
  function renderSavedMessagesText() {
    return (
      <div class={styles.savedMessages}>
        <Icon className={styles.icon} name="cloudDownload" />
        <h4 class={styles.title}>Your cloud storage</h4>
        <ul class={styles.list}>
          <li>Forward messages here to save them</li>
          <li>Send media and files to store them</li>
          <li>Access this chat from any device</li>
          <li>Use search for quickly find things</li>
        </ul>
      </div>
    )
  }

  return (
    <div class={styles.root}>
      <div class={styles.wrapper}>{isSavedMessages && renderSavedMessagesText()}</div>
    </div>
  )
}

export {NoMessages}
