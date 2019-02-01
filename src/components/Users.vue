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
                    div {{ item.email }}
                  v-flex(xs4, ma-1)
                    img(:src='item.gravatar', height='80px')
              v-card-actions
                v-btn(flat, color='primary', small) Delete
                v-btn(flat, color='primary', small) Edit
    v-btn(fab bottom right color="pink" dark fixed :to="{name:'createObject'}")
      v-icon add
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      filter: 'users/structure',
      items: 'users/getAllUsers'
    })
  }
}
</script>