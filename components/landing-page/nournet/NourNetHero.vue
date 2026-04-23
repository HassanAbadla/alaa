<template>
  <hero-section-single
    :title="$t('home.nournet_title')"
    :login-text="$t('home.nournet_login')"
    :descriptions="descriptions"
    :bgImage="'NourNet.jpg'"
  />
</template>

<script>
import HeroSectionSingle from "../HeroSectionSingle.vue"

export default {
  name: "NourNetHero",
  components: { HeroSectionSingle },
  data() {
    return {
      descriptions: [
        "home.nournet_hero_message1",
        "home.nournet_hero_message2",
        "home.nournet_hero_message3",
        "home.nournet_hero_message4"
      ]
    }
  }
}
</script>
