<template>
  <div>
    <v-autocomplete
      v-model="selectedAssets"
      :items="availableAssets"
      item-text="name"
      item-value="id"
      :label="computedLable"
      multiple
      x-chips
      :clearable="clearable"
      :disabled="disabled"
      @input="updateSelected"
      :loading="loading"
    >
      <!-- Prepend item slot for select/deselect all buttons -->
      <template v-slot:prepend-item v-if="showSelectAllControls">
        <v-list-item ripple @click="selectAll">
          <v-list-item-action>
            <v-icon>mdi-checkbox-marked</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Select All</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item ripple @click="deselectAll">
          <v-list-item-action>
            <v-icon>mdi-checkbox-blank-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Deselect All</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>

      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip v-bind="attrs" :input-value="selected" @click="select" small>
          <span>{{ item.name }}</span>
        </v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  name: "AssetSelector",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    availableAssets: {
      type: Array,
      required: true
    },
    label: {
      type: String
    },
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    showSelectAllControls: { type: Boolean, default: false } // New prop
  },
  data() {
    return {
      selectedAssets: []
    }
  },
  computed: {
    computedLable() {
      return this.label || this.$t("page.select_asset")
    }
  },
  methods: {
    updateSelected() {
      this.$emit("input", this.selectedAssets)
    },
    remove(item) {
      const index = this.selectedAssets.findIndex((user) => user.id === item.id)
      if (index >= 0) {
        this.selectedAssets.splice(index, 1)
        this.updateSelected()
      }
    },
    selectAll() {
      this.selectedAssets = this.availableAssets.map((asset) => asset.id)
      this.updateSelected()
    },
    deselectAll() {
      this.selectedAssets = []
      this.updateSelected()
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.selectedAssets = newValue
      }
    }
  }
}
</script>
