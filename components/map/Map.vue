<template>
  <div>
    <v-btn class="text-capitalize" text @click="getLocation" color="primary">
      <v-icon>mdi-crosshairs-gps</v-icon>
      {{ $t("my_location") }}
    </v-btn>
    <v-btn color="primary" @click="addArea">{{ $t("map.add path") }}</v-btn>
    <gmap-map
      ref="map"
      :center="location"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 500px"
      :options="mapOptions"
    >
      <gmap-polygon
        :draggable="true"
        :clickable="true"
        fillColor="#7843e9"
        strokeColor="#7843e9"
        :deepWatch="true"
        :fillOpacity="0.7"
        :paths="polygonPaths"
        :editable="true"
        @paths_changed="saveArea"
      ></gmap-polygon>
      <GmapMarker
        v-if="!addPath"
        :position="location"
        :clickable="true"
        :draggable="true"
        @dragend="getMarkerPosition"
      />
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "MapCompnent",
  props: {
    location: {
      type: Object,
      required: true
    },
    polygonPaths: {
      type: Array,
      required: true
    },
    addPath: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        styles: [
          { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ visibility: "on" }, { color: "#3e606f" }, { weight: 2 }, { gamma: 0.84 }]
          },
          { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { featureType: "administrative", elementType: "geometry", stylers: [{ weight: 0.6 }, { color: "#313536" }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#44a688" }] },
          { featureType: "poi", elementType: "geometry", stylers: [{ color: "#13876c" }] },
          {
            featureType: "poi.attraction",
            elementType: "geometry.stroke",
            stylers: [{ color: "#f5e4e4" }, { visibility: "off" }]
          },
          {
            featureType: "poi.attraction",
            elementType: "labels",
            stylers: [{ visibility: "on" }, { lightness: "14" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#13876c" }, { visibility: "simplified" }]
          },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#067372" }, { lightness: "-20" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#357374" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#004757" }] }
        ]
      }
    }
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }
    },
    showPosition(position) {
      this.$emit("update:location", {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    },
    addArea() {
      let bounds = this.$refs.map.$mapObject.getBounds()
      let northEast = bounds.getNorthEast()
      let southWest = bounds.getSouthWest()
      let center = bounds.getCenter()
      let degree = this.polygonPaths.length + 1
      let f = Math.pow(0.66, degree)

      let path = [
        {
          lng: center.lng(),
          lat: (1 - f) * center.lat() + f * northEast.lat()
        },
        {
          lng: (1 - f) * center.lng() + f * southWest.lng(),
          lat: (1 - f) * center.lat() + f * southWest.lat()
        },
        {
          lng: (1 - f) * center.lng() + f * northEast.lng(),
          lat: (1 - f) * center.lat() + f * southWest.lat()
        }
      ]

      this.$emit("update:polygonPaths", [...this.polygonPaths, path])
    },
    saveArea(mvcArray) {
      let paths = []
      for (let i = 0; i < mvcArray.getLength(); i++) {
        let path = []
        for (let j = 0; j < mvcArray.getAt(i).getLength(); j++) {
          let point = mvcArray.getAt(i).getAt(j)
          path.push({ lat: point.lat(), lng: point.lng() })
        }
        paths.push(path)
      }
      this.$emit("update:polygonPaths", paths)
    },
    getMarkerPosition(event) {
      this.$emit("update:location", {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      })
    }
  }
}
</script>

<style scoped>
.locationBtn {
  margin-top: 20px;
}
</style>
