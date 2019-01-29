const state = {
  items: []
}
const getters = {
  getUserByEmail: (state) => (email) => {
    return state.items.filter(item => item.email === email)[0]
  },
  isEmailUnique: (state, getters) => (email) => {
    return getters.getUserByEmail(email) === undefined
  },
  roles (state) {
    return state.roles
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
  }
}
const mutations = {
  addUser (state, payload) {
    state.items.push(payload)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
