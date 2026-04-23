<template>
  <div class="d-flex align-center">
    <v-tooltip v-if="showAdd" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn small icon @click="openCreatePolicyItemForm" v-bind="attrs" v-on="on">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("table.add") }}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          icon
          class="d-flex align-center justify-center"
          @click="openPolicyItemsList"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-sitemap-outline</v-icon>
          <span>{{ itemsCount ?? 0 }}</span>
        </v-btn>
      </template>
      <span>{{ $t("table.view") }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import VCan from "../VCan.vue"
export default {
  components: { VCan },
  name: "PolicyItemsActionCell",
  props: {
    itemsCount: {
      type: Number,
      default: 0
    },
    showAdd: { type: Boolean, default: true },
    permissions: { type: Object }
  },
  methods: {
    openPolicyItemsList() {
      this.$emit("open-items-list")
    },
    openCreatePolicyItemForm() {
      this.$emit("open-items-form")
    }
  }
}
</script>
