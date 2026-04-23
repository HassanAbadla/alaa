<template>
  <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap primary--text text--darken-2">
    <v-col>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="primary--text text--darken-2" v-bind="attrs" v-on="on">
            {{ item?.code }} - {{ item?.version }}
          </span>
        </template>
        <span>{{ $t("page.policy") }}</span>
      </v-tooltip>
    </v-col>
    <v-col cols="auto">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="warning" x-small @click.stop="createPolicyItem" v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("page.add_policy_item") }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import { truncateText } from "@/helpers/misc"

export default {
  name: "PoliciesTree",
  props: {
    item: {
      type: Object,
      required: true
    },
    loadingStates: {
      type: Object,
      required: true
    }
  },
  methods: {
    createPolicyItem() {
      this.$emit("create-policy-item", this.item)
    },
    truncateText
  }
}
</script>
