<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Edit account details
      v-flex.text-xs-center(xs12, sm5, mt-3, pr-5)
        img(:src='gravatar', style='border-radius: 50%; width:200px')
      v-flex(xs12, sm5, mt-3)
        form(@submit.prevent="submitForm")
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
    v-dialog(v-model='dialog', persistent, max-width='300')
      v-card
        v-card-title.headline
          | Please re-enter your password
        v-card-text
          v-text-field#password(name='password', v-model='password', label='Password', type='password', required='')
        v-card-actions
          v-spacer
          v-btn(flat, small, color='primary', @click='reauthenticate') Submit
          v-btn(flat, small, color='primary', @click='closeDialog') Cancel
</template>

<script>
export default {
  data () {
    return {
      password: '',
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
      successAlert: false,
      dialog: false
    }
  },
  computed: {
    error () {
      return this.$store.state.auth.error
    },
    success () {
      return this.$store.state.auth.success
    },
    user () {
      return this.$store.getters['auth/getCurrentUser']
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
    submitForm () {
      if (this.roleChosen !== true) {
        return
      }
      if (this.email !== this.user.email) {
        this.dialog = true
      } else {
        this.updateUser()
      }
    },
    reauthenticate () {
      this.dialog = false
      this.$store.dispatch('auth/reauthenticate', {
        displayName: this.displayName,
        email: this.email,
        password: this.password,
        user: this.user
      })
    },
    updateUser () {
      this.$store.dispatch('auth/updateUser', {
        displayName: this.displayName,
        email: this.email,
        user: this.user
      })
    },
    setUserFromState () {
      this.displayName = this.user.displayName
      this.email = this.user.email
      this.gravatar = this.user.photoURL
    },
    closeDialog () {
      this.dialog = false
    }
  },
  created () {
    this.setUserFromState()
    this.$store.commit('auth/setError', null)
    this.$store.commit('auth/setSuccess', null)
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('auth/setError', null)
      }
    },
    success (value) {
      if (value) {
        this.successAlert = true
      }
    },
    successAlert (value) {
      if (!value) {
        this.$store.commit('auth/setSuccess', null)
      }
    }
  }
}
</script>

