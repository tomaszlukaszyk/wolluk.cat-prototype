<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Edit account details
      v-flex.text-xs-center(xs12, sm5, mt-3, pr-5)
        img(:src='photoURL', style='border-radius: 50%; width:200px')
      v-flex(xs12, sm5, mt-3)
        form(@submit.prevent="submitForm")
          v-layout(column='')
            v-flex
              v-text-field#email(name='email', v-model='email', label='Email', type='email', required='')
            v-flex
              v-text-field#displayName(name='displayName', v-model='displayName', label='Display Name', type='text', required='')
            v-flex(mt-5='')
              v-checkbox(v-model='isAdmin', label='Administrators', height='10', :rules='[roleChosen]')
            v-flex(v-show='!isAdmin')
              v-checkbox(v-model='isEditor', label='Editors', height='10', :rules='[roleChosen]')
              v-checkbox(v-model='isTranslator', label='Translators', height='10', :rules='[roleChosen]')
              v-checkbox(v-model='isDesigner', label='Designer', height='10', :rules='[roleChosen]')
            v-flex(mt-5='')
              v-btn(flat, to='/password', color='red', small, right) Reset password
            v-flex(mt-5='')
              v-btn(@click='', right) Cancel
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
      alert: false,
      successAlert: false
    }
  },
  computed: {
    error () {
      return this.$store.state.auth.error
    },
    success () {
      return this.$store.state.auth.success
    },
    displayName: {
      get () {
        return this.$store.state.auth.user.displayName
      },
      set (value) {
        this.$store.commit('auth/setDisplayName', value)
      }
    },
    email: {
      get () {
        return this.$store.state.auth.user.email
      },
      set (value) {
        this.$store.commit('auth/setEmail', value)
      }
    },
    photoURL () {
      return this.$store.state.auth.user.photoURL
    },
    isAdmin: {
      get () {
        return this.$store.state.auth.roles.isAdmin
      },
      set (value) {
        this.$store.commit('auth/setAdminRole', value)
      }
    },
    isEditor: {
      get () {
        return this.$store.state.auth.roles.isEditor
      },
      set (value) {
        this.$store.commit('auth/setEditorRole', value)
      }
    },
    isTranslator: {
      get () {
        return this.$store.state.auth.roles.isTranslator
      },
      set (value) {
        this.$store.commit('auth/setTranslatorRole', value)
      }
    },
    isDesigner: {
      get () {
        return this.$store.state.auth.roles.isDesigner
      },
      set (value) {
        this.$store.commit('auth/setDesignerRole', value)
      }
    },
    dialog () {
      return this.$store.state.auth.dialog
    },
    roleChosen () {
      // for (let key of Object.keys(this.roles)) {
      //   if (this.roles[key]) {
      //     return true
      //   }
      // }
      // return 'You must choose at least one role'
      return true
    }
  },
  methods: {
    submitForm () {
      this.$store.dispatch('auth/submitForm')
    },
    reauthenticate () {
      this.$store.dispatch('auth/reauthenticate', this.password)
      this.$store.commit('auth/setDialog', false)
      this.password = ''
    },
    closeDialog () {
      this.$store.commit('auth/setDialog', false)
      this.password = ''
    }
  },
  created () {
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

