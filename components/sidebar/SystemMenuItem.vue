<template>
  <v-list-item :to="to" nuxt link>
    <span class="body-2">{{ $t(title) }}</span>
  </v-list-item>
</template>

<script>
export default {
  name: "SystemMenuItem",
  props: {
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
