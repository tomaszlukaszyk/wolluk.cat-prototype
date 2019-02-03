<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 System users
        v-layout(row, wrap, justify-center)
          v-flex(v-for='item in items', :key='item.password', xs12, sm8, md6, lg3, pa-3)
            v-card
              v-card-text
                v-layout(row)
                  v-flex.text-xs-left(xs8)
                    div.headline {{ item.displayName }}
                    v-flex(mt-1)
                    div.grey--text {{ item.email }}
                    div.grey--text {{ getStringForRoles(item.roles) }}
                  v-flex(xs4, ma-1)
                    img(:src='item.gravatar', height='80px')
              v-card-actions
                v-btn(:disabled='item.email === currentUser.email', flat, color='primary', small, @click='openDeleteDialog(item.id)') Delete
                v-btn(:disabled='item.email === currentUser.email', flat, color='primary', small, @click='editUser(item.id)', :to="{name:'editUser'}") Edit
    v-btn(fab bottom right color="pink" dark fixed :to="{name:'editUser'}")
      v-icon add
    v-layout(row, justify-center)
    v-dialog(v-model='dialog', persistent, max-width='300')
      v-card
        v-card-title.headline
          | Are you sure you want to delete this user?
        v-card-actions
          v-spacer
          v-btn(flat, small, color='primary', @click='deleteUser') Delete
          v-btn(flat, small, color='primary', @click='closeDeleteDialog') Cancel
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      userToDeleteId: ''
    }
  },
  computed: {
    ...mapGetters({
      filter: 'users/structure',
      items: 'users/getAllUsers'
    }),
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    getStringForRoles (roles) {
      let string = ''
      if (roles.isAdmin) {
        string += 'ADMIN, '
      }
      if (roles.isEditor) {
        string += 'EDITOR, '
      }
      if (roles.isTranslator) {
        string += 'TRANSALATOR, '
      }
      if (roles.isDesigner) {
        string += 'DESIGNER, '
      }
      return string.substr(0, string.length - 2)
    },
    editUser (id) {
      this.$store.commit('users/setUserToEdit', id)
    },
    openDeleteDialog (id) {
      this.dialog = true
      this.userToDeleteId = id
    },
    closeDeleteDialog () {
      this.dialog = false
      this.userToDeleteId = ''
    },
    deleteUser () {
      this.$store.commit('users/deleteUser', this.userToDeleteId)
      this.closeDeleteDialog()
    }
  }
}
</script>