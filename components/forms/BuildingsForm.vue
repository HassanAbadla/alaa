<template>
  <v-container fluid class="pa-4">
    <form-wrapper :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-dropdown
        v-if="isService"
        v-model="formData.tenant_id"
        :items="getTenants"
        item-text="company_name"
        item-value="id"
        :label="$t('table.company')"
        :required="true"
        :loading="loadingTenants"
        :disabled="disableTenantSelection"
      />
      <custom-dropdown
        v-model="formData.location_id"
        :label="$t('form.location')"
        :items="getLocations"
        item-text="name"
        item-value="id"
        :required="true"
        :loading="loadLocations"
        :errors="errors.location_id"
        @clear-errors="clearError('location_id')"
      />
      <custom-input
        v-model="formData.name.en"
        :label="$t('form.en_name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-input
        v-model="formData.name.ar"
        :label="$t('form.ar_name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-input
        v-model="formData.code"
        :label="$t('table.building_no')"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <!-- Map Container -->
      <div id="map" style="height: 600px; width: 100%; border-radius: 8px"></div>

      <!-- Coordinates Display -->
      <v-card class="mt-4" flat>
        <v-card-title class="font-weight-bold">Selected Location</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <custom-input
                v-model="formData.lat"
                :label="$t('form.latitude')"
                :type="number"
                :required="true"
                :errors="errors.name"
                @clear-errors="clearError('name')"
                @input="updateMarkerPosition"
              />
            </v-col>
            <v-col cols="12" md="6">
              <custom-input
                v-model="formData.lng"
                :label="$t('form.longitude')"
                :type="number"
                :required="true"
                :errors="errors.name"
                @clear-errors="clearError('name')"
                @input="updateMarkerPosition"
              />
            </v-col>
          </v-row>
          <v-alert type="info" dense text class="mt-2">
            {{ $t("message.click_map_set_location") }}
          </v-alert>
        </v-card-text>
      </v-card>
    </form-wrapper>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "BuildingsForm",

  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    },
    isService: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {
        name: { en: "", ar: "" },
        location_id: null,
        tenant_id: Number(this.$route.params.id) || null,
        lat: 24.392030908787927,
        lng: 54.395623149387845
      },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      map: null,
      marker: null,
      googleMapsLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      getCurrentBuilding: "buildings/getCurrentBuilding",
      loadingBuildings: "buildings/isLoading",
      getLocations: "locations/getLocations",
      loadLocations: "locations/isLoading",
      getTenants: "srvTenants/getTenants",
      loadingTenants: "srvTenants/isLoading"
    }),
    disableTenantSelection() {
      return (!this.editForm && this.$route.query.rooms_id) || this.$route.params.id
    }
  },

  async mounted() {
    this.fetchData()
    if (this.editForm) {
      await this.fetchBuildingById(this.itemId)
      this.formData.name.en = this.getCurrentBuilding.name.en
      this.formData.name.ar = this.getCurrentBuilding.name.ar
      this.formData.code = this.getCurrentBuilding.code
      this.formData.lat = Number(this.getCurrentBuilding.lat)
      this.formData.lng = Number(this.getCurrentBuilding.lng)
      this.formData.location_id = Number(this.getCurrentBuilding.location_id)
    }

    this.loadGoogleMaps()
  },

  methods: {
    ...mapActions({
      addBuilding: "buildings/addBuilding",
      updateBuilding: "buildings/updateBuilding",
      fetchBuildingById: "buildings/fetchBuildingById",
      fetchLocations: "locations/fetchLocations",
      deleteLocation: "locations/deleteLocation",
      fetchTenants: "srvTenants/fetchTenants"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.isSubmitting = true
      this.errors = {}
      this.loadingBuildings = true
      try {
        // if (this.editForm) {
        //   this.formData.id = this.itemId
        //   await this.updateBuilding(this.formData)
        // } else {
        //   await this.addBuilding(this.formData)
        // }
        const payload = { ...this.formData }
        const result = this.editForm
          ? await this.updateBuilding({ ...payload, id: this.itemId })
          : await this.addBuilding(payload)
        if (result?.success === false && result?.errors) {
          this.errors = result.errors
          return
        }

        this.closeDrawer()
      } catch (error) {
        const apiErrors = error?.response?.data?.message
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
        }
        console.error("Error saving transaction:", error)
      } finally {
        this.loadingBuildings = false
        this.isSubmitting = false
      }
    },
    clearError(field) {
      if (this.errors[field]) {
        this.$set(this.errors, field, [])
      }
    },
    async fetchData() {
      this.loadGoogleMaps()
      this.fetchLocations()
      this.fetchTenants()
    },
    loadGoogleMaps() {
      if (window.google && window.google.maps) {
        this.googleMapsLoaded = true
        this.initMap()
        return
      }

      const script = document.createElement("script")
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA-IQyk0w2hXbtn9y2vRwwxo4noZP5jRrA&libraries=&v=weekly"
      script.async = true
      script.defer = true
      script.onload = () => {
        this.googleMapsLoaded = true
        this.initMap()
      }
      document.head.appendChild(script)
    },

    async initMap() {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps not loaded")
        return
      }

      try {
        const { Map } = await google.maps.importLibrary("maps")
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker")

        // Initialize map
        this.map = new Map(document.getElementById("map"), {
          center: { lat: this.formData.lat, lng: this.formData.lng },
          zoom: 12,
          mapId: "4504f8b37365c3d0"
        })

        // Create draggable marker
        this.marker = new AdvancedMarkerElement({
          map: this.map,
          position: { lat: this.formData.lat, lng: this.formData.lng },
          gmpDraggable: true,
          title: "Selected Location"
        })

        // Update coordinates when marker is dragged
        this.marker.addListener("dragend", (event) => {
          const position = this.marker.position
          this.formData.lat = position.lat
          this.formData.lng = position.lng
        })

        // Add click listener to map to place marker
        this.map.addListener("click", (event) => {
          const clickedLat = event.latLng.lat()
          const clickedLng = event.latLng.lng()

          this.formData.lat = clickedLat
          this.formData.lng = clickedLng

          this.marker.position = { lat: clickedLat, lng: clickedLng }
        })
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    },

    updateMarkerPosition() {
      if (this.marker && this.formData.lat && this.formData.lng) {
        this.marker.position = { lat: this.formData.lat, lng: this.formData.lng }
        this.map.setCenter({ lat: this.formData.lat, lng: this.formData.lng })
      }
    }
  },

  beforeDestroy() {
    // Clean up marker
    if (this.marker && this.marker.map) {
      this.marker.map = null
    }
  }
}
</script>

<style scoped>
#map {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
