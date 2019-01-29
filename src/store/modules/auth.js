import router from '@/router'

const state = {
  user: null,
  error: null,
  loading: false
}

const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  }
}

const getters = {
  isAuthenticated (state) {
    return state.user !== null && state.user !== undefined
  }
}
const actions = {
  userSignUp ({commit, dispatch, rootGetters}, payload) {
    if (!rootGetters['users/isEmailUnique'](payload.email)) {
      commit('setError', 'Account with this email already exists')
      return
    }
    dispatch('users/addUser', payload, {root: true})
    commit('setUser', { email: payload.email })
    router.push('/home')
    // commit('setUser', { email: payload.email })
    // rootState.// verify from /users/
    // router.push('/home')
    //
    // commit('setLoading', true)
    // rootState.// verify from /users/
    // firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    // .then(firebaseUser => {
    //   commit('setUser', {email: firebaseUser.user.email})
    //   commit('setLoading', false)
    //   router.push('/home')
    // })
    // .catch(error => {
    //   commit('setError', error.message)
    //   commit('setLoading', false)
    // })
  },
  userSignIn ({commit, rootGetters}, payload) {
    // commit('setLoading', true)
    const savedUser = rootGetters['users/getUserByEmail'](payload.email)
    if (savedUser === undefined) {
      commit('setError', 'Account with this email dosen\'t exist')
      return
    }
    if (savedUser.password !== payload.password) {
      commit('setError', 'Wrong password for this email')
      return
    }
    commit('setUser', { email: payload.email })
    router.push('/home')
    // firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    // .then(firebaseUser => {
    //   commit('setUser', {email: firebaseUser.user.email})
    //   commit('setLoading', false)
    //   commit('setError', null)
    //   router.push('/home')
    // })
    // .catch(error => {
    //   commit('setError', error.message)
    //   commit('setLoading', false)
    // })
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', { email: payload.email })
  },
  userSignOut ({commit}) {
    // firebase.auth().signOut()
    commit('setUser', null)
    router.push('/')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
