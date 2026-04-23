<template>
  <v-can show-message :permission="'access_risk_consequences'">
    <v-container fluid>
      <v-card flat>
        <v-card-text class="pt-0">
          <custom-table
            :title="title"
            :propItems="riskConsequences"
            :propLoading="loading"
            :headers="headers"
            :tableConfig="tableConfig"
            hideView
            :sortOnLoad="false"
            show-back-btn
            :back-btn-tooltip="backBtnTooltip"
            :back-btn-path="backBtnPath"
          >
            <template v-slot:item.notes="{ item }">
              <editable-note-form
                :note="item.note"
                :title="item?.code"
                :item-id="item.id"
                :loading="item.isUpdating"
                :disable-edit="true"
                :disable-icon="false"
                iconSize="large"
              />
            </template>
          </custom-table>
        </v-card-text>
      </v-card>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapActions } from "vuex"
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import DynamicBackNavigation from "@/mixins/dynamicBackNavigation"

export default {
  components: { EditableNoteForm },
  mixins: [DynamicBackNavigation],
  name: "RiskConsequencesPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  data() {
    return {
      headers: [
        { text: "table.name", value: "code", sortable: false },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.actions", value: "actions", sortable: false }
      ],
      tableConfig: {
        delete: this.deleteConsequence,
        itemPath: `/grc/risk-register/${this.riskId()}/consequences`,
        createForm: {
          componentPath: "forms/RiskConsequenceForm"
        },
        editForm: {
          componentPath: "forms/RiskConsequenceForm",
          props: { editForm: true }
        },
        permissions: {
          create: "create_risk_consequence",
          edit: "edit_risk_consequence",
          delete: "delete_risk_consequence"
        }
      },
      // Override mixin default back path if needed
      defaultBackPath: "/grc/risk-register"
    }
  },
  computed: {
    ...mapState("riskConsequences", ["riskConsequences", "risk", "loading", "error"]),

    // Define entity type for the mixin
    entityType() {
      return "consequences"
    },

    title() {
      // Assuming you store the risk name in the store or fetch it separately
      const riskName = this.risk?.name || ""
      return `${this.$t("form.risk_consequence")} - ${riskName}`
    }
  },
  methods: {
    ...mapActions("riskConsequences", ["fetchRiskConsequences", "deleteRiskConsequence"]),
    riskId() {
      return this.$route.params.id
    },
    deleteConsequence(id) {
      return this.deleteRiskConsequence(id)
    }
  },
  mounted() {
    this.fetchRiskConsequences(this.riskId())
  }
}
</script>
