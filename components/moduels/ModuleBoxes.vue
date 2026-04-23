<template>
  <div class="d-flex flex-wrap align-center">
    <module-box
      v-for="module in modules"
      :key="module.id"
      :module="module"
      :selectedModule="selectedModule"
      @select-module="selectModule"
    />
  </div>
</template>

<script>
import ModuleBox from "./ModuleBox.vue"
export default {
  components: { ModuleBox },
  name: "ModuleBoxes",

  props: {
    modules: {
      type: Array,
      default: () => []
    },
    selectedModule: {
      type: Object,
      default: null
    }
  },

  methods: {
    selectModule(module) {
      this.$emit("select-module", module)
    }
  }
}
</script>
