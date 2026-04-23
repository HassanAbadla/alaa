<template>
  <hero-section-single
    :title="$t('home.grc_title')"
    :login-text="$t('home.grc_login')"
    :descriptions="descriptions"
    :bgImage="'zainbg.png'"
  />
</template>

<script>
import HeroSectionSingle from "../HeroSectionSingle.vue"

export default {
  name: "GRCHero",
  components: { HeroSectionSingle },
  data() {
    return {
      descriptions: [
        "home.grc_hero_message1",
        "home.grc_hero_message2",
        "home.grc_hero_message3",
        "home.grc_hero_message4"
      ]
    }
  }
}
</script>
