<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-row no-gutters>
        <!-- Buildings List -->
        <v-col cols="12" md="4" class="buildings-list">
          <v-list dense>
            <v-list-item
              v-for="building in contractBuildings"
              :key="building.id"
              @click="selectBuilding(building)"
              :class="{ 'v-list-item--active': selectedBuilding && selectedBuilding.id === building.id }"
              class="building-item"
            >
              <v-list-item-icon>
                <v-icon color="primary">mdi-office-building</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ building.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="building.address">
                  {{ building.address }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon small>mdi-chevron-right</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Map -->
        <v-col cols="12" md="8">
          <div id="map" style="height: 500px; width: 100%"></div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "BuildingsLocations",
  head: {
    script: [
      {
        src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA-IQyk0w2hXbtn9y2vRwwxo4noZP5jRrA",
        defer: true
      }
    ]
  },
  props: {
    contractId: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      contractBuildings: [],
      selectedBuilding: null,
      map: null,
      markers: []
    }
  }
}
</script>

<style scoped></style>
