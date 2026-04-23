<template>
  <div class="status-picker">
    <v-menu v-model="menu" :close-on-content-click="false" offset-y :disabled="btnDisabled">
      <template v-slot:activator="{ on, attrs }">
        <div
          class="custom-status-btn"
          :class="{ disabled: btnDisabled }"
          v-bind="btnDisabled ? {} : attrs"
          v-on="btnDisabled ? {} : on"
          :style="{
            backgroundColor: computedBtnColor,
            color: textColor,
            cursor: btnDisabled ? '' : 'pointer'
          }"
        >
          <div class="btn-content">
            <span class="text-caption">{{ selectedText }}</span>
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="16"
              width="2"
              color="white"
              class="ml-2"
            ></v-progress-circular>

            <!-- Edit icon with smooth transition -->
            <v-icon v-if="!btnDisabled && !loading" x-small class="edit-icon" :color="textColor">mdi-pencil</v-icon>
          </div>
        </div>
      </template>

      <v-list dense>
        <v-list-item v-for="option in options" :key="option.id" @click="selectOption(option)" :disabled="loading">
          <v-list-item-title>{{ option.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { colorUtils } from "../../mixins/colorUtils"

export default {
  name: "StatusPicker",
  mixins: [colorUtils],
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array,
      default: () => []
    },
    selectedText: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    btnDisabled: {
      type: Boolean,
      default: false
    },
    btnColor: {
      type: String
    }
  },

  data() {
    return {
      menu: false
    }
  },
  computed: {
    computedBtnColor() {
      // If it's a Vuetify theme color
      if (this.btnColor && this.$vuetify.theme.themes.light[this.btnColor]) {
        return this.$vuetify.theme.themes.light[this.btnColor]
      }
      // If it's a direct color value or fallback to grey
      return this.btnColor || "grey"
    },
    textColor() {
      return this.getTextColorForBackground(this.computedBtnColor)
    }
  },

  methods: {
    selectOption(option) {
      this.$emit("input", option.id)
      this.$emit("change", option)
      this.menu = false
    }
  }
}
</script>

<style scoped>
.status-picker {
  display: inline-block;
}

.custom-status-btn {
  min-width: 100px;
  padding: 2px 8px;
  border-radius: 12px;
  text-wrap: nowrap;
  transition: all 0.3s ease;
  user-select: none;
}

.custom-status-btn:not(.disabled):hover {
  filter: brightness(1.1);
}

.custom-status-btn.disabled {
  opacity: 0.7;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  /* min-height: 24px; Matches small button height */
  transition: padding 0.3s ease;
}

/* Edit icon styling */
.edit-icon {
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  margin-left: 0;
  transition: all 0.3s ease;
}

.custom-status-btn:not(.disabled):hover .edit-icon {
  max-width: 20px; /* Allow space for the icon to show */
  opacity: 1;
  margin-left: 4px;
}

/* Transition for the button padding */
.custom-status-btn:not(.disabled) .btn-content {
  padding-right: 0;
}

.custom-status-btn:not(.disabled):hover .btn-content {
  padding-right: 4px;
}
</style>
