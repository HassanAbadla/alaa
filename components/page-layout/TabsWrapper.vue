<template>
  <div class="tabs-wrapper">
    <v-tabs v-model="activeTab">
      <v-tab v-for="tab in tabs" :key="tab.slotName" :disabled="!clickableTabs">
        {{ $t(tab.name) }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="tab in tabs" :key="tab.slotName">
        <slot :name="tab.slotName"></slot>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "TabsWrapper",
  props: {
    tabs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every((tab) => typeof tab === "object" && "name" in tab && "slotName" in tab)
      }
    },
    clickableTabs: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeTab: 0
    }
  }
}
</script>

<style scoped>
.tabs-wrapper {
  width: 100%;
}
</style>
