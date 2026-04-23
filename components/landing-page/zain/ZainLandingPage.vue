<template>
  <landing-wrapper>
    <template #hero>
      <v-col class="hero-col">
        <zain-hero />
      </v-col>
    </template>
    <template #content>
      <v-col class="hero-col">
        <info-section />
        <!-- <more-info-section /> -->
      </v-col>
    </template>
  </landing-wrapper>
</template>

<script>
import LandingWrapper from "@/components/landing-page/LandingWrapper.vue"
import MoreInfoSection from "@/components/landing-page/MoreInfoSection.vue"
import InfoSection from "@/components/landing-page/InfoSection.vue"
import ZainHero from "./ZainHero.vue"

export default {
  components: { LandingWrapper, MoreInfoSection, InfoSection, ZainHero },
  name: "PMISLandingPage",

  middleware: []
}
</script>

<style></style>
