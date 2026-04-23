<template>
  <v-can show-message :permission="'view_contract'">
    <v-container>
      <v-layout column>
        <v-card flat v-if="contract">
          <v-card-title>{{ contract?.name }}</v-card-title>
          <v-card-text>
            <label-value-display :label="$t('page.start_date')" :value="contract?.start_date" />
            <label-value-display :label="$t('page.end_date')" :value="contract?.end_date" />
            <label-value-display :label="$t('page.company')" :value="contract?.company?.name" />
            <label-value-display :label="$t('table.status')" :value="contract?.status?.name" />
            <label-value-display :label="$t('page.disipline')" :value="contract?.disipline?.name" />
            <label-value-display :label="$t('page.type')" :value="contract?.type?.name" />
            <v-subheader>{{ $t("page.user_access") }}</v-subheader>
            <ul>
              <li v-for="user in contract.master_access" :key="user.id">
                {{ user?.user }} ({{ user?.full_access ? "Full" : "Partial" }})
              </li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <action-btns :permissions="{ edit: 'edit_contract' }" @edit="editContract" />
            <!-- <v-card-actions>
              <v-btn nuxt :to="localePath(`/projects/${projectId}/contracts/${contractId}/edit`)" color="primary">
                {{ $t("page.edit") }}
              </v-btn>
            </v-card-actions> -->
            <v-can :permission="'access_pmis_checklists'">
              <v-btn class="mx-1" color="secondary" @click="handleChecklistsClick">
                {{ $t("page.checklists") }}
              </v-btn>
            </v-can>
            <v-can :permission="'view_manage_pmis_checklists'">
              <v-btn
                class="mx-1"
                color="warning"
                nuxt
                :to="localePath(`/projects/${projectId}/contracts/${contractId}/checklists/manage`)"
              >
                {{ `${$t("page.manage")} ${$t("page.stages")}` }}
              </v-btn>
            </v-can>
          </v-card-actions>
        </v-card>
        <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
      </v-layout>

      <custom-dialog v-model="showDialog" :title="$t('page.create')" width="600px">
        <v-card-title primary-title>{{ methodologyTitle }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-can disable-only :permission="'create_ordon_checklist'">
            <template #default="{ disabled }">
              <v-btn
                v-if="projectId"
                :disabled="disabled"
                nuxt
                :to="localePath(`/projects/${projectId}/contracts/${contractId}/checklists/create`)"
                color="success"
              >
                {{ $t("page.create") }}
              </v-btn>
            </template>
          </v-can>
        </v-card-actions>
      </custom-dialog>
    </v-container>
  </v-can>
</template>

<script>
import { getContractByIdAndProjectId } from "@/api/projects-api"
import LabelValueDisplay from "@/components/display-page/LabelValueDisplay.vue"
import { generateErrorMessage } from "@/helpers/error-helpers.js"
import { mapActions, mapGetters } from "vuex"
import ActionBtns from "../display-page/ActionBtns.vue"
import VCan from "../VCan.vue"

export default {
  name: "ContractShowPage",

  components: {
    LabelValueDisplay,
    ActionBtns,
    VCan
  },
  data() {
    return {
      contract: null,
      error: null,
      loading: false,
      contractId: this.$route.params.contract_id,
      showDialog: false
    }
  },
  computed: {
    ...mapGetters("projectChecklist", ["getProjectChecklist"]),
    projectId() {
      return this.contract?.project?.id
    },
    methodologyTitle() {
      return this.$t("page.no_ordon_checklists", { name: this.contract?.project?.methodology?.name })
    }
  },
  methods: {
    ...mapActions("projectChecklist", ["fetchProjectChecklist"]),
    editContract() {
      this.$router.push(this.localePath(`/projects/${this.projectId}/contracts/${this.contractId}/edit`))
    },
    fetchContract() {
      getContractByIdAndProjectId(this.projectId, this.contractId, this.$axios)
        .then((res) => {
          this.contract = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async handleChecklistsClick() {
      try {
        await this.fetchProjectChecklist({
          project_id: this.projectId,
          contract_id: this.contractId
        })

        if (this.getProjectChecklist.length === 0) {
          this.showDialog = true
        } else {
          this.$router.push(this.localePath(`/projects/${this.projectId}/contracts/${this.contractId}/checklists`))
        }
      } catch (error) {
        console.error("Error fetching project checklist:", error)
        this.error = generateErrorMessage(error, this.$i18n)
      }
    },
    closeDialog() {
      this.showDialog = false
    }
  },
  mounted() {
    this.fetchContract()
  }
}
</script>
