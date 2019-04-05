<template>
  <v-app light>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click="drawer = !drawer"
      />
      <a href="/">
        <img
          src="/images/mde-logo-light.svg"
          :height="$vuetify.breakpointmdAndUp ? 50 : 40"
          :class="$vuetify.breakpoint.mdAndUp ? 'ml-5' : ''"
          href="/"
        />
      </a>
      <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">
        <div class="mt-2">
          <h1 class="title font-weight-medium">
            Mississippi Department of Education
          </h1>
          <h1 class="subheading font-weight-light">
            Mississippi Succeeds Report Card
          </h1>
        </div>
      </v-toolbar-title>
      <v-spacer />
      <v-menu offset-y left>
        <v-btn slot="activator" flat>
          Links
        </v-btn>
        <v-list>
          <v-list-tile v-for="link in links" :key="link.text" :to="link.to">
            <v-list-tile-avatar
              ><v-icon>{{ link.icon }}</v-icon></v-list-tile-avatar
            >
            <v-list-tile-title v-text="link.text" />
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu offset-y left>
        <v-btn slot="activator" icon>
          <v-icon large>
            mdi-earth
          </v-icon>
        </v-btn>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <img src="https://img.icons8.com/color/48/000000/usa.png" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>English</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <img src="https://img.icons8.com/color/48/000000/mexico.png" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Espanol</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <img src="https://img.icons8.com/color/48/000000/china.png" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Chinese</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <img src="https://img.icons8.com/color/48/000000/france.png" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>French</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn icon>
        <v-icon large>
          mdi-human
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
