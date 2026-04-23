import Vue from "vue"
import GmapVue from "~/node_modules/gmap-vue"

Vue.use(GmapVue, {
  load: {
    key: "AIzaSyBZ-Hhicbhd1iL8DSdrthM0ndkD1SwE5sM",
    libraries: "places,drawing"
  },
  installComponents: true
})
