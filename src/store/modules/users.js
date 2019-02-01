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
    const user = { id: '_' + Math.random().toString(36).substr(2, 10) }
    commit('addUser', user)
    payload.id = user.id
    commit('updateUser', payload)
  },
  updateUser ({commit}, payload) {
    commit('updateUser', payload)
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
    if (payload.displayName) { user.displayName = payload.displayName }
    if (payload.password) { user.password = payload.password }
    if (payload.email) { user.email = payload.email }
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
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
