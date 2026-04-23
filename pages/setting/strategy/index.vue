<template>
  <div class="table-page-wrapper">
    <div class="px-4">
      <StrategyPerspectives />
    </div>
  </div>
</template>

<script>
import StrategyPerspectives from "@/components/tables/StrategyPerspectives.vue"
import { layoutPicker } from "../../../helpers/auth"

export default {
  name: "StrategySettings",
  components: { StrategyPerspectives },
  middleware: ["auth"],
  layout: "dashboard-layout",
  data() {
    return {
      tab: null,
      items: [{ tab: this.$t("table.perspective") }]
    }
  }
}
</script>
