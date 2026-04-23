<template>
  <hero-section-single
    :title="$t('home.oss_title')"
    :login-text="$t('home.oss_login')"
    :descriptions="descriptions"
    :bgImage="'oss.jpg'"
  />
</template>

<script>
import HeroSectionSingle from "./HeroSectionSingle.vue"

export default {
  name: "OSSHero",
  components: { HeroSectionSingle },
  data() {
    return {
      descriptions: ["home.oss_hero_decription"]
    }
  }
}
</script>
