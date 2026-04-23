<template>
  <v-img :src="`/${$config.navbarLogo}`" :max-width="maxWidth" :max-height="maxHeight" contain class="logo-image" />
</template>

<script>
export default {
  name: "Logo",
  props: {
    link: {
      type: String,
      default: "/"
    },
    maxWidth: {
      type: [Number, String],
      default: 60
    },
    maxHeight: {
      type: [Number, String],
      default: 40
    }
  },
  methods: {
    navigateToLink() {
      this.$router.push(this.localePath(this.link))
    }
  }
}
</script>

<style scoped>
.logo-image {
  cursor: pointer;
}
</style>
