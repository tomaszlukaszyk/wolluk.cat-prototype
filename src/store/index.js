import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist'
// import firebase from '@/firebase'

// import projects from './modules/projects'
import users from '@/store/modules/users'
import objects from '@/store/modules/objects'
import auth from '@/store/modules/auth'
// import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

// See https://alligator.io/vuejs/vuex-persist-state/ for reference
// const vuexLocalStorage = new VuexPersist({
//   key: 'vuex', // The key to store the state on in the storage provider.
//   storage: window.localStorage // or window.sessionStorage or localForage
//   // Function that passes the state and returns the state with only the objects you want to store.
//   // reducer: state => state,
//   // Function that passes a mutation and lets you decide if it should update the state in localStorage.
//   // filter: mutation => (true)
// })

export const store = new Vuex.Store({
  // plugins: [vuexLocalStorage.plugin],
  modules: {
    users,
    auth,
    objects
  },
  state: {
    appTitle: 'Wolluk.cat'
  },
  mutations: {
    // ...firebaseMutations // don't need it for now!
  },
  actions: {
  },
  getters: {
  }
})
