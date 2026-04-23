<template>
  <hero-section
    :title="$t('home.ordon_soft_title')"
    path=""
    :description="$t('home.ordon_soft_hero_message')"
    :bgImage="'ordonsoft-landing.jpeg'"
    logo="OrdonSoft-logo.png"
    logo-two=""
    :top-text="$t('home.modern_digital_solutions')"
    :bottom-text="$t('home.ordon_soft_title')"
    :services="services"
  />
</template>

<script>
import HeroSection from "../HeroSection.vue"

export default {
  name: "OrdonSoftHero",
  components: { HeroSection },
  data() {
    return {
      services: [
        {
          title: this.$t("services.pmis_title"),
          text: this.$t("services.pmis_description")
        },
        {
          title: this.$t("services.grc_title"),
          text: this.$t("services.grc_description")
        },
        {
          title: this.$t("services.custom_software_title"),
          text: this.$t("services.custom_software_description")
        }
      ]
    }
  }
}
</script>

<style></style>
