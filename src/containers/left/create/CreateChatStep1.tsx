import {type FC, memo, useCallback} from 'preact/compat'

import {FloatButton, Icon, InputText, Divider} from 'components/ui'
import {LeftColumnScreen} from 'types/ui'

import {useInputValue} from 'hooks'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'

import {ChatItem} from 'components/ChatItem'
import {useBoolean} from 'hooks/useFlag'

import './CreateChatStep1.scss'

export interface CreateChatStep1Props {
  isGroup: boolean
}
const CreateChatStep1: FC<CreateChatStep1Props> = ({isGroup}) => {
  const {setScreen} = useLeftColumn()
  const handleNextStep = useCallback(() => {
    setScreen(isGroup ? LeftColumnScreen.NewGroupStep2 : LeftColumnScreen.NewChannelStep2)
  }, [isGroup])
  const {value, handleInput} = useInputValue({})
  const {value: boolean, toggle} = useBoolean(false)
  // const items = [
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   },
  //   {
  //     withCheckbox: true,
  //     onClick: toggle,
  //     checked: boolean,
  //     title: 'Aboba',
  //     subtitle: 'petrovich',
  //     avatar:
  //       'https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  //   }
  // ]
  return (
    <>
      <div class="LeftColumn-Header">
        <LeftGoBack />
        <p class="LeftColumn-Header_title">Add Members</p>
      </div>
      <InputText
        value={value}
        onInput={handleInput}
        variant="default"
        placeholder="Add People..."
      />
      <Divider />
      <div class="picker-list scrollable">
        {/* {items.map((item, index) => (
          <ChatItem key={index} {...item} />
        ))} */}
      </div>
      <FloatButton
        shown
        onClick={handleNextStep}
        icon={<Icon name="arrowRight" />}
        aria-label="Next step"
      />
    </>
  )
}

export default memo(CreateChatStep1)
