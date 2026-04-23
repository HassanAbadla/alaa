<template>
  <div>
    <section id="hero" class="hero-section">
      <v-row no-gutters class="hero-row">
        <slot name="hero" />
      </v-row>
    </section>
    <section>
      <v-row no-gutters class="hero-row">
        <slot name="content" />
      </v-row>
      <div class="svg-border-waves">
        <img src="~@/assets/img/wave2.svg" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LandingWrapper"
}
</script>

<style scoped>
.hero-section {
  height: 100vh;
  overflow: scroll;
}
.hero-row {
  height: 100%;
}
.hero-col {
  height: 100%;
}
</style>
