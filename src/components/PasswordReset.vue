<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Reset password
      v-flex(xs12='', sm6='', offset-sm3='', mt-3='')
        form(@submit.prevent="updatePassword")
          v-layout(column='')
            v-flex
              v-text-field#oldPassword(name='oldPassword', v-model='oldPassword', label='Old Password', type='password', required='')
            v-flex
              v-text-field#newPassword(name='newPassword', v-model='newPassword', label='New Password', type='password', required='')
            v-flex
              v-text-field#confirmNewPassword(name='confirmNewPassword', v-model='newPasswordConfirm', label='Confirm New Password', type='password', required='', :rules='[comparePasswords]')
            v-flex(mt-5='')
              v-btn(color='primary', type='submit') Save
            v-flex
              v-alert(type='error', dismissible='', v-model='alert') {{ error }}
</template>

<script>
export default {
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      alert: false
    }
  },
  computed: {
    comparePasswords () {
      return this.newPassword === this.newPasswordConfirm ? true : 'Passwords don\'t match'
    },
    error () {
      return this.$store.state.users.error
    }
  },
  methods: {
    updatePassword () {
      if (this.comparePasswords !== true) {
        return
      }
      this.$store.dispatch('users/updatePassword', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      })
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

