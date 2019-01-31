<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Edit account details
      v-flex(xs12='', sm6='', offset-sm3='', mt-3='')
        form(@submit.prevent="updateUser")
          v-layout(column='')
            v-flex
              v-text-field#email(name='email', v-model='user.email', label='Email', type='email', required='')
            v-flex
              v-text-field#displayName(name='displayName', v-model='user.displayName', label='Display Name', type='text', required='')
            v-flex(mt-5='')
              v-checkbox(v-model='user.roles.isAdmin', label='Administrators', height='10')
            v-flex(v-show='!user.roles.isAdmin')
              v-checkbox(v-model='user.roles.isEditor', label='Editors', height='10')
              v-checkbox(v-model='user.roles.isTranslator', label='Translators', height='10')
              v-checkbox(v-model='user.roles.isDesigner', label='Designer', height='10')
            v-flex(mt-5='')
              v-btn(flat, to='/password', color='red', small, right) Reset password
            v-flex(mt-5='')
              v-btn(@click='setUserFromState', right) Cancel
              v-btn(color='primary', type='submit') Save
</template>

<script>
export default {
  data () {
    return {
      user: null,
      alert: false
    }
  },
  methods: {
    updateUser () {
      this.$store.commit('auth/setUser', { email: this.user.email })
      this.$store.dispatch('users/updateUser', this.user)
    },
    setUserFromState () {
      const email = this.$store.state.auth.user.email
      this.user = JSON.parse(JSON.stringify(this.$store.getters['users/getUserByEmail'](email)))
    }
  },
  created () {
    this.setUserFromState()
  }
}
</script>

