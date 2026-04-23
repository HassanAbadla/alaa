<template>
  <div>
    <v-autocomplete
      v-model="selectedUsers"
      :items="availableUsers"
      item-text="full_name"
      item-value="id"
      :label="computedLable"
      multiple
      chips
      dense
      :clearable="clearable"
      :disabled="disabled"
      :outlined="outlined"
      :append-outer-icon="fieldInfoText ? 'mdi-information-outline' : undefined"
      @click:append-outer="openInfoDialog"
      @input="updateSelected"
    >
      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip small v-bind="attrs" :input-value="selected" @click="select" class="my-0 py-0">
          <span>{{ item.full_name }}</span>
        </v-chip>
      </template>
    </v-autocomplete>

    <custom-dialog v-model="showInfoDialog" :title="label" width="400px">
      <div class="pa-4" v-html="fieldInfoText"></div>
    </custom-dialog>
  </div>
</template>

<script>
export default {
  name: "UserSelector",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    availableUsers: {
      type: Array,
      required: true
    },
    label: {
      type: String
    },
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    outlined: {
      type: Boolean,
      default: true
    },
    fieldInfoText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectedUsers: [],
      showInfoDialog: false
    }
  },
  computed: {
    computedLable() {
      return this.label || this.$t("page.selected_users")
    }
  },
  methods: {
    updateSelected() {
      this.$emit("input", this.selectedUsers)
    },
    remove(item) {
      const index = this.selectedUsers.findIndex((user) => user.id === item.id)
      if (index >= 0) {
        this.selectedUsers.splice(index, 1)
        this.updateSelected()
      }
    },
    openInfoDialog() {
      if (this.fieldInfoText) {
        this.showInfoDialog = true
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.selectedUsers = newValue
      }
    }
  }
}
</script>

<style scoped>
:deep(.v-select__selections) {
  min-height: 0px !important;
}
</style>
