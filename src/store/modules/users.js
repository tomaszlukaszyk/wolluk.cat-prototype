const state = {
  items: []
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
    commit('addUser', payload)
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
