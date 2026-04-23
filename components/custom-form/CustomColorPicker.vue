<template>
  <div class="custom-color-picker">
    <v-menu
      bottom
      origin="center center"
      transition="scale-transition"
      :close-on-content-click="false"
      v-model="menuOpen"
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="color_field">
          <p class="my-0" v-if="label">{{ label }}:</p>
          <p class="mx-2 my-0">{{ value || placeholder }}</p>
          <div :style="swatchStyle" v-bind="attrs" v-on="on" class="color-swatch"></div>
        </div>
      </template>
      <v-card>
        <v-card-text>
          <v-color-picker
            :value="value || defaultColor"
            @input="updateColor"
            mode="hexa"
            hide-sliders
            show-swatches
            class="mx-auto"
          ></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="clearColor" v-if="allowClear">{{ $t("page.clear") }}</v-btn>
          <v-btn text @click="menuOpen = false">{{ $t("page.close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <!-- Error display -->
    <div v-if="errors && errors.length" class="error--text caption mt-1">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomColorPicker",
  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "Color"
    },
    placeholder: {
      type: String
    },
    defaultColor: {
      type: String,
      default: "#1976D2"
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    errors: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuOpen: false
    }
  },
  computed: {
    swatchStyle() {
      return {
        backgroundColor: this.value || "#e0e0e0",
        width: "30px",
        height: "30px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        cursor: "pointer",
        display: "inline-block"
      }
    }
  },
  methods: {
    updateColor(color) {
      this.$emit("input", color)
    },
    clearColor() {
      this.$emit("input", "")
      this.menuOpen = false
    }
  }
}
</script>

<style scoped>
.color_field {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.color-swatch {
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.custom-color-picker {
  margin-bottom: 16px;
}
</style>
