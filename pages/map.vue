<template>
  <v-app>
    <v-bottom-sheet
      v-if="$vuetify.breakpoint.mdAndDown"
      v-model="sheet"
      persistent
      hide-overlay
      style="z-index: 1999;"
    >
      <v-card tile color="primary" dark>
        <v-card-title>
          <h1 class="subheading">{{ selectedDistrict.NAME }}</h1>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn flat>See report card<v-icon>mdi-chevron-right</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
    <v-sheet v-show="showToolbar" tile color="primary darken-1 white--text">
      <v-container fluid class="pb-3 pt-2" grid-list-md>
        <v-layout column>
          <v-flex class="mx-auto">
            <v-layout row align-center>
              <v-btn icon color="primary lighten-1" dark @click="yearSelected--"
                ><v-icon large>mdi-arrow-left</v-icon></v-btn
              >
              <h1 class="headline">{{ yearSelected }}</h1>
              <v-btn color="primary lighten-1" dark icon @click="yearSelected++"
                ><v-icon large>mdi-arrow-right</v-icon></v-btn
              >
            </v-layout>
          </v-flex>
          <v-flex class="mx-auto">
            <v-select
              v-model="dataSetSelected"
              dark
              solo-inverted
              flat
              hide-details
              :items="dataSets"
              append-outer-icon="mdi-reload"
              @click:append-outer="resetMap"
              @change="handleSelectionChange"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-sheet>
    <div style="height: 100%">
      <l-map
        ref="map"
        :zoom.sync="zoom"
        :center.sync="center"
        style="z-index: 0;"
        @update:zoom="handleZoom"
      >
        <l-tile-layer :url="lightTiles"></l-tile-layer>
        <l-geo-json
          ref="geojson"
          :geojson="districts"
          :options="options"
          :options-style="styleFunction"
        />

        <l-marker-cluster
          v-if="markers && zoom > 9"
          ref="schools"
          chunked-loading
        >
          <l-marker
            v-for="(school, s) in markers"
            :key="s"
            :lat-lng="[school.geometry.y, school.geometry.x]"
          >
            <l-icon :icon-anchor="staticAnchor">
              <v-btn fab color="white">
                <v-icon size="64" color="deep-purple"
                  >mdi-alpha-a-circle</v-icon
                >
              </v-btn>
            </l-icon>
            <l-popup width="400">
              <v-card flat color="transparent">
                <v-card-title v-text="school.attributes.NAME" />
                <v-divider />
                <v-card-text>
                  <h1 class="body-1">{{ school.attributes.LSTREE }}</h1>
                  <h1 class="body-1 text-capitalize">
                    {{ school.attributes.LCITY }}, MS
                    {{ school.attributes.LZIP }}
                  </h1>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn flat color="primary"
                    >See report card<v-icon>mdi-chevron-right</v-icon></v-btn
                  >
                </v-card-actions>
              </v-card>
            </l-popup>
          </l-marker>
        </l-marker-cluster>

        <v-container
          v-if="$vuetify.breakpoint.mdAndUp && zoom > 9"
          grid-list-md
          justify-end
          fluid
        >
          <v-layout row justify-center>
            <v-flex xs12 sm3>
              <v-slide-y-transition>
                <v-card
                  v-if="lastClickLayer"
                  dark
                  color="primary"
                  class="mapOver"
                >
                  <v-card-title>
                    <h1 class="headline">{{ selectedDistrict.NAME }}</h1>
                  </v-card-title>
                  <v-card-actions class="justify-space-between">
                    <span>{{ zoom }}</span>
                    <span>{{ center }}</span>
                  </v-card-actions>
                </v-card>
              </v-slide-y-transition>
            </v-flex>
          </v-layout>
        </v-container>
        <l-marker :lat-lng="[32.302181, -90.1847]"></l-marker>
      </l-map>
    </div>
  </v-app>
</template>

<script>
// import { mapGetters } from 'vuex'
import 'leaflet/dist/leaflet.css'
// import axios from 'axios'
import districts from '@/assets/data/mde-districts-1516.json'
import { features as schools } from '@/assets/data/mde-schools-1516.json'
// import districts2017 from '@/assets/data/mde-districts-2017.json'
// import districts2018 from '@/assets/data/mde-districts-2018.json'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  components: {
    'l-marker-cluster': Vue2LeafletMarkerCluster
  },
  data() {
    return {
      years: [2017, 2018],
      // districts2017,
      // districts2018,
      districts,
      schools,
      standardTiles: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      lightTiles:
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      color: 'green',
      selected: null,
      removeClusters: true,
      markers: [],
      showToolbar: true,
      sheet: false,
      selectedDistrict: {},
      lastClickLayer: '',
      yearSelected: 2017,
      dataSetSelected: 'grade',
      dataSets: [
        {
          text: 'Accountability Grade',
          value: 'grade'
        },
        { text: 'Math Proficiency', value: 'MP' }
      ],
      center: [32.29642, -89.736328],
      originalCenter: [32.29642, -89.736328],
      zoom: 7,
      drawer: false
    }
  },
  // async fetch({ store, params, route }) {
  //   await store.dispatch('msrc/callGeoData')
  // },
  computed: {
    // ...mapGetters({ geo: 'msrc/getGeoData' }),
    features() {
      if (this.yearSelected === 2017) return this.districts2017
      if (this.yearSelected === 2018) return this.districts2018
      return this.districts2017
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      }
    },
    onEachFeatureFunction() {
      return (feature, layer, target) => {
        layer.on('click', () => {
          if (this.lastClickLayer) {
            this.$refs.geojson.mapObject
              .getLayer(this.lastClickLayer)
              .setStyle(this.styleFunction(feature))
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.selectedDistrict = feature.properties
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.sheet = true
            this.getMarkers(layer)
          }
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.lastClickLayer = layer._leaflet_id
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedDistrict = feature.properties
          this.map.fitBounds(layer.getBounds())
          this.getMarkers(layer)
          this.$refs.geojson.mapObject.setStyle(this.styleShadow)
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          layer.setStyle({ fillColor: 'white', fillOpacity: 0 })
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.sheet = true
        })
        layer.on('mouseover', () => {})
        layer.on('mouseout', () => {})
      }
    },
    styleShadow() {
      return {
        color: '#263238',
        opacity: 0.7,
        weight: 1,
        fillColor: '#263238',
        fillOpacity: 0.7
      }
    },
    styleFunction() {
      return feature => {
        // let fillColor
        // const fid = feature.properties.FID_12
        // if (this.yearSelected === 2017) {
        //   if (this.dataSetSelected === 'grade') {
        //     if (fid <= 25) fillColor = '#f7feae'
        //     else if (fid <= 50) fillColor = '#7ccba2'
        //     else if (fid <= 75) fillColor = '#46aea0'
        //     else if (fid <= 100) fillColor = '#00718b'
        //     else fillColor = '#045275'
        //   } else if (this.dataSetSelected === 'MP') {
        //     if (fid <= 25) fillColor = '#46aea0'
        //     else if (fid <= 50) fillColor = '#00718b'
        //     else if (fid <= 75) fillColor = '#f7feae'
        //     else if (fid <= 100) fillColor = '#045275'
        //     else fillColor = '#7ccba2'
        //   }
        // } else if (this.yearSelected === 2018) {
        //   if (this.dataSetSelected === 'grade') {
        //     if (fid <= 25) fillColor = '#f3e79b'
        //     else if (fid <= 50) fillColor = '#eb7f86'
        //     else if (fid <= 75) fillColor = '#46aea0'
        //     else if (fid <= 100) fillColor = '#00718b'
        //     else fillColor = '#5c53a5'
        //   } else if (this.dataSetSelected === 'MP') {
        //     if (fid <= 25) fillColor = '#5c53a5'
        //     else if (fid <= 50) fillColor = '#00718b'
        //     else if (fid <= 75) fillColor = '#46aea0'
        //     else if (fid <= 100) fillColor = '#eb7f86'
        //     else fillColor = '#f3e79b'
        //   }
        // }
        return {
          color: '#999',
          weight: 2,
          fillColor: '#999',
          fillOpacity: 0.4
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject
      // this.map.dragging.disable()
      this.map.setMinZoom(7).setMaxZoom(17)
      this.map.setMaxBounds(this.map.getBounds())
      // axios
      //   .all([
      //     // 'https://cdn.jsdelivr.net/gh/davidbkay/mississippi-education-geojson@v0.0.1/districts-mississippi.geojson'
      //     axios.get(
      //       'https://opendata.arcgis.com/datasets/1cbc6a683147445da9dab4681f776b04_0.geojson?where=UPPER(STATEFP)%20like%20%27%2528%25%27'
      //     ),
      //     axios.get(
      //       'https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_GEOCODE_PUBLICSCH_1516/MapServer/0/query?where=UPPER(LSTATE)%20like%20%27%25MS%25%27&outFields=*&outSR=4326&f=json'
      //     )
      //   ])
      //   .then(
      //     axios.spread((districts, schools) => {
      //       // eslint-disable-next-line no-console
      //       console.log('districts: ', districts.data)
      //       this.districts = districts.data
      //       // eslint-disable-next-line no-console
      //       console.log('schools', schools)
      //       this.schools = schools.data.features
      //     })
      //   )
      // .then(response => {
      // eslint-disable-next-line no-console
      //   console.log('geojson response: ', response.data)
      //   this.selected = response.data
      //   this.districts = response.data
      //   this.loading = false
      // })
    })
  },
  methods: {
    getMarkers(layer) {
      const features = this.schools.filter(
        item =>
          item.attributes.NCESSCH.substr(0, 7) ===
          layer.feature.properties.GEOID
      )
      this.markers = features
    },
    handleYearSelection(year) {
      this.yearSelected = year
      this.handleSelectionChange()
    },
    handleSelectionChange() {
      this.$refs.geojson.mapObject.setStyle(this.styleFunction)
    },
    resetMap() {
      this.map.flyTo(this.originalCenter, 7, { duration: 0.2 })
      this.lastClickLayer = null
      this.sheet = false
      this.markers = []
      this.$refs.geojson.mapObject.setStyle(this.styleFunction)
    },
    handleZoom() {
      if (this.map.getZoom() < 8 && this.lastClickLayer) {
        this.$refs.geojson.mapObject.setStyle(this.styleFunction)
        this.sheet = false
      }
    }
  }
}
</script>

<style>
.mapOver {
  z-index: 999;
}
</style>
