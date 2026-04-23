<script>
export default {
  props: {
    imagePath: String
  }
}
</script>

<template>
  <div class="fill-height">
    <v-row class="fill-height" align-content="center" align="center" justify="center">
      <v-col cols="12" md="4">
        <slot />
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" class="fill-height" cols="12" md="8">
        <v-img v-if="imagePath" :src="imagePath" elevation="1" max-height="100vh" max-width="100%"></v-img>
        <v-sheet v-else color="primary" elevation="1" height="100%" width="100%"></v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
