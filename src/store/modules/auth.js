import router from '@/router'
import firebase from 'firebase'
import md5 from 'crypto-js/md5'

const state = {
  user: null,
  roles: null,
  error: null,
  success: null,
  loading: false,
  dialog: false
}

const mutations = {
  setUser (state, payload) {
    if (payload == null) {
      state.user = null
      return
    }
    state.user = {
      displayName: payload.displayName,
      email: payload.email,
      photoURL: payload.photoURL
    }
  },
  setRoles (state, payload) {
    if (payload == null) {
      state.roles = null
      return
    }
    state.roles = {
      isAdmin: payload.isAdmin,
      isEditor: payload.isEditor,
      isTranslator: payload.isTranslator,
      isDesigner: payload.isDesigner
    }
  },
  setDisplayName (state, payload) {
    state.user.displayName = payload
  },
  setEmail (state, payload) {
    state.user.email = payload
  },
  setPhotoUrl (state, payload) {
    state.user.photoURL = payload
  },
  setAdminRole (state, payload) {
    state.roles.isAdmin = payload
  },
  setEditorRole (state, payload) {
    state.roles.isEditor = payload
  },
  setTranslatorRole (state, payload) {
    state.roles.isTranslator = payload
  },
  setDesignerRole (state, payload) {
    state.roles.isDesigner = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setSuccess (state, payload) {
    state.success = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setDialog (state, payload) {
    state.dialog = payload
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
  }
}
const actions = {
  userSignUp ({commit, dispatch}, payload) {
    commit('setLoading', true)
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      commit('setUser', firebaseUser.user)
      commit('setLoading', false)
      router.push('/home')
      dispatch('updatePhotoUrl', firebaseUser.user)
      dispatch('updateRoles', {
        uid: firebaseUser.user.uid,
        roles: {
          isAdmin: false,
          isEditor: false,
          isTranslator: false,
          isDesigner: false
        }
      })
      commit('setRoles', {
        isAdmin: false,
        isEditor: false,
        isTranslator: false,
        isDesigner: false
      })
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  userSignIn ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      firebase.auth().currentUser.getIdTokenResult()
      .then((idToken) => {
        commit('setUser', firebaseUser.user)
        commit('setRoles', idToken.claims.roles)
        commit('setLoading', false)
        commit('setError', null)
        router.push('/home')
      })
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  autoSignIn ({commit}, payload) {
    firebase.auth().currentUser.getIdTokenResult()
    .then((idToken) => {
      commit('setUser', payload)
      commit('setRoles', idToken.claims.roles)
    })
    .catch(() => {
      router.push('/')
    })
  },
  userSignOut ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
    commit('setRoles', null)
    router.push('/')
  },
  submitForm ({commit, dispatch, state}) {
    const currentUser = firebase.auth().currentUser
    if (currentUser.email !== state.user.email) {
      commit('setDialog', true)
    } else {
      dispatch('updateUser', currentUser)
    }
  },
  reauthenticate ({commit, dispatch}, password) {
    const currentUser = firebase.auth().currentUser
    currentUser.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(currentUser.email, password))
    .then(() => {
      dispatch('updateUser', currentUser)
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  updateUser ({commit, dispatch, state}, currentUser) {
    commit('setLoading', true)
    const promises = []
    if (currentUser.email !== state.user.email) {
      promises.push(dispatch('updateEmail', currentUser))
    }
    if (currentUser.displayName !== state.user.displayName) {
      promises.push(dispatch('updateDisplayName', currentUser))
    }
    const addRoles = firebase.functions().httpsCallable('addRoles')
    promises.push(addRoles({
      uid: currentUser.uid,
      roles: state.roles
    }))
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
  updateEmail ({dispatch, state}, currentUser) {
    return currentUser.updateEmail(state.user.email)
    .then(() => {
      return dispatch('updatePhotoUrl', currentUser)
    })
  },
  updatePhotoUrl ({commit, state}, currentUser) {
    const hash = md5(state.user.email.trim().toLowerCase())
    const gravatar = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
    commit('setPhotoUrl', gravatar)
    return currentUser.updateProfile({ photoURL: gravatar })
  },
  updateDisplayName ({state}, currentUser) {
    return currentUser.updateProfile({ displayName: state.user.displayName })
  },
  updateRoles ({commit}, payload) {
    const addRoles = firebase.functions().httpsCallable('addRoles')
    return addRoles({
      uid: payload.uid,
      roles: payload.roles
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
