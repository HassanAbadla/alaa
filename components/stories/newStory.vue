<template>
  <div>
    <v-toolbar
      color="primary"
      dark
      flat
    >

      <v-spacer />
      <v-btn icon @click="$emit('input',false)"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>

    <v-card flat tile color="#eee">
      <v-card-text>
        <new-slide/>
      </v-card-text>
    </v-card>
  </div>

</template>

<script>
import NewSlide from "./newSlide";
export default {
  name: "newStory",
  components: {NewSlide},
  data()
  {
    return {
      drawer: true
    }
  },
  computed: {
    windowHeight()
    {
      return window.innerHeight - 100
    }
  }
}
</script>

<style scoped>

</style>
