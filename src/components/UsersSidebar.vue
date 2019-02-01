<template lang="pug">
  v-list(:expand="false") 

    v-list-tile
      v-list-tile-content
        v-text-field(label="Search")

    v-list-group(:value="true" v-for="(filter, filterName) in filters" :key="filterName" )
      v-list-tile(slot="activator")
        v-list-tile-content {{filter.label}}
      
      v-list-tile(v-for="(option, optionName) in filter.options" v-if="filter.options" :key="optionName" )
        v-list-tile-action
          v-checkbox(hide-details v-model="filterSet[optionName]")
        v-list-tile-content
          v-list-tile-title {{option.label || option}}

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      filterSet: {}
    }
  },
  computed: {
    ...mapGetters({
      filters: 'users/structure'
    })
  }
}
</script>