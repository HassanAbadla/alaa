<template>
  <v-row>
    <v-col cols="12" sm="6" md="3" lg="2" v-for="destination in 6" :key="destination">
      <v-sheet :color="'grey' + $vuetify.theme.dark ? 'darken-2' : 'lighten-4'" class="pa-3">
        <v-skeleton-loader class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CardsLoader"
}
</script>

<style scoped></style>
