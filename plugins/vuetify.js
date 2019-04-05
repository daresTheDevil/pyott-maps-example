import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

// import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  theme: {
    primary: colors.lightBlue.darken4,
    accent: colors.deepPurple.darken2,
    secondary: colors.lightBlue.darken3,
    info: colors.lightBlue.base,
    warning: colors.amber.base,
    error: colors.red.darken1,
    success: colors.green.darken2
  }
})
