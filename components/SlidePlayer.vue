<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon color="red lighten-2" dark v-bind="attrs" v-on="on">
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </template>
    <v-toolbar flat>
      <v-spacer />
      <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-responsive :aspect-ratio="16 / 9" @click="nextSlide">
      <v-card style="'overflow: hidden;" outlined width="100%" height="100%" color="white">
        <v-tooltip bottom v-for="(layer, i) in layers">
          <template v-slot:activator="{ on, attr }">
            <v-card
              v-on="on"
              v-bind="attr"
              :key="i"
              :style="
                'animation-duration:' +
                layer.duration +
                's;' +
                'z-index:' +
                layer.z_index +
                ';position: absolute;top:' +
                layer.top +
                'px;left: ' +
                layer.left +
                'px;'
              "
              :class="'animate__animated ' + layer.animation"
              :height="layer.height"
              :width="layer.width"
              :color="layer.color"
            >
              <v-card-text v-if="layer.type == 'content'">
                <div v-html="layer.content" v-if="layer.type == 'content'"></div>
              </v-card-text>
              <div v-if="layer.type == 'video'">
                <video
                  v-if="layer.videoPreview || layer.video"
                  id="video-preview"
                  :src="layer.video"
                  :width="layer.width"
                  :height="layer.height"
                  controls
                  v-show="file != ''"
                />
              </div>
              <div v-if="layer.type == 'image'">
                <v-img
                  v-if="layer.imagePreview || layer.image"
                  :src="layer.image"
                  :width="layer.width"
                  :height="layer.height"
                />
              </div>
            </v-card>
          </template>
          <span>{{ layer.title }}</span>
        </v-tooltip>
      </v-card>
    </v-responsive>
  </v-dialog>
</template>

<script>
export default {
  name: "SlidePlayer",
  props: ["slideLayers"],
  data() {
    return {
      dialog: false,
      layers: [],
      selectedSlide: 0,
      selectedContent: 0
    }
  },
  mounted() {
    this.nextSlide()
  },
  methods: {
    nextSlide() {
      // TODO set time to show int val
      if (this.slideLayers[this.selectedSlide]) {
        if (this.slideLayers[this.selectedSlide].contents[this.selectedContent]) {
          this.layers.push(this.slideLayers[this.selectedSlide].contents[this.selectedContent])
          this.selectedContent++
          console.log(this.slideLayers[this.selectedSlide].contents[this.selectedContent])
          if (
            this.slideLayers[this.selectedSlide].contents[this.selectedContent] &&
            this.slideLayers[this.selectedSlide].contents[this.selectedContent].slideType == "auto"
          ) {
            setTimeout(() => {
              this.nextSlide()
            }, this.slideLayers[this.selectedSlide].delay * 1000)
          }
        } else {
          this.selectedSlide++
          this.selectedContent = 0
        }
      }
    },
    nextContent() {},
    repeat() {
      this.layers = []
      this.nextSlide()
    }
  }
}
</script>

<style scoped></style>
