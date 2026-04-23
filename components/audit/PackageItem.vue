<template>
  <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap primary--text text--darken-2">
    <v-col>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div class="white--text text--darken-2" v-bind="attrs" v-on="on">
            {{ truncateText(item?.compliance_package?.short_name, 20) }}
          </div>
          <!-- <div class="caption font-weight-light font-italic">
            {{ truncateText(item?.compliance_package?.short_name, 20) }}
          </div> -->
        </template>
        <span>{{ item?.compliance_package?.name || `Package id: ${item?.compliance_package?.id}` }}</span>
      </v-tooltip>
    </v-col>
    <v-col cols="auto">
      <v-can :permission="'create_audit_round'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="tertiary"
              x-small
              @click.stop="openCreateRoundDialog"
              :loading="loadingStates[`create_${item?.compliance_package?.id}`]"
              :disabled="loadingStates[`create_${item?.compliance_package?.id}`] || item.parentClosed"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("page.add_round") }}</span>
        </v-tooltip>
      </v-can>
    </v-col>
  </v-row>
</template>

<script>
import { truncateText } from "@/helpers/misc"
import VCan from "../VCan.vue"

export default {
  components: { VCan },
  name: "PackageItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    isCreatingRound: {
      type: Boolean,
      default: false
    },
    loadingStates: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    truncateText,
    openCreateRoundDialog() {
      this.$emit("open-create-round-dialog", {
        subscriptionId: this.item.subscription_id,
        packageId: this.item.compliance_package.id
      })
    }
  }
}
</script>
