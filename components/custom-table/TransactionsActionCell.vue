<template>
  <div class="d-flex align-center">
    <v-tooltip v-if="showAdd" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn small icon @click="openTransactionForm" v-bind="attrs" v-on="on">
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
          @click="openTransactionList"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-swap-horizontal</v-icon>
          <span>{{ transationsCount ?? 0 }}</span>
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
  name: "AttachmentActionsCell",
  props: {
    transationsCount: {
      type: Number,
      default: 0
    },
    showAdd: { type: Boolean, default: true },
    permissions: { type: Object }
  },
  methods: {
    openTransactionList() {
      this.$emit("open-transation-list")
    },
    openTransactionForm() {
      this.$emit("open-transation-form")
    }
  }
}
</script>
