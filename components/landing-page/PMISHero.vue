<template>
  <hero-section
    :title="$t('home.pmis_title')"
    path="/pmis"
    :login-text="$t('home.pmis_login')"
    :description="$t('home.pmis_hero_message')"
    :bgImage="'pmis-new.jpeg'"
    logo=""
  />
</template>

<script>
import HeroSection from "./HeroSection.vue"
export default {
  name: "PMISHero",
  components: { HeroSection }
}
</script>

<style></style>
