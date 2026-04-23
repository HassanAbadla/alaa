<template>
  <v-treeview :items="policies" activatable item-key="id" class="px-0">
    <template v-slot:label="{ item }">
      <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap">
        <PoliciesTree :item="item" @create-policy-item="createPolicyItem" />
      </v-row>
    </template>
  </v-treeview>
</template>

<script>
import { mapState, mapActions } from "vuex"
import PoliciesTree from "./PoliciesTree.vue"
export default {
  name: "PolicyTree",
  components: { PoliciesTree },
  methods: {
    ...mapActions("drawer", ["openDrawer"]),
    createPolicyItem(policy) {
      console.log(policy)
      this.openDrawer({
        component: "forms/PolicyItemForm",
        props: {
          item: policy,
          editForm: true
        },
        title: policy.code,
        width: 700
      })
    }
  },

  computed: {
    ...mapState("policy", ["policies"])
  }
}
</script>
