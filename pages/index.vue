<template>
  <div>
    <zain-landing-page v-if="$config.buildTarget === 'zain'" />
    <nour-net-landing-page v-else-if="$config.buildTarget === 'nournet'" />
    <university-of-tabuk-landing-page v-else-if="$config.buildTarget === 'tabouk-uni'" />
    <pss-landing-page v-else-if="$config.buildTarget === 'pss'" />
    <ordon-soft-landing-page v-else />
  </div>
</template>

<script>
import OrdonSoftLandingPage from "../components/landing-page/ordon-soft/OrdonSoftLandingPage.vue"
import UniversityOfTabukLandingPage from "../components/landing-page/tabouk-uni/UniversityOfTabukLandingPage.vue"
import ZainLandingPage from "../components/landing-page/zain/ZainLandingPage.vue"
import NourNetLandingPage from "../components/landing-page/nournet/NourNetLandingPage.vue"
import PssLandingPage from "../components/landing-page/pss/PssLandingPage.vue"

export default {
  name: "LandingPage",
  layout: "default",

  components: {
    OrdonSoftLandingPage,
    ZainLandingPage,
    NourNetLandingPage,
    UniversityOfTabukLandingPage,
    PssLandingPage
  }
}
</script>
