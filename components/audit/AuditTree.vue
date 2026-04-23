<template>
  <div>
    <!-- Added :open and @update:open bindings to control open state -->
    <v-treeview
      v-if="!loadingAudits"
      :items="computedTreeItems"
      :open="openItems"
      @update:open="updateOpen"
      open-on-click
      activatable
      item-key="id"
      class="px-0"
    >
      <template v-slot:label="{ item }">
        <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap">
          <template v-if="item.level === 'subscription'">
            <subscription-item
              :item="item"
              :loading-states="loadingStates"
              @update-note="updateNote"
              @toggle-status="toggleSubscriptionStatus"
            />
          </template>
          <template v-else-if="item.level === 'package'">
            <package-item
              :item="item"
              :isCreatingRound="isCreatingRound"
              :loading-states="loadingStates"
              @open-create-round-dialog="openCreateRoundDialog"
            />
          </template>
          <template v-else>
            <round-item
              :item="item"
              :loading-states="loadingStates"
              @update-note="updateNoteRound"
              @toggle-status="toggleRoundStatus"
            />
          </template>
        </v-row>
      </template>
    </v-treeview>
    <v-progress-circular v-else indeterminate color="primary" size="16" width="2" class="mx-4 d-block" />
    <!-- TPS Form Dialog -->
    <custom-dialog
      v-model="tpsFormDialog"
      :title="$t('form.assign_task')"
      width="580px"
      @close-dialog="handleCloseDialog"
    >
      <TPSTaskForm
        ref="tpsTaskForm"
        :item="selectedItem || {}"
        :taskable_type="'audit'"
        :taskable_id="selectedItem?.id ?? null"
        :assignedTo="assignedTo"
        @close="tpsFormDialog = false"
      />
    </custom-dialog>
    <!-- Create Round Dialog -->
    <custom-dialog
      v-model="createRoundDialogIsOpen"
      :title="$t('page.add_round')"
      width="400px"
      @close-dialog="createRoundDialogIsOpen = false"
    >
      <form-wrapper :title="$t('page.set_round_due_date_message')" @submit="newRound" :loading="isCreatingRound">
        <custom-date-picker v-model="fields.dueDate" required :label="$t('table.due_date')" />
      </form-wrapper>
    </custom-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import SubscriptionItem from "./SubscriptionItem.vue"
import PackageItem from "./PackageItem.vue"
import RoundItem from "./RoundItem.vue"
import TPSTaskForm from "@/components/TPSTaskForm.vue"

export default {
  name: "AuditTree",
  components: {
    SubscriptionItem,
    PackageItem,
    RoundItem,
    TPSTaskForm
  },
  // Added data property to track open items
  data() {
    return {
      openItems: [],
      tpsFormDialog: false,
      selectedItem: {},
      assignedTo: {},
      isCreatingRound: false,
      createRoundDialogIsOpen: false,
      fields: {
        subscriptionId: null,
        packageId: null,
        dueDate: null
      }
    }
  },
  computed: {
    ...mapGetters("audits", ["computedTreeItems", "loadingAudits", "loadingStates"])
  },
  mounted() {
    this.fetchAudits()
  },
  methods: {
    ...mapActions("audits", [
      "fetchAudits",
      "createRound",
      "toggleRoundStatus",
      "toggleSubscriptionStatus",
      "updateSubscriptionNote",
      "updateRoundNote"
    ]),
    // Added new method to handle open state updates
    updateOpen(newOpenItems) {
      // Find newly opened items by comparing with current open items
      const newlyOpenedItems = newOpenItems.filter((id) => !this.openItems.includes(id))

      // Check each newly opened item
      for (const newItemId of newlyOpenedItems) {
        // Find the subscription item in the tree
        const subscription = this.computedTreeItems.find((item) => item.id === newItemId)

        // If it's a subscription and has children (packages)
        if (subscription?.level === "subscription" && subscription.children?.length > 0) {
          // Get the first package
          const firstPackage = subscription.children[0]
          // If the package exists and isn't already open, add it to open items
          if (firstPackage && !newOpenItems.includes(firstPackage.id)) {
            newOpenItems.push(firstPackage.id)
          }
        }
      }

      // Update the open items state
      this.openItems = newOpenItems
    },
    updateNote(subscriptionId, payload) {
      this.updateSubscriptionNote({ subscriptionId, note: payload.note })
    },
    updateNoteRound(roundId, payload) {
      const round = this.findRound(roundId)
      if (round) {
        this.updateRoundNote({
          subscriptionId: round.subscriptionId,
          auditContractId: round.auditContractId,
          roundId: round.id,
          note: payload?.note
        })
      }
    },
    findRound(roundId) {
      for (const subscription of this.computedTreeItems) {
        for (const contract of subscription.children) {
          const round = contract.children.find((r) => r.id === roundId)
          if (round) {
            return {
              ...round,
              subscriptionId: subscription.id,
              auditContractId: contract.id
            }
          }
        }
      }
      return null
    },
    openCreateRoundDialog(payload) {
      this.createRoundDialogIsOpen = true
      this.fields = { ...this.fields, ...payload }
    },
    async newRound() {
      console.log("FIELDS", this.fields)
      this.isCreatingRound = true
      const response = await this.createRound(this.fields)
      this.isCreatingRound = false

      if (response?.status === "success") {
        this.createRoundDialogIsOpen = false
        this.selectedItem = response.data
        this.assignedTo = response.data.user
        this.tpsFormDialog = true
      }
    },
    handleCloseDialog() {
      // Set the dialog to false
      this.tpsFormDialog = false

      // Call method on child component to reset showAssignTaskForm
      if (this.$refs.tpsTaskForm) {
        this.$refs.tpsTaskForm.resetAssignTaskForm()
      }
    }
  }
}
</script>
<style scoped>
.active-node {
  background-color: #cbaee4; /* Change the background color as needed */
}
.v-application a {
  color: inherit;
}
.v-treeview-node__root {
  min-height: 20px;
}
.v-treeview-node__content {
  min-height: 20px;
}
.treeview {
  width: 300px;
}
.v-treeview-node__label {
  font-size: 13px;
}
::v-deep .v-treeview-node__toggle.mdi {
  color: white !important;
}
</style>
