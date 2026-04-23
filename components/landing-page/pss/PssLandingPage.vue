<template>
  <landing-wrapper>
    <template #hero>
      <v-col class="hero-col">
        <pss-hero />
      </v-col>
    </template>
  </landing-wrapper>
</template>

<script>
import LandingWrapper from "@/components/landing-page/LandingWrapper.vue"
import InfoSection from "@/components/landing-page/InfoSection.vue"
import PssHero from "./PssHero.vue"

export default {
  name: "PssLandingPage",
  components: { LandingWrapper, InfoSection, PssHero },
  middleware: []
}
</script>

<style></style>
