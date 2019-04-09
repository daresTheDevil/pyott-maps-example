export const state = () => ({
  geoData: null
})

export const mutations = {
  SET_GEO_DATA(state, payload) {
    state.geoData = payload
  }
}

export const getters = {
  getGeoData(state) {
    return state.geoData
  }
}

export const actions = {
  callGeoData({ commit }) {
    return this.$axios
      .$get(
        'https://nces.ed.gov/opengis/rest/services/School_District_Boundaries/EDGE_SCHOOLDISTRICT_TL16_SY1516/MapServer/0/query?where=UPPER(STATEFP)%20like%20%27%2528%25%27&outFields=*&outSR=4326&f=json'
      )
      .then(response => {
        // eslint-disable-next-line no-console
        console.log('features', response.features)
        commit('SET_GEO_DATA', response.features)
      })

    // return axios
    //   .get(
    //     'https://nces.ed.gov/opengis/rest/services/School_District_Boundaries/EDGE_SCHOOLDISTRICT_TL16_SY1516/MapServer/0/query?where=UPPER(STATEFP)%20like%20%27%2528%25%27&outFields=*&outSR=4326&f=json'
    //   )
    //   .then(response => {
    //     commit('SET_GEO_DATA', response.data.features)
    //   })
  }
}
