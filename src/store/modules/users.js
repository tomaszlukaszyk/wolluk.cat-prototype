const state = {
  items: [],
  error: null
}
const getters = {
  getUserByEmail: (state) => (email) => {
    return state.items.filter(item => item.email === email)[0]
  },
  isEmailUnique: (state, getters) => (email) => {
    return getters.getUserByEmail(email) === undefined
  }
}
const actions = {
  addUser ({commit}, payload) {
    const user = {
      id: '_' + Math.random().toString(36).substr(2, 10),
      displayName: payload.displayName,
      email: payload.email,
      password: payload.password,
      roles: payload.roles.isAdmin ? {isAdmin: true} : {
        isEditor: payload.roles.isEditor,
        isTranslator: payload.roles.isTranslator,
        isDesigner: payload.roles.isDesigner
      }
    }
    commit('addUser', user)
  },
  updateUser ({commit}, payload) {
    commit('updateUser', payload)
  }
}
const mutations = {
  addUser (state, payload) {
    state.items.push(payload)
  },
  deleteUser (state, payload) {
    state.items = state.items.filter(user => user.id !== payload.id)
  },
  updateUser (state, payload) {
    const user = state.items.find(user => user.id === payload.id)
    user.displayName = payload.displayName
    user.email = payload.email
    user.roles = payload.roles.isAdmin ? {isAdmin: true} : {
      isEditor: payload.roles.isEditor,
      isTranslator: payload.roles.isTranslator,
      isDesigner: payload.roles.isDesigner
    }
  },
  setError (state, payload) {
    state.error = payload
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
