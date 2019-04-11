<template>
  <v-app>
    <l-map
      ref="map"
      :options="mapOptions"
      :zoom.sync="zoom"
      :center.sync="center"
      class="mapContainer"
    >
      <l-control-zoom
        v-if="$vuetify.breakpoint.mdAndUp"
        position="topleft"
      ></l-control-zoom>
      <l-tile-layer :url="standardTiles"></l-tile-layer>
      <l-geo-json
        ref="geojson"
        :geojson="districts"
        :options="options"
        :options-style="styleFunction"
      />
      <v-container
        v-if="$vuetify.breakpoint.mdAndUp"
        fill-height
        fluid
        grid-list-lg
      >
        <v-layout fill-height justify-end>
          <v-flex xs3>
            <v-layout column>
              <v-flex xs3 class="my-1">
                <v-card
                  dark
                  color="primary"
                  class="overlayContainer elevation-10"
                >
                  <v-toolbar
                    card
                    dark
                    color="primary"
                    class="justify-space-between"
                  >
                    <v-btn
                      :disabled="yearSelected === 0"
                      icon
                      @click="yearSelected--"
                      ><v-icon>mdi-chevron-left</v-icon></v-btn
                    >
                    <v-tabs
                      v-model="yearSelected"
                      hide-slider
                      color="primary"
                      grow
                      class="mx-2"
                      active-class="primary lighten-1"
                    >
                      <v-tab v-for="year in years" :key="year">
                        <h1 class="subheading white--text">{{ year }}</h1>
                      </v-tab>
                    </v-tabs>
                    <v-btn
                      icon
                      :disabled="yearSelected === 1"
                      @click="yearSelected++"
                      ><v-icon>mdi-chevron-right</v-icon></v-btn
                    >
                  </v-toolbar>
                  <v-card-text>
                    <v-select
                      hide-details
                      solo-inverted
                      :items="dataSets"
                      flat
                      item-text="name"
                      item-value="value"
                      label="Select dataset"
                    />
                  </v-card-text>
                  <v-card-text class="pt-0">
                    <v-btn
                      block
                      :disabled="!districtSelected"
                      color="white"
                      :light="districtSelected"
                      depressed
                      @click="resetMap"
                      >Reset map</v-btn
                    >
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-slide-y-transition>
                <v-flex v-if="districtSelected" xs3 class="my-1">
                  <v-card
                    dark
                    color="primary"
                    class="overlayContainer elevation-10"
                  >
                    <v-card-title class="title">{{
                      selectedDistrict.NAME
                    }}</v-card-title>
                    <v-divider />
                    <v-card-text>
                      <v-list dense class="transparent">
                        <v-list-tile
                          v-for="item in markers"
                          :key="item.attributes.OBJECTID"
                        >
                          <v-layout row justify-space-between align-center>
                            <h1
                              class="body-1 text-capitalize"
                              v-text="item.attributes.NAME"
                            />
                            <v-btn flat icon
                              ><v-icon>mdi-chevron-double-right</v-icon></v-btn
                            >
                          </v-layout>
                        </v-list-tile>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-slide-y-transition>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <l-marker-cluster
        v-if="markers && zoom > 7"
        ref="schools"
        chunked-loading
      >
        <l-marker
          v-for="(school, s) in markers"
          :key="s"
          :lat-lng="[school.geometry.y, school.geometry.x]"
          @click="handleMarkerClick"
        >
          <l-popup :options="markerOptions">
            <v-card light flat color="transparent">
              <v-card-title>
                <h1 class="subheading text-capitalize">
                  {{ school.attributes.NAME }}
                </h1>
              </v-card-title>
              <v-card-actions>
                <v-spacer />

                <v-btn depressed class="text-capitalize" color="primary"
                  >See report card</v-btn
                >
              </v-card-actions>
            </v-card>
          </l-popup>
          <l-tooltip
            v-if="$vuetify.breakpoint.mdAndUp"
            :options="markerOptions"
          >
            <h1 class="subheading text-capitalize">
              {{ school.attributes.NAME }}
            </h1>
            <br />
            <div class="text-xs-right">
              <v-btn flat color="primary"
                >See report card<v-icon>mdi-chevron-double-right</v-icon></v-btn
              >
            </div>
          </l-tooltip>
        </l-marker>
      </l-marker-cluster>
      <v-snackbar
        v-if="$vuetify.breakpoint.mdAndDown"
        :value="districtSelected"
        top
        color="primary lighten-1"
        :timeout="timeout"
        absolute
        class="overlayContainer"
      >
        <v-layout v-if="selectedDistrict" align-center justify-space-between>
          <span>{{ selectedDistrict.NAME }}</span>
          <v-btn icon><v-icon>mdi-chevron-double-right</v-icon></v-btn>
        </v-layout>
      </v-snackbar>
    </l-map>
    <v-footer
      v-if="$vuetify.breakpoint.mdAndDown"
      app
      height="auto"
      color="primary"
    >
      <v-layout column>
        <v-flex>
          <v-slide-y-transition>
            <v-toolbar
              v-if="menu === 2"
              dense
              flat
              dark
              color="primary lighten-1"
              class="justify-space-between"
            >
              <v-btn :disabled="yearSelected === 0" icon @click="yearSelected--"
                ><v-icon>mdi-chevron-left</v-icon></v-btn
              >
              <v-tabs
                v-model="yearSelected"
                hide-slider
                color="transparent"
                dark
                grow
                class="mx-2"
                active-class="primary"
              >
                <v-tab v-for="year in years" :key="year">
                  <h1 class="subheading">{{ year }}</h1>
                </v-tab>
              </v-tabs>
              <v-btn icon :disabled="yearSelected === 1" @click="yearSelected++"
                ><v-icon>mdi-chevron-right</v-icon></v-btn
              >
            </v-toolbar>
          </v-slide-y-transition>
        </v-flex>
        <v-flex>
          <v-toolbar dark flat color="transparent">
            <v-btn icon @click="resetMap"><v-icon>mdi-refresh</v-icon></v-btn>
            <v-tabs
              v-model="menu"
              color="transparent"
              active-class="primary lighten-1"
              grow
              hide-slider
            >
              <v-tab>
                Map
              </v-tab>
              <v-tab :disabled="!districtSelected">
                Schools
              </v-tab>
              <v-tab>
                Years
              </v-tab>
              <v-tab>
                Data
              </v-tab>
            </v-tabs>
          </v-toolbar>
        </v-flex>
      </v-layout>
    </v-footer>
    <v-dialog :value="menu === 3" fullscreen>
      <v-card light>
        <v-card-title class="py-1 px-0">
          <v-btn icon flat @click="menu = 0"
            ><v-icon>mdi-arrow-left</v-icon></v-btn
          >
          <span class="title font-weight-regular">Select data to view</span>
        </v-card-title>
        <v-divider />
        <v-list>
          <v-list-tile
            v-for="item in dataSets"
            :key="item.name"
            class="my-2"
            @click="handleDataSelect(item.value)"
          >
            <v-list-tile-content>
              <v-list-tile-title v-text="item.name" />
              <v-list-tile-sub-title v-text="item.description" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog :value="menu === 1" fullscreen>
      <v-card light>
        <v-card-title class="py-1 px-0">
          <v-btn icon flat @click="menu = 0"
            ><v-icon>mdi-arrow-left</v-icon></v-btn
          >
          <span class="title font-weight-regular">Schools</span>
        </v-card-title>
        <v-divider />
        <v-list dense>
          <v-list-tile v-for="item in markers" :key="item.attributes.OBJECTID">
            <v-layout row justify-space-between align-center>
              <h1 class="body-1" v-text="item.attributes.NAME" />
              <v-btn flat icon><v-icon>mdi-chevron-double-right</v-icon></v-btn>
            </v-layout>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import districts1516 from '@/assets/data/mde-districts-1516.json'
import { features as schools1516 } from '@/assets/data/mde-schools-1516.json'
import districts1617 from '@/assets/data/mde-districts-1617.json'
import { features as schools1617 } from '@/assets/data/mde-schools-1617.json'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  components: { 'l-marker-cluster': Vue2LeafletMarkerCluster },
  data() {
    return {
      center: [32.245329, -89.862671],
      originalCenter: [32.245329, -89.862671],
      zoom: 7,
      timeout: 0,
      menu: 0,
      yearStep: 0,
      markerOptions: { permanent: true },
      dataSetSelected: 'grade',
      districts1516,
      schools1516,
      lastClickLayer: '',
      districts1617,
      schools1617,
      yearSelected: 0,
      dataSets: [
        {
          name: 'Accountability grade',
          description: 'this is a description',
          value: 'grade'
        },
        {
          name: 'Math proficiency',
          description: 'this is a description',
          value: 'MP'
        }
      ],
      years: ['2014/15', '2015/16'],
      markers: [],
      districtSelected: false,
      selectedDistrict: null,
      mapOptions: { zoomControl: false },
      standardTiles: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      lightTiles:
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    }
  },
  computed: {
    districts() {
      if (this.yearSelected === 0) return this.districts1516
      if (this.yearSelected === 1) return this.districts1617
      return this.districts1516
    },
    schools() {
      if (this.yearSelected === 0) return this.schools1516
      if (this.yearSelected === 1) return this.schools1617
      return this.schools1516
    },
    selectedYear() {
      switch (this.yearSelected) {
        case 0:
          return '2015/2016'
        case 1:
          return '2016/2017'
        default:
          return '2015/2016'
      }
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
            this.getMarkers(layer)
          }
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.districtSelected = true
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedDistrict = feature.properties
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.lastClickLayer = layer._leaflet_id
          layer.setStyle({ fillColor: 'white', fillOpacity: 0 })
          this.map.fitBounds(layer.getBounds().pad(0.035))
          this.getMarkers(layer)
        })
      }
    },
    styleFunction() {
      return feature => {
        let fillColor
        const id = feature.properties.GEOID
        if (this.yearSelected === 0) {
          if (this.dataSetSelected === 'grade') {
            if (id <= 2800200) fillColor = '#f7feae'
            else if (id <= 2803600) fillColor = '#7ccba2'
            else if (id <= 2804700) fillColor = '#46aea0'
            else if (id <= 2805990) fillColor = '#00718b'
            else fillColor = '#045275'
          } else if (this.dataSetSelected === 'MP') {
            if (id <= 2800200) fillColor = '#46aea0'
            else if (id <= 2803600) fillColor = '#00718b'
            else if (id <= 2804700) fillColor = '#f7feae'
            else if (id <= 2805990) fillColor = '#045275'
            else fillColor = '#7ccba2'
          }
        } else if (this.yearSelected === 1) {
          if (this.dataSetSelected === 'grade') {
            if (id <= 2800200) fillColor = '#f3e79b'
            else if (id <= 2803600) fillColor = '#eb7f86'
            else if (id <= 2804700) fillColor = '#46aea0'
            else if (id <= 2805990) fillColor = '#00718b'
            else fillColor = '#5c53a5'
          } else if (this.dataSetSelected === 'MP') {
            if (id <= 2800200) fillColor = '#5c53a5'
            else if (id <= 2803600) fillColor = '#00718b'
            else if (id <= 2804700) fillColor = '#46aea0'
            else if (id <= 2805990) fillColor = '#eb7f86'
            else fillColor = '#f3e79b'
          }
        }
        return {
          color: fillColor,
          weight: 1,
          fillColor: fillColor,
          fillOpacity: 0.4
        }
      }
    },
    selectedStyle() {
      return {
        color: '#ccc',
        opacity: 0.7,
        weight: 1,
        fillColor: '#ccc',
        fillOpacity: 0.7
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject
      // this.map.dragging.disable()
      this.map.setMinZoom(7).setMaxZoom(17)
    })
  },
  methods: {
    handleDataSelect(data) {
      this.menu = 0
      this.dataSetSelected = data
    },
    resetMap() {
      this.map.flyTo(this.originalCenter, 7, { duration: 0.2 })
      this.markers = []
      this.menu = 0
      this.districtSelected = false
      this.$refs.geojson.mapObject.setStyle(this.styleFunction)
    },
    handleMarkerClick(e) {
      this.map.setView(e.target.getLatLng(), this.zoom, { animate: true })
    },
    getMarkers(layer) {
      const features = this.schools1516.filter(
        item =>
          item.attributes.NCESSCH.substr(0, 7) ===
          layer.feature.properties.GEOID
      )
      this.markers = features
    }
  }
}
</script>

<style>
.overlayContainer {
  z-index: 999;
}
.mapContainer {
  z-index: 0;
  height: calc(100vh - 64px);
}
</style>
