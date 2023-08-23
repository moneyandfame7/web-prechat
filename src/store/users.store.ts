import {Api} from 'api/manager'
import type {ApiInputUser, ApiUser} from 'api/types'
import {createStore} from 'lib/store'
import {buildRecord} from 'utilities/object/buildRecord'
import {deepUpdate} from 'utilities/object/deepUpdate'
import {usersStorage} from './storages/users.storage'

interface UsersState {
  byId: Record<string, ApiUser>
  contactsList: string[]
  newContact: {
    userId?: string
    isByPhoneNumber: boolean
  }
}

const initialState: UsersState = {
  byId: {},
  contactsList: [],
  /* Ui */
  newContact: {
    isByPhoneNumber: false
  }
}
async function updateUsers(state: UsersState, byId: Record<string, ApiUser>) {
  deepUpdate(state.byId, byId)

  updateContactsList(state, Object.values(byId))
  /* check without await. */
  await usersStorage.put(byId)
}
function updateContactsList(state: UsersState, users: ApiUser[]) {
  const updatedList = users
    .filter((u) => u.isContact && !state.contactsList.includes(u.id))
    .map((u) => u.id)

  if (updatedList.length === 0) {
    return
  }

  state.contactsList.push(...updatedList)
}

function updateModalState(state: UsersState, newContact: UsersState['newContact']) {
  deepUpdate(state.newContact, newContact)
}
export const usersStore = createStore({
  initialState,
  name: 'usersStore',
  actionHandlers: {
    getUser: async (state, payload: string) => {
      const response = await Api.users.getUsers({ids: [payload]})

      if (!response) {
        return
      }

      await updateUsers(state, {
        [payload]: response[0]
      })
    },
    getContactsList: async (state) => {
      const users = await Api.contacts.getContacts()
      if (!users) {
        return
      }

      await updateUsers(state, buildRecord(users, 'id'))
    },
    /* Ui */
    openCreateContactModal: (state) => {
      updateModalState(state, {
        isByPhoneNumber: true,
        userId: undefined
      })
    },
    openAddContactModal: (state, payload: ApiInputUser) => {
      updateModalState(state, {
        isByPhoneNumber: true,
        userId: payload.userId
      })
    },
    closeContactModal: (state) => {
      updateModalState(state, {
        isByPhoneNumber: false,
        userId: undefined
      })
    }
  }
})
