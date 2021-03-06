<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Edit account details
      v-flex.text-xs-center(xs12, sm5, mt-3, pr-5)
        img(:src='gravatar', style='border-radius: 50%; width:200px')
      v-flex(xs12, sm5, mt-3)
        form(@submit.prevent="updateUser")
          v-layout(column='')
            v-flex
              v-text-field#email(name='email', v-model='email', label='Email', type='email', required='')
            v-flex
              v-text-field#displayName(name='displayName', v-model='displayName', label='Display Name', type='text', required='')
            v-flex(mt-5='')
              v-checkbox(v-model='roles.isAdmin', label='Administrators', height='10', :rules='[roleChosen]')
            v-flex(v-show='!roles.isAdmin')
              v-checkbox(v-model='roles.isEditor', label='Editors', height='10', :rules='[roleChosen]')
              v-checkbox(v-model='roles.isTranslator', label='Translators', height='10', :rules='[roleChosen]')
              v-checkbox(v-model='roles.isDesigner', label='Designer', height='10', :rules='[roleChosen]')
            v-flex(mt-5='')
              v-btn(flat, to='/password', color='red', small, right) Reset password
            v-flex(mt-5='')
              v-btn(@click='setUserFromState', right) Cancel
              v-btn(color='primary', type='submit') Save
            v-flex
              v-alert(type='error', dismissible='', v-model='alert') {{ error }}
            v-flex
              v-alert(type='success', dismissible, v-model='successAlert') {{ success }}
</template>

<script>
export default {
  data () {
    return {
      id: '',
      displayName: '',
      email: '',
      gravatar: '',
      roles: {
        isAdmin: false,
        isEditor: false,
        isTranslator: false,
        isDesigner: false
      },
      alert: false,
      successAlert: false
    }
  },
  computed: {
    error () {
      return this.$store.state.users.error
    },
    success () {
      return this.$store.state.users.success
    },
    roleChosen () {
      for (let key of Object.keys(this.roles)) {
        if (this.roles[key]) {
          return true
        }
      }
      return 'You must choose at least one role'
    }
  },
  methods: {
    updateUser () {
      if (this.roleChosen !== true) {
        return
      }
      this.$store.dispatch('users/updateUser', {
        id: this.id,
        displayName: this.displayName,
        email: this.email,
        roles: this.roles
      }).then(() => {
        this.$store.commit('auth/setUser', { email: this.email })
        this.$store.commit('users/setSuccess', 'Account information updated successfully')
      })
    },
    setUserFromState () {
      const email = this.$store.state.auth.user.email
      const user = this.$store.getters['users/getUserByEmail'](email)
      this.id = user.id
      this.displayName = user.displayName
      this.email = user.email
      this.gravatar = user.gravatar
      this.roles.isAdmin = user.roles.isAdmin
      this.roles.isEditor = user.roles.isEditor
      this.roles.isTranslator = user.roles.isTranslator
      this.roles.isDesigner = user.roles.isDesigner
    }
  },
  created () {
    this.setUserFromState()
    this.$store.commit('users/setError', null)
    this.$store.commit('users/setSuccess', null)
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
    },
    success (value) {
      if (value) {
        this.successAlert = true
      }
    },
    successAlert (value) {
      if (!value) {
        this.$store.commit('users/setSuccess', null)
      }
    }
  }
}
</script>

