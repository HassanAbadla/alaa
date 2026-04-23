<template>
  <v-sheet dark class="hero-container" width="100%">
    <v-img
      :src="require(`@/static/hero-backgrounds/${bgImage}`)"
      gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.4)"
      class="hero-image"
    >
      <!-- Logo containers -->
      <div :class="`logo-container ${isRTL ? 'right' : 'left'}`" v-if="logo">
        <v-img :src="require(`@/static/logos/${logo}`)" max-width="150" contain />
      </div>
      <div :class="`logo-container ${!isRTL ? 'right' : 'left'}`" v-if="logoTwo">
        <v-img :src="require(`@/static/logos/${logoTwo}`)" max-width="100" contain />
      </div>

      <!-- Top right text -->
      <div :class="`top-text ${isRTL ? 'left' : 'right'}`">
        <div class="white--text text-h6 font-weight-medium">
          {{ topText }}
        </div>
      </div>

      <!-- Services column on the left/right depending on RTL -->
      <div
        :class="`services-container ${isRTL ? 'services-right' : 'services-left'}`"
        v-if="services && services.length"
      >
        <div v-for="(service, index) in services" :key="index" class="service-item">
          <div class="white--text text-h4 font-weight-bold service-title">
            {{ service.title }}
          </div>
          <div class="white--text text-h6 service-text">
            {{ service.text }}
          </div>
        </div>
      </div>

      <!-- Bottom right text -->
      <div :class="`bottom-text ${isRTL ? 'left' : 'right'}`">
        <div class="white--text text-h4 font-weight-bold">
          {{ bottomText }}
        </div>
      </div>
    </v-img>
  </v-sheet>
</template>

<script>
import { mapState } from "vuex"
import MoreInfoBtn from "@/components/landing-page/MoreInfoBtn.vue"
import LoginBtn from "./LoginBtn.vue"

export default {
  name: "HeroSection",
  components: { MoreInfoBtn, LoginBtn },
  props: {
    bgImage: { type: String },
    title: { type: String }, // Keeping for backward compatibility
    description: { type: String }, // Keeping for backward compatibility
    hideInfoBtn: { type: Boolean, default: false },
    loginText: { type: String },
    path: { type: String, default: "/" },
    logo: { type: String },
    logoTwo: { type: String },
    topText: { type: String, default: "Modern Digital Solutions" },
    bottomText: { type: String, default: "Ordon Soft" },
    services: { type: Array, default: () => [] }
  },
  computed: {
    ...mapState(["isRTL"])
  }
}
</script>

<style scoped>
/* Hero container takes remaining viewport height after navbar */
.hero-container {
  height: v-bind(heroHeight);
  margin-top: v-bind("`-${navbarHeight}px`");
  position: relative;
}

.hero-image {
  height: 100%;
}

.logo-container {
  position: absolute;
  top: 24px;
  /* top: v-bind("`${navbarHeight + 16}px`"); */
  z-index: 1;
}

.left {
  left: 16px;
}

.right {
  right: 16px;
}

/* Top text positioning */
.top-text {
  position: absolute;
  top: 32px;
  /* top: v-bind("`${navbarHeight + 24}px`"); */
  z-index: 1;
}

.top-text.right {
  right: 32px; /* Account for logo space */
}

.top-text.left {
  left: 32px; /* Account for logo space */
}

/* Services container */
.services-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  max-width: 400px;
  z-index: 1;
}

.services-left {
  left: 32px;
}

.services-right {
  right: 32px;
  text-align: right;
}

.service-item {
  margin-bottom: 32px;
}

.service-item:last-child {
  margin-bottom: 0;
}

.service-title {
  margin-bottom: 8px;
  line-height: 1.2;
}

.service-text {
  line-height: 1.4;
  opacity: 0.9;
}

/* Bottom text positioning */
.bottom-text {
  position: absolute;
  bottom: 200px;
  z-index: 1;
}

.bottom-text.right {
  right: 32px;
}

.bottom-text.left {
  left: 32px;
}

/* RTL specific adjustments */
.services-right .service-item {
  text-align: right;
}

.services-left .service-item {
  text-align: left;
}
</style>
