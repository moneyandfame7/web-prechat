import {useSignal} from '@preact/signals'
import {type FC, Fragment, type StateUpdater, memo, useRef} from 'preact/compat'

import clsx from 'clsx'

import {getActions} from 'state/action'

import {MODAL_TRANSITION_MS} from 'common/environment'
import {convertFileSize} from 'utilities/convertFileSize'
import {logger} from 'utilities/logger'
import {parseMessageInput} from 'utilities/parse/parseMessageInput'

import type {Dimension} from 'types/ui'

import {Spoiler} from 'components/common/Spoiler'
import {Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'

import {MenuItem} from './menu'
import type {MenuItemProps} from './menu/Menu'
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalInput,
  ModalTitle,
} from './modal/Modal'

import './SendMediaModal.scss'

export interface MediaItem {
  id: string
  isImage: boolean
  /* should add is document or not???? */
  withSpoiler: boolean
  previewUrl?: string
  file: File
  mimeType?: string
  dimension?: Dimension
}
export interface MediaOptions {
  sendAsFiles: boolean
  groupAllMedia: boolean
}
export interface SendMediaModalProps {
  isOpen: boolean
  onClose: VoidFunction
  items: MediaItem[]
  setItems: StateUpdater<MediaItem[]>
  options: MediaOptions
  setOptions: StateUpdater<MediaOptions>
  triggerAddDocument: VoidFunction
}

/**
 * @todo:
 * - винести spoiler окремо
 * - messages.sendMedia
 *
 */
const SendMediaModal: FC<SendMediaModalProps> = ({
  isOpen,
  onClose,
  items,
  setItems,
  options,
  setOptions,
  triggerAddDocument,
}) => {
  const {sendMessage} = getActions()
  const inputRef = useRef<HTMLDivElement>(null)
  const isFocused = useSignal(false)
  const html = useSignal('')

  const handleChangeHtml = (newHtml: string) => {
    html.value = newHtml
  }

  const handleToggleOptions = (key: keyof MediaOptions) => {
    return () =>
      /* setTimeout( () =>*/ setOptions((options) => ({
        ...options,
        [key]: !options[key],
      })) /* , 150) */
  }

  const someWithSpoiler = items.some((item) => item.withSpoiler)

  const renderMenuItem = (key: keyof MediaOptions | 'hideWithSpoiler') => {
    switch (key) {
      case 'groupAllMedia':
        return {
          icon: options.groupAllMedia ? 'groupMediaOff' : 'groupMedia',
          title: options.groupAllMedia ? 'Ungroup all media' : 'Group all media',
          onClick: handleToggleOptions(key),
        } satisfies MenuItemProps
      case 'hideWithSpoiler':
        return {
          icon: someWithSpoiler ? 'mediaSpoilerOff' : 'mediaSpoiler',
          title: someWithSpoiler ? 'Remove spoiler' : 'Hide with spoiler',
          onClick: handleToggleSpoilerAll,
        } satisfies MenuItemProps
      case 'sendAsFiles':
        return {
          icon: options.sendAsFiles ? 'image' : 'document',
          title: options.sendAsFiles ? 'Send as media' : 'Send as document',
          onClick: handleToggleOptions(key),
        } satisfies MenuItemProps
    }
  }

  const handleToggleSpoilerAll = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        withSpoiler: !someWithSpoiler,
      }))
    )
  }

  const handleToggleSpoiler = (item: MediaItem) => {
    const newItems = items.map((i) => ({
      ...i,
      withSpoiler: i.id === item.id ? !item.withSpoiler : i.withSpoiler,
    }))
    setItems(newItems)
  }

  const handleDelete = (item: MediaItem) => {
    const newItems = items.filter((i) => i.id !== item.id)

    if (newItems.length === 0) {
      onClose()
      setTimeout(() => {
        setItems(newItems)
      }, MODAL_TRANSITION_MS)
    } else {
      setItems(newItems)
    }
  }

  const renderMediaItem = (item: MediaItem) => {
    if (options.sendAsFiles || !item.isImage /* || !item.previewUrl */) {
      return (
        <div class="modal-item-media is-document" key={item.id}>
          <div class="item-media-preview">
            {item.previewUrl ? <img src={item.previewUrl} /> : <div>lol kek</div>}
          </div>
          <div class="item-media-info">
            <p class="item-media-name">{item.file.name}</p>
            <p class="text-secondary">{convertFileSize(item.file.size)}</p>
          </div>
          <IconButton icon="delete" color="gray" onClick={() => handleDelete(item)} />
        </div>
      )
    }
    /**
     * @todo rewrite, hide with spoiler без опції, бо ця штука буде computed
     * якщо some withSpoiler - remove spoilers, інакше hide +
     *
     * @todo rewrite spoiler, винести окремо і в SingleTransition
     * бо зараз мерехтіння є
     */
    return (
      <div key={item.id} class="modal-item-media is-media">
        <img src={item.previewUrl} />
        <div class="item-media-utils">
          <Icon
            onClick={() => handleToggleSpoiler(item)}
            name={item.withSpoiler ? 'mediaSpoilerOff' : 'mediaSpoiler'}
            color="white"
          />
          <Icon onClick={() => handleDelete(item)} name="delete" color="white" />
        </div>
        <Spoiler shown={item.withSpoiler} />
        {/* <div class={`spoiler${item.withSpoiler ? ' shown' : ''}`} /> */}
      </div>
    )
  }
  const renderTitle = () => {
    const areSomeFiles = items.some((item) => !item.isImage)
    return areSomeFiles ? 'Send files' : 'Send media'
  }

  const handleSubmit = async () => {
    logger.info('UPLOAD IMAGES!!!!! OR DOCUMENTS?????!!!')

    sendMessage({
      text: parseMessageInput(html.value).text,
      mediaItems: items,
    })
    onClose()
  }

  const buildedClass = clsx('send-media-modal', {
    grouped: options.groupAllMedia,
    'has-documents': items.some((item) => !item.isImage),
  })
  return (
    <Modal className={buildedClass} isOpen={isOpen} onClose={onClose} closeOnEsc>
      <ModalHeader hasCloseButton>
        <ModalTitle>{renderTitle()}</ModalTitle>

        <DropdownMenu
          timeout={150}
          button={<IconButton icon="more" />}
          placement={{top: true, right: true}}
          transform="top right"
        >
          <MenuItem icon="plus" title="Add" onClick={triggerAddDocument} />
          <MenuItem {...renderMenuItem('sendAsFiles')} />
          <MenuItem {...renderMenuItem('hideWithSpoiler')} />
          <MenuItem {...renderMenuItem('groupAllMedia')} />
        </DropdownMenu>
      </ModalHeader>
      <ModalContent>
        {/* {array.map((_, i) => {
          return (
            <div key={i} class="modal-item-media">
              <img src="https://images.unsplash.com/photo-1698836367877-b73d392e0443?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              <div class="item-media-utils">
                <Icon
                  onClick={toggle}
                  name={!value ? 'mediaSpoiler' : 'mediaSpoilerOff'}
                  color="white"
                />
                <Icon name="delete" color="white" />
              </div>
              <div class={`spoiler${value ? ' shown' : ''}`} />
            </div>
          )
        })} */}
        {items.map((item) => (
          <Fragment key={item.id}>{renderMediaItem(item)}</Fragment>
        ))}
        {/* {items.map((item) => (
          <div key={item.id} class="modal-item-media">
            <img src="https://images.unsplash.com/photo-1698836367877-b73d392e0443?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <div class="item-media-utils">
              <Icon
                onClick={toggle}
                name={!value ? 'mediaSpoiler' : 'mediaSpoilerOff'}
                color="white"
              />
              <Icon name="delete" color="white" />
            </div>
            <div class={`spoiler${value ? ' shown' : ''}`} />
          </div>
        ))} */}
        {/* <div class="modal-item-media">
          <img src="https://images.unsplash.com/photo-1697577473134-46490cf51044?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </> */}
      </ModalContent>
      <ModalFooter>
        <ModalInput
          onSubmit={handleSubmit}
          maxHeight={150}
          placeholder="Add a caption..."
          html={html}
          inputRef={inputRef}
          isFocused={isFocused}
          onChange={handleChangeHtml}
        />
      </ModalFooter>
    </Modal>
  )
}

export default memo(SendMediaModal)
