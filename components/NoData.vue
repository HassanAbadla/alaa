<template>
  <div>
    <v-row class="fill-height ma-0" align="center" justify="center">
      <div class="text-center">
        <v-icon color="grey" size="128">mdi-file-document-alert</v-icon>
        <h3 class="grey--text text-center">{{ message }}</h3>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "NoData",
  props: ["message"]
}
</script>

<style scoped></style>
