<!-- NoPostsMessage.vue -->
<template>
  <v-container fluid class="text-center">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12">
        <v-icon x-large color="grey lighten-1">mdi-message-text-outline</v-icon>
        <h2 class="headline grey--text text--darken-1 mt-4">{{ title }}</h2>
        <p class="subtitle-1 grey--text">{{ subtitle }}</p>
        <!-- <v-btn v-if="showButton" color="primary" class="mt-4" @click="$emit('create-post')">
          {{ buttonText }}
        </v-btn> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "NoPostsMessage",
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    showButton: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String
    }
  }
}
</script>
