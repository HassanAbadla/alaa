<template>
  <hero-section-single
    :title="'TSS Arabia'"
    :login-text="'TSS Arabia Login'"
    :descriptions="descriptions"
    :bgImage="'tss.jpeg'"
  />
</template>

<script>
import HeroSectionSingle from "./HeroSectionSingle.vue"

export default {
  name: "TSSHero",
  components: { HeroSectionSingle },
  data() {
    return {
      descriptions: ["TSS Landing Page Description"]
    }
  }
}
</script>
