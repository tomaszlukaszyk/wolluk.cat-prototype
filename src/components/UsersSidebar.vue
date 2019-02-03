<template lang="pug">
  v-list(:expand="false") 

    v-list-tile
      v-list-tile-content
        v-text-field(label="Search", v-model='filter.searchTerm', @input='updateSearchTerm')

    v-list-group(:value="true" v-for="(structure, structureName) in structure" :key="structureName" )
      v-list-tile(slot="activator")
        v-list-tile-content {{filter.label}}
      
      v-list-tile(v-for="(option, optionName) in structure.options" v-if="structure.options" :key="optionName" )
        v-list-tile-action
          v-checkbox(hide-details v-model="filter.roles[optionName]" @change='updateFilterSet')
        v-list-tile-content
          v-list-tile-title {{option.label || option}}

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      structure: 'users/structure',
      filter: 'users/filter'
    })
  },
  methods: {
    updateSearchTerm () {
      this.$store.commit('users/setSearchTerm', this.filter.searchTerm.trim().toLowerCase())
    },
    updateFilterSet () {
      this.$store.commit('users/setSearchRoles', this.filter.roles)
    }
  }
}
</script>