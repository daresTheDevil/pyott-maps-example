<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
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
            color="primary"
            type="text"
            clearable
            placeholder="Being searching here..."
            hide-details
            :clear-icon-cb="clearSearch"
            @input="onChange"
          />
        </v-toolbar>

        <v-fade-transition v-model="selected" group tag="v-list">
          <v-list-tile v-for="item in entities" :key="item.entityDisplayName">
            <v-list-tile-avatar color="teal lighten-4">{{
              item.entityGrade
            }}</v-list-tile-avatar>
            <v-list-tile-title v-text="item.entityDisplayName" />
          </v-list-tile>
        </v-fade-transition>
      </v-card>
    </v-dialog>
    <v-sheet tile color="primary">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md6>
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
      dialog: false
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style>
.mapOver {
  z-index: 999;
}
</style>
