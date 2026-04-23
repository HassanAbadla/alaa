<template>
  <div>
    <v-sheet :color="'grey' + $vuetify.theme.dark ? 'darken-2' : 'lighten-4'" class="pa-3">
      <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: "CardLoader"
}
</script>
