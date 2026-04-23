<template>
  <landing-wrapper>
    <template #hero>
      <v-col class="hero-col">
        <nour-net-hero />
      </v-col>
    </template>
    <template #content>
      <v-col class="hero-col">
        <info-section />
      </v-col>
    </template>
  </landing-wrapper>
</template>

<script>
import LandingWrapper from "@/components/landing-page/LandingWrapper.vue"
import InfoSection from "@/components/landing-page/InfoSection.vue"
import NourNetHero from "./NourNetHero.vue"

export default {
  components: { LandingWrapper, InfoSection, NourNetHero },
  name: "NourNetLandingPage",
  middleware: []
}
</script>

<style></style>
