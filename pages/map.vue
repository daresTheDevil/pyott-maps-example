<template>
  <v-app>
    <v-bottom-sheet
      v-model="sheet"
      persistent
      hide-overlay
      style="z-index: 1999;"
    >
      <v-card tile color="primary" dark>
        <v-card-title>
          <h1 class="subheading">{{ selectedDistrict.NAME }}</h1>
        </v-card-title>
      </v-card>
    </v-bottom-sheet>
    <v-sheet v-show="showToolbar" tile color="primary darken-1 white--text">
      <v-container fluid class="pb-3 pt-2" grid-list-md>
        <v-layout row wrap justify-center align-end>
          <v-flex xs12>
            <!-- <v-menu light>
              <v-btn slot="activator" dark medium flat class="mx-0 px-0"
                >{{ yearSelected
                }}<v-icon right small>mdi-chevron-down</v-icon></v-btn
              >
              <v-list>
                <v-list-tile
                  v-for="year in years"
                  :key="year"
                  @click="handleYearSelection(year)"
                >
                  <v-list-tile-title v-text="year" />
                </v-list-tile>
              </v-list>
            </v-menu>
            -->
            <v-layout row align-center justify-center>
              <v-btn icon large dark @click="yearSelected--"
                ><v-icon large>mdi-arrow-left</v-icon></v-btn
              >
              <h1 class="display-1">{{ yearSelected }}</h1>
              <v-btn icon large dark @click="yearSelected++"
                ><v-icon large>mdi-arrow-right</v-icon></v-btn
              >
            </v-layout>
          </v-flex>
          <v-flex>
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
    <v-container fluid fill-height class="pa-0">
      <v-layout row fill-height>
        <v-flex>
          <l-map
            ref="map"
            :zoom.sync="zoom"
            :center.sync="center"
            :style="
              $vuetify.breakpoint.mdAndUp
                ? 'z-index: 0; height: calc(100% - 64px);'
                : 'z-index: 0; height: calc(100% - 56px);'
            "
            @update:zoom="handleZoom"
          >
            <l-tile-layer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            ></l-tile-layer>
            <l-geo-json
              ref="geojson"
              :geojson="features"
              :options="options"
              :options-style="styleFunction"
            />
            <v-container
              v-if="$vuetify.breakpoint.mdAndUp"
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
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import districts2017 from '@/assets/data/mde-districts-2017.json'
import districts2018 from '@/assets/data/mde-districts-2018.json'
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

export default {
  components: {},
  data() {
    return {
      years: [2017, 2018],
      districts2017,
      districts2018,
      showToolbar: true,
      sheet: false,
      selectedDistrict: {},
      yearSelected: 2017,
      dataSetSelected: 'grade',
      dataSets: [
        {
          text: 'Accountability Grade',
          value: 'grade'
        },
        { text: 'Math Proficiency', value: 'MP' }
      ],
      center: [32.77111, -89.81323],
      originalCenter: [32.77111, -89.81323],
      zoom: 7,
      drawer: false
    }
  },
  computed: {
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
          }
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.lastClickLayer = layer._leaflet_id
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedDistrict = feature.properties
          this.map.fitBounds(layer.getBounds())
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          layer.setStyle({ fillColor: 'white', fillOpacity: 1 })
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.sheet = true
        })
        layer.on('mouseover', () => {})
        layer.on('mouseout', () => {})
      }
    },
    styleFunction() {
      return feature => {
        let fillColor
        const fid = feature.properties.FID_12
        if (this.yearSelected === 2017) {
          if (this.dataSetSelected === 'grade') {
            if (fid <= 25) fillColor = '#f7feae'
            else if (fid <= 50) fillColor = '#7ccba2'
            else if (fid <= 75) fillColor = '#46aea0'
            else if (fid <= 100) fillColor = '#00718b'
            else fillColor = '#045275'
          } else if (this.dataSetSelected === 'MP') {
            if (fid <= 25) fillColor = '#46aea0'
            else if (fid <= 50) fillColor = '#00718b'
            else if (fid <= 75) fillColor = '#f7feae'
            else if (fid <= 100) fillColor = '#045275'
            else fillColor = '#7ccba2'
          }
        } else if (this.yearSelected === 2018) {
          if (this.dataSetSelected === 'grade') {
            if (fid <= 25) fillColor = '#f3e79b'
            else if (fid <= 50) fillColor = '#eb7f86'
            else if (fid <= 75) fillColor = '#46aea0'
            else if (fid <= 100) fillColor = '#00718b'
            else fillColor = '#5c53a5'
          } else if (this.dataSetSelected === 'MP') {
            if (fid <= 25) fillColor = '#5c53a5'
            else if (fid <= 50) fillColor = '#00718b'
            else if (fid <= 75) fillColor = '#46aea0'
            else if (fid <= 100) fillColor = '#eb7f86'
            else fillColor = '#f3e79b'
          }
        }
        return {
          color: '#999',
          weight: 1,
          fillColor: fillColor,
          fillOpacity: 0.4
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject
      // this.map.dragging.disable()
      this.map
        // .setMaxBounds(this.map.getBounds())
        .setMinZoom(7)
        .setMaxZoom(14)
    })
  },
  methods: {
    handleYearSelection(year) {
      this.yearSelected = year
      this.handleSelectionChange()
    },
    handleSelectionChange() {
      this.$refs.geojson.mapObject.setStyle(this.styleFunction)
    },
    resetMap() {
      this.map.setZoom(6)
      this.lastClickLayer = null
      this.sheet = false
      this.$refs.geojson.mapObject.setStyle(this.styleFunction)
      this.map.setView(this.originalCenter)
    },
    handleZoom() {
      if (this.map.getZoom() < 9 && this.lastClickLayer) {
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
