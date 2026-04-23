<template>
  <div class="hero-section">
    <v-img
      :src="require(`@/static/hero-backgrounds/${bgImage}`)"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.4)"
      class="fill-height position-relative"
      :style="rotateBg"
    >
      <div class="fill-height" :style="contentStyle">
        <div v-if="$config.buildTarget !== 'zain'" class="logo pt-4" :class="isRTL ? 'logo--right' : 'logo--left'">
          <logo :max-width="320" :max-height="220" />
        </div>
        <v-container class="fill-height" fluid>
          <v-row justify="end" no-gutters class="fill-height pb-2">
            <v-col cols="12" md="8" class="d-flex flex-column justify-space-between">
              <!-- Title at the top, more to the left -->
              <v-row justify="end" align="center" class="mb-10">
                <v-col cols="12" md="8" lg="6" xl="4" class="pl-md-4">
                  <!-- <h1 class="white--text text-h2 font-weight-bold">{{ title }}</h1> -->
                </v-col>
              </v-row>

              <!-- Descriptions at the bottom, side by side -->
              <!-- <v-row justify="center" align="end" class="mb-8 pr-4">
                <v-col cols="12">
                  <v-row no-gutters justify="center" class="description-row">
                    <v-col
                      v-for="(description, index) in descriptions"
                      :key="index"
                      :cols="12 / descriptions.length"
                      class="px-1"
                    >
                      <v-sheet
                        color="primary"
                        rounded
                        class="pa-3 description-sheet d-flex align-center justify-center"
                      >
                        <p class="white--text mb-0 text-center font-weight-bold">{{ $t(description) }}</p>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row> -->
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-img>
  </div>
</template>

<script>
import { mapState } from "vuex"
import LoginBtn from "./LoginBtn.vue"
import Logo from "./Logo.vue"
export default {
  components: { LoginBtn, Logo },
  name: "HeroSectionSingle",
  props: {
    bgImage: { type: String, required: true },
    title: { type: String, required: true },
    loginText: { type: String },
    descriptions: { type: Array, required: true }
  },
  computed: {
    ...mapState(["isRTL"]),

    rotateBg() {
      return {}
      const isGrcRoute = this.$route.path === "/grc"
      return this.isRTL && isGrcRoute ? { transform: "scaleX(-1)" } : {}
    },
    contentStyle() {
      return {}
      const isGrcRoute = this.$route.path === "/grc"
      return this.isRTL && isGrcRoute ? { transform: "scaleX(-1)" } : {}
      // return this.$store.state.language === "ar" ? { transform: "scaleX(-1)" } : {}
    }
  }
}
</script>

<style scoped>
.hero-section {
  height: 100vh;
  margin-top: calc(-64px);
  padding-top: 64px;
  position: relative;
  z-index: 0;
}

.position-relative {
  position: relative;
}

.description-sheet {
  height: 100%;
}

.description-row {
  max-width: 90vw;
  margin: 0 auto;
}
.logo {
  position: absolute;
  top: 16px;
  z-index: 1;
}
.logo--left {
  left: 24px;
}
.logo--right {
  right: 24px;
}
</style>
