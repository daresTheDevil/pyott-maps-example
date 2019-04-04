<template>
  <div>
    <v-toolbar color="deep-purple">
      <v-toolbar-title>Pyott Maps</v-toolbar-title>
    </v-toolbar>
    <v-container fluid class="pa-0" fill-height>
      <v-layout row fill-height>
        <v-flex>
          <div id="map-wrap" style="height: 93vh">
            <no-ssr>
              <l-map :zoom="13" :center="[47.41322, -1.219482]">
                <l-tile-layer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-marker :lat-lng="[47.41322, -1.219482]"></l-marker>
              </l-map>
            </no-ssr>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {}
}
</script>
