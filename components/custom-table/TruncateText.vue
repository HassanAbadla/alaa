<template>
  <div class="truncate-container">
    <div
      class="text-wrapper"
      :class="{
        expanded: showAll,
        rtl: isRTL,
        'truncated-text': !showAll && shouldTruncate
      }"
      :style="wrapperStyles"
    >
      <div class="content" v-html="text"></div>

      <v-tooltip bottom v-if="shouldTruncate">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            outlined
            icon
            x-small
            color="secondary"
            @click.stop="toggleShowAll"
            class="toggle-btn"
            :class="{ rtl: isRTL }"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small :class="{ rotated: showAll }">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <span>{{ showAll ? $t("page.minimize") : $t("page.expand") }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import SmallText from "./SmallText.vue"

export default {
  components: { SmallText },
  name: "TruncateText",
  props: {
    text: {
      type: String,
      required: true
    },
    maxLength: {
      type: Number,
      default: 100
    },
    maxHeight: {
      type: Number,
      default: 40
    }
  },

  data() {
    return {
      showAll: false,
      fullHeight: 0,
      isOverflowing: false
    }
  },

  computed: {
    ...mapState(["isRTL"]),

    shouldTruncate() {
      return this.text.length > this.maxLength || this.isOverflowing
    },

    wrapperStyles() {
      return {
        maxHeight: this.showAll ? "none" : `${this.maxHeight}px`,
        paddingRight: this.isRTL ? "0" : "28px",
        paddingLeft: this.isRTL ? "28px" : "0"
      }
    }
  },

  methods: {
    toggleShowAll() {
      this.showAll = !this.showAll
    },

    checkOverflow() {
      this.$nextTick(() => {
        const wrapper = this.$el.querySelector(".text-wrapper")
        const content = this.$el.querySelector(".content")
        if (wrapper && content) {
          // Reset max-height temporarily to get true height
          const originalMaxHeight = wrapper.style.maxHeight
          wrapper.style.maxHeight = "none"

          // Get the full height of the content
          this.fullHeight = content.scrollHeight
          this.isOverflowing = this.fullHeight > this.maxHeight

          // Restore original max-height
          wrapper.style.maxHeight = originalMaxHeight
        }
      })
    }
  },

  mounted() {
    this.checkOverflow()
    // Add resize listener to handle window resizing
    window.addEventListener("resize", this.checkOverflow)
  },

  beforeDestroy() {
    // Clean up resize listener
    window.removeEventListener("resize", this.checkOverflow)
  },

  watch: {
    text() {
      this.checkOverflow()
    },
    maxHeight() {
      this.checkOverflow()
    }
  }
}
</script>

<style scoped>
.truncate-container {
  position: relative;
  width: 100%;
  min-width: 0;
}

.text-wrapper {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  min-width: 0;
}

.text-wrapper.expanded {
  max-height: none !important;
}

.content {
  width: 100%;
  min-width: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  margin-bottom: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.truncated-text:not(.expanded) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-btn {
  position: absolute;
  right: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 !important;
  opacity: 0.7;
  height: 20px !important;
  width: 20px !important;
  /* background: white; */
  z-index: 1;
}

/* Center position when not expanded */
.text-wrapper:not(.expanded) .toggle-btn {
  top: 50%;
  transform: translateY(-50%);
}

/* Bottom position when expanded */
.text-wrapper.expanded .toggle-btn {
  bottom: 4px;
  top: auto;
  transform: none;
}

.toggle-btn.rtl {
  right: auto;
  left: 4px;
}

.toggle-btn:hover {
  opacity: 1;
}

.toggle-btn::before {
  opacity: 0 !important;
}

.v-icon.rotated {
  transform: rotate(180deg);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px !important;
}

/* Add fade effect at the bottom when truncated */
.truncated-text:not(.expanded)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  pointer-events: none;
}

/* RTL support for fade effect */
.truncated-text.rtl:not(.expanded)::after {
  /* background: linear-gradient(to bottom, transparent, white); */
}
</style>
