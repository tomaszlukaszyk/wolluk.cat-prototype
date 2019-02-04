<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1(v-if="user.id === ''") Add user
        h1(v-else) Edit user
      v-flex(xs12='', sm6='', offset-sm3='', mt-3='')
        form(@submit.prevent="saveUser")
          v-layout(column='')
            v-flex
              v-text-field#displayName(name='displayName', v-model='user.displayName', label='Display Name', type='text', required='')
            v-flex
              v-text-field#email(name='email', v-model='user.email', label='Email', type='email', required='')
            v-flex
              v-text-field#password(name='password', v-model='user.password', label='Password', type='text', required='')
            v-flex(mt-5='')
              v-checkbox(v-model='user.roles.isAdmin', label='Administrators')
            v-flex(v-show='!user.roles.isAdmin')
              v-checkbox(v-model='user.roles.isEditor', label='Editors')
              v-checkbox(v-model='user.roles.isTranslator', label='Translators')
              v-checkbox(v-model='user.roles.isDesigner', label='Designer')
            v-flex.text-xs-center(mt-5='')
              v-btn(@click='removeUserToEdit', :to="{name:'listUsers'}", right) Cancel
              v-btn(color='primary', type='submit') Add/Save
            v-flex
              v-alert(type='error', dismissible='', v-model='alert') {{ error }}
</template>


<script>
export default {
  data () {
    return {
      alert: false
    }
  },
  computed: {
    user () {
      const user = this.$store.state.users.userToEdit
      if (user === null) {
        return {
          id: '',
          displayName: '',
          email: '',
          password: '',
          roles: {
            isAdmin: false,
            isEditor: false,
            isTranslator: false,
            isDesigner: false
          }
        }
      } else {
        return {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          password: user.password,
          roles: {
            isAdmin: user.roles.isAdmin,
            isEditor: user.roles.isEditor,
            isTranslator: user.roles.isTranslator,
            isDesigner: user.roles.isDesigner
          }
        }
      }
    },
    error () {
      return this.$store.state.users.error
    }
  },
  methods: {
    removeUserToEdit () {
      this.$store.commit('users/setUserToEdit', null)
    },
    saveUser () {
      const userToSave = Object.assign({}, this.user, { path: '/users' })
      if (this.user.id === '') {
        this.$store.dispatch('users/addUser', userToSave)
      } else {
        this.$store.dispatch('users/updateUser', userToSave)
      }
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('users/setError', null)
      }
    }
  },
  created () {
      this.$store.commit('users/setError', null)
    }
}
</script>