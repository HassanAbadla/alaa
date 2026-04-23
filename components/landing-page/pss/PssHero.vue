<template>
  <div class="hero-section">
    <v-img
      src="/landing.jpeg"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.4)"
      class="fill-height position-relative"
      :style="rotateBg"
    >
      <div class="fill-height" :style="contentStyle">
        <div class="logo pt-4">
          <!-- <login-btn :text="loginText" /> -->
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
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-img>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "PssHero",
  data() {
    return {
      title: "PSS",
      descriptions: []
    }
  },
  computed: {
    ...mapState(["isRTL"]),

    rotateBg() {
      return {}
      // const isGrcRoute = this.$route.path === "/grc"
      // return this.isRTL && isGrcRoute ? { transform: "scaleX(-1)" } : {}
    },
    contentStyle() {
      return {}
      // const isGrcRoute = this.$route.path === "/grc"
      // return this.isRTL && isGrcRoute ? { transform: "scaleX(-1)" } : {}
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
  /* width: 100%; */
  flex-direction: row;
  display: flex;
  justify-content: center;
}
</style>
