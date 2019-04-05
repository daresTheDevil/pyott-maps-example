<template>
  <div>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-list>
        <v-list-tile>
          Link
        </v-list-tile>
        <v-list-tile>
          Link 2
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="deep-purple" fixed>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn
        v-if="$route.path !== '/' && $vuetify.breakpoint.xsAndUp"
        icon
        @click="$router.go(-1)"
        ><v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Pyott Maps</v-toolbar-title>
      <v-spacer />
      <v-btn outline flat round>Zoom: {{ zoom }}</v-btn>
      <v-btn outline flat round>Center: {{ center }}</v-btn>
      <v-spacer />
      <v-btn outline large>Upload CSV here</v-btn>
    </v-toolbar>
    <div id="map-wrap" style="height: 93vh;">
      <no-ssr>
        <l-map :zoom.sync="zoom" :center="center" style="z-index: 0;">
          <l-tile-layer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          ></l-tile-layer>
          <div class="text-xs-right">
            <v-toolbar
              floating
              style="z-index: 999;"
              class="mt-5 align-sm-right"
              ><v-text-field
            /></v-toolbar>
          </div>
          <l-marker :lat-lng="[47.41322, -1.219482]"></l-marker>
        </l-map>
      </no-ssr>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      center: [47.41322, -1.219482],
      zoom: 13,
      drawer: false
    }
  }
}
</script>
