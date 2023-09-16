import {type FC, memo} from 'preact/compat'

import {connect} from 'state/connect'

import {Icon} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'

import './MessageItem.scss'

/**
 * ON DELETE - zoomFade ?
 * WebPage - preview
 */
const MessageItemImpl: FC = () => {
  return (
    <>
      <div class="message-item bubble outgoing">
        <div class="message-content">
          <p class="message-content__sender">Dolbaebik</p>
          <p class="message-content__text">
            Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello,
            bro!Hello, bro!bro!Hello, bro!bro!Hello, bro!bro!Hellasdasd
            <span class="message-meta">
              <i class="message-meta__item">edited</i>

              <span class="message-meta__item">13:25</span>
              <span class="message-meta__item message-meta__views">
                <Icon name="checks2" className="message-meta__icon" />
              </span>
              <div class="message-meta__container">
                <i class="message-meta__item">edited</i>

                <span class="message-meta__item message-meta__date">13:25</span>
                <span class="message-meta__item message-meta__views">
                  <Icon name="checks2" className="message-meta__icon" />
                </span>
              </div>
            </span>
          </p>
        </div>
      </div>
      <div class="message-item bubble incoming">
        <AvatarTest variant="GREEN" size="xs" text="D" />

        <div class="message-content">
          <p class="message-content__sender">Dolbaebik</p>
          <p class="message-content__text">
            Hello, bro!
            <span class="message-meta">
              <i class="message-meta__item">edited</i>

              <span class="message-meta__item">13:25</span>
              <span class="message-meta__item message-meta__views">
                <Icon name="checks2" className="message-meta__icon" />
              </span>
              <div class="message-meta__container">
                <i class="message-meta__item">edited</i>

                <span class="message-meta__item message-meta__date">13:25</span>
                <span class="message-meta__item message-meta__views">
                  <Icon name="checks2" className="message-meta__icon" />
                </span>
              </div>
            </span>
          </p>
        </div>
      </div>
      <div class="message-item bubble incoming">
        {/* <AvatarTest variant="GREEN" size="s" /
        > */}

        <div class="message-content">
          <p class="message-content__sender">Dolbaebik</p>
          <p class="message-content__text">
            Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello,
            bro!Hello, bro!bro!Hello, bro!bro!Hello, bro!bro!Hellasdasd
            <span class="message-meta">
              <i class="message-meta__item">edited</i>

              <span class="message-meta__item">13:25</span>
              <span class="message-meta__item message-meta__views">
                <Icon name="checks2" className="message-meta__icon" />
              </span>
              <div class="message-meta__container">
                <i class="message-meta__item">edited</i>

                <span class="message-meta__item message-meta__date">13:25</span>
                <span class="message-meta__item message-meta__views">
                  <Icon name="checks2" className="message-meta__icon" />
                </span>
              </div>
            </span>
          </p>
        </div>
      </div>
      <div class="message-item action">
        <div class="message-content">Lorem</div>
      </div>
    </>
  )
}

export const MessageItem = memo(
  connect(() => {
    return {}
  })(MessageItemImpl)
)
