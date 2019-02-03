import md5 from 'crypto-js/md5'
import router from '@/router'

const state = {
  items: [],
  userToEdit: null,
  filter: {
    searchTerm: '',
    roles: {}
  },
  error: null,
  success: null,
  structure: {
    roles: {
      type: 'checkbox',
      label: 'User roles',
      options: {
        admin: 'Administrators',
        editor: 'Editors',
        translator: 'Translators',
        designer: 'Designers'
      }
    }
  }
}
const getters = {
  getAllUsers (state) {
    let filteredUsers = state.items
    if (state.filter.roles.admin) {
      filteredUsers = filteredUsers.filter(user => user.roles.isAdmin)
    }
    if (state.filter.roles.editor) {
      filteredUsers = filteredUsers.filter(user => user.roles.isEditor)
    }
    if (state.filter.roles.translator) {
      filteredUsers = filteredUsers.filter(user => user.roles.isTranslator)
    }
    if (state.filter.roles.designer) {
      filteredUsers = filteredUsers.filter(user => user.roles.isDesigner)
    }
    if (state.filter.searchTerm) {
      filteredUsers = filteredUsers.filter(item => item.displayName.toLowerCase().indexOf(state.filter.searchTerm) > -1 ||
      item.email.toLowerCase().indexOf(state.filter.searchTerm) > -1)
    }
    return filteredUsers
  },
  getUserByEmail: (state) => (email) => {
    return state.items.filter(item => item.email === email)[0]
  },
  isEmailUnique: (state, getters) => (email) => {
    return getters.getUserByEmail(email) === undefined
  },
  structure (state) {
    return state.structure
  },
  filter (state) {
    return state.filter
  }
}
const actions = {
  addUser ({commit, getters}, payload) {
    if (!getters.isEmailUnique(payload.email)) {
      commit('setError', 'Account with this email already exists')
      return
    }
    const user = { id: '_' + Math.random().toString(36).substr(2, 10) }
    commit('addUser', user)
    payload.id = user.id
    commit('updateUser', payload)
    if (payload.path) {
      router.push(payload.path)
    }
  },
  updateUser ({commit, state}, payload) {
    return new Promise(resolve => {
      if (state.items.find(user => user.email === payload.email && user.id !== payload.id)) {
        commit('setError', 'That email is already taken')
        return
      }
      commit('updateUser', payload)
      if (payload.path) {
        router.push(payload.path)
      }
      resolve()
    })
  },
  updatePassword ({commit, getters, rootState}, payload) {
    const email = rootState.auth.user.email
    const user = getters.getUserByEmail(email)
    if (user.password !== payload.oldPassword) {
      commit('setError', 'Old password is incorrect')
      return
    }
    commit('updateUser', {
      id: user.id,
      password: payload.newPassword
    })
    router.push('/account')
  }
}
const mutations = {
  addUser (state, payload) {
    state.items.push(payload)
  },
  deleteUser (state, id) {
    state.items = state.items.filter(user => user.id !== id)
  },
  updateUser (state, payload) {
    const user = state.items.find(user => user.id === payload.id)
    if (payload.displayName) { user.displayName = payload.displayName }
    if (payload.password) { user.password = payload.password }
    if (payload.email) {
      user.email = payload.email
      const hash = md5(payload.email.trim().toLowerCase())
      user.gravatar = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
    }
    if (payload.roles) {
      user.roles = payload.roles.isAdmin ? {isAdmin: true} : {
        isEditor: payload.roles.isEditor,
        isTranslator: payload.roles.isTranslator,
        isDesigner: payload.roles.isDesigner
      }
    }
  },
  setError (state, payload) {
    state.error = payload
  },
  setSuccess (state, payload) {
    state.success = payload
  },
  setUserToEdit (state, id) {
    if (id !== null && id !== undefined) {
      state.userToEdit = state.items.find(user => user.id === id)
    } else {
      state.userToEdit = null
    }
  },
  setSearchTerm (state, payload) {
    state.filter.searchTerm = payload
  },
  setSearchRoles (state, payload) {
    for (const [key, value] of Object.entries(payload)) {
      state.filter.roles[key] = value
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
