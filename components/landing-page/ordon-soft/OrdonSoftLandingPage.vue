<template>
  <landing-wrapper>
    <template #hero>
      <v-col class="hero-col">
        <ordon-soft-hero />
      </v-col>
    </template>
    <template #content>
      <v-col class="hero-col">
        <more-info-section />
      </v-col>
    </template>
  </landing-wrapper>
</template>

<script>
import LandingWrapper from "@/components/landing-page/LandingWrapper.vue"
import MoreInfoSection from "@/components/landing-page/MoreInfoSection.vue"
import OrdonSoftHero from "./OrdonSoftHero.vue"

export default {
  components: { LandingWrapper, MoreInfoSection, OrdonSoftHero },
  name: "OrdonSoftLandingPage"
}
</script>

<style></style>
