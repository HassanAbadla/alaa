<template>
  <landing-wrapper>
    <template #hero>
      <v-col class="hero-col">
        <university-of-tabuk-hero />
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
import UniversityOfTabukHero from "./UniversityOfTabukHero.vue"

export default {
  components: { LandingWrapper, MoreInfoSection, UniversityOfTabukHero },
  name: "UniversityOfTabukLandingPage"
}
</script>

<style></style>
