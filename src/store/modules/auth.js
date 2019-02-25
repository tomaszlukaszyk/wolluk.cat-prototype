import router from '@/router'
import firebase from 'firebase'
import md5 from 'crypto-js/md5'

const state = {
  user: null,
  error: null,
  success: null,
  loading: false
}

const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setSuccess (state, payload) {
    state.success = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  }
}

const getters = {
  isAuthenticated (state) {
    return state.user !== null && state.user !== undefined
  },
  isAdmin (state, getters, rootState, rootGetters) {
    if (state.user == null) {
      return false
    }
    const user = rootGetters['users/getUserByEmail'](state.user.email)
    if (!user) {
      return false
    }
    return user.roles.isAdmin === true
  },
  getGravatar (state, getters, rootState, rootGetters) {
    if (state.user == null) {
      return false
    }
    const user = rootGetters['users/getUserByEmail'](state.user.email)
    if (!user) {
      return false
    }
    return user.gravatar
  },
  getCurrentUser () {
    return firebase.auth().currentUser
  }
}
const actions = {
  userSignUp ({commit, dispatch, rootGetters}, payload) {
    // if (!rootGetters['users/isEmailUnique'](payload.email)) {
    //   commit('setError', 'Account with this email already exists')
    //   return
    // }
    // dispatch('users/addUser', payload, {root: true})
    // commit('setUser', { email: payload.email })
    // router.push('/home')
    // commit('setUser', { email: payload.email })
    // rootState.// verify from /users/
    // router.push('/home')
    //
    commit('setLoading', true)
    // rootState.// verify from /users/
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      commit('setUser', {email: firebaseUser.user.email})
      return dispatch('updatePhotoUrl', firebaseUser.user)
    })
    .then(() => {
      commit('setLoading', false)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  reauthenticate ({commit, dispatch}, payload) {
    payload.user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(payload.user.email, payload.password))
    .then(() => {
      dispatch('updateUser', payload)
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  updateUser ({commit, dispatch}, payload) {
    commit('setLoading', true)
    console.log('payload in updateuser: ')
    console.log(payload)
    const promises = []
    if (payload.user.email !== payload.email) {
      console.log('inside if for email')
      promises.push(dispatch('updateEmail', payload))
    }
    if (payload.user.displayName !== payload.displayName) {
      console.log('inside if for display name')
      promises.push(dispatch('updateDisplayName', payload))
    }
    Promise.all(promises)
    .then(() => {
      commit('setSuccess', 'Profile updated succesfully')
      commit('setLoading', false)
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  updateEmail ({commit, dispatch}, payload) {
    console.log('updating email to: ' + payload.email)
    return payload.user.updateEmail(payload.email)
    .then(() => {
      return dispatch('updatePhotoUrl', payload.user)
    })
  },
  updatePhotoUrl ({commit}, user) {
    const hash = md5(user.email.trim().toLowerCase())
    const gravatar = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
    return user.updateProfile({ photoURL: gravatar })
  },
  updateDisplayName ({commit}, payload) {
    console.log('updating display name to: ' + payload.displayName)
    return payload.user.updateProfile({ displayName: payload.displayName })
  },
  userSignIn ({commit, rootGetters}, payload) {
    commit('setLoading', true)
    // const savedUser = rootGetters['users/getUserByEmail'](payload.email)
    // if (savedUser === undefined) {
    //   commit('setError', 'Account with this email dosen\'t exist')
    //   return
    // }
    // if (savedUser.password !== payload.password) {
    //   commit('setError', 'Wrong password for this email')
    //   return
    // }
    // commit('setUser', { email: payload.email })
    // router.push('/home')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      commit('setUser', {email: firebaseUser.user.email})
      commit('setLoading', false)
      commit('setError', null)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', { email: payload.email })
  },
  userSignOut ({commit}) {
    firebase.auth().signOut()
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
