<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.mdAndDown"
      max-width="500"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar light>
          <v-btn icon light @click="dialog = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-text-field
            v-model="search"
            solo-inverted
            flat
            autofocus
            type="text"
            clearable
            placeholder="Being searching here..."
            hide-details
            :clear-icon-cb="clearSearch"
            @input="onChange"
          />
        </v-toolbar>

        <v-fade-transition v-model="selected" group tag="v-list">
          <v-list-tile v-for="(item, i) in results" :key="i">
            <v-list-tile-avatar color="teal lighten-4">{{
              item.entityGrade
            }}</v-list-tile-avatar>
            <v-list-tile-content>
              <h1 class="subheading" v-text="item.entityDisplayName" />
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn flat icon><v-icon>mdi-arrow-right</v-icon></v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider />
        </v-fade-transition>
      </v-card>
    </v-dialog>
    <v-sheet tile color="primary">
      <v-container grid-list-md>
        <v-layout row wrap justify-center>
          <v-flex shrink>
            <h1 class="display-1 text-xs-center font-weight-bold white--text">
              Mississippi Succeeds Report Card
            </h1>
            <br />
            <v-text-field
              solo-inverted
              dark
              flat
              label="Search for school and district data"
              @click="dialog = true"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-sheet>
  </v-app>
</template>

<script>
// import districts2017 from '@/assets/data/mde-districts-2017.json'
// import districts2018 from '@/assets/data/mde-districts-2018.json'
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import entities from '@/assets/data/entities.json'

export default {
  components: {},
  data() {
    return {
      entities,
      showToolbar: true,
      dialog: false,
      results: [],
      search: '',
      selected: []
    }
  },
  computed: {},
  mounted() {},
  methods: {
    onChange() {
      this.filterResults()
    },
    filterResults() {
      this.results = this.entities.filter(
        item =>
          item.entityDisplayName
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) > -1 ||
          item.entityCity.toLowerCase().indexOf(this.search.toLowerCase()) >
            -1 ||
          item.entityId.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      )
    }
  }
}
</script>

<style>
.mapOver {
  z-index: 999;
}
</style>
