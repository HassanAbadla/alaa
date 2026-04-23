<template>
  <hero-section
    :title="$t('home.grc_title')"
    path="/grc"
    :login-text="$t('home.grc_login')"
    :description="$t('home.grc_hero_message')"
    :bgImage="'grc-old.jpeg'"
  />
</template>

<script>
import HeroSection from "./HeroSection.vue"

export default {
  name: "GRCHeroSplit",
  components: { HeroSection }
}
</script>
