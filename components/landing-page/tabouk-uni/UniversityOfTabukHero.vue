<template>
  <hero-section
    :title="$t('home.ut_title')"
    path="/ut"
    :login-text="$t('home.ut_login')"
    :description="$t('home.ut_hero_message')"
    :bgImage="'ut.jpeg'"
    logo="ut.png"
    logo-two="accredited.png"
  />
</template>

<script>
import HeroSection from "../HeroSection.vue"
export default {
  name: "UniversityOfTabukHero",
  components: { HeroSection }
}
</script>

<style></style>
