<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-dropdown
      v-model="formData.srv_contract_id"
      :label="$t('form.contract')"
      :items="getContracts"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingContracts"
      :disabled="!editForm && this.$route.query.srv_contract_id ? true : false"
    />
    <custom-dropdown
      v-model="formData.srv_team_id"
      :label="$t('table.team')"
      :items="getTeams"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingTeams"
    />
    <custom-dropdown
      v-model="formData.srv_visits_prioriy_id"
      :label="$t('table.priority')"
      :items="getVisitPriorities"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingVisitPriorites"
    />
    <custom-dropdown
      v-model="formData.srv_visits_status_id"
      :label="$t('form.status')"
      :items="getVisitStatuses"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingVisitStatuses"
    />
    <custom-date-picker v-model="formData.date" :label="$t('table.date')" :required="false" />
    <custom-date-picker v-model="formData.srv_due_date" :label="$t('table.due_date')" :required="false" />
    <custom-date-picker v-model="formData.srv_checkin_time" :label="$t('table.checkin_time')" :required="false" />
    <custom-date-picker v-model="formData.srv_checkout_time" :label="$t('table.checkout_time')" :required="false" />

    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { getUsers } from "@/api/tenent-api"

export default {
  name: "SrVisitsForm",
  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      users: [],
      formData: {
        name: "",
        code: "",
        note: "",
        srv_contract_id: Number(this.$route.query.srv_contract_id) || null,
        srv_team_id: null,
        srv_visits_status_id: null,
        srv_visits_prioriy_id: null,
        date: null,
        srv_due_date: null,
        srv_checkin_time: null,
        srv_checkout_time: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentVisit: "srvVisits/getCurrentVisit",
      loadingVisits: "srvVisits/isLoading",
      getContracts: "srvContracts/getContracts",
      loadingContracts: "srvContracts/isLoading",
      getTeams: "srvTeams/getTeams",
      loadingTeams: "srvTeams/isLoading",
      getVisitPriorities: "srvVisitPriorities/getVisitPriorities",
      loadingVisitPriorites: "srvVisitPriorities/isLoading",
      getVisitStatuses: "srvVisitStatuses/getVisitStatuses",
      loadingVisitStatuses: "srvVisitStatuses/isLoading"
    }),
    usersList() {
      return this.users.map((user) => {
        return {
          value: user.full_name,
          id: user.id
        }
      })
    }
  },

  methods: {
    ...mapActions({
      addVisit: "srvVisits/addVisit",
      updateVisit: "srvVisits/updateVisit",
      fetchVisitById: "srvVisits/fetchVisitById",
      fetchContracts: "srvContracts/fetchContracts",
      fetchTeams: "srvTeams/fetchTeams",
      fetchVisitPriorities: "srvVisitPriorities/fetchVisitPriorities",
      fetchVisitStatuses: "srvVisitStatuses/fetchVisitStatuses"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    getUsers,
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingVisits = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateVisit(this.formData)
      } else {
        await this.addVisit(this.formData)
      }
      this.loadingVisits = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchContracts()
    this.fetchTeams()
    this.fetchVisitPriorities()
    this.fetchVisitStatuses()
    const users = await this.getUsers(this.$axios)
    this.users = users.data.data
    if (this.editForm) {
      await this.fetchVisitById(this.itemId)
      this.formData.name = this.getCurrentVisit.name
      this.formData.code = this.getCurrentVisit.code
      this.formData.note = this.getCurrentVisit.note
      this.formData.srv_contract_id = this.getCurrentVisit.srv_contract_id
      this.formData.srv_team_id = this.getCurrentVisit.srv_team_id
      this.formData.srv_visits_prioriy_id = this.getCurrentVisit.srv_visits_prioriy_id
      this.formData.srv_visits_status_id = this.getCurrentVisit.srv_visits_status_id
      this.formData.date = this.getCurrentVisit.date
      this.formData.srv_due_date = this.getCurrentVisit.srv_due_date
      this.formData.srv_checkin_time = this.getCurrentVisit.srv_checkin_time
      this.formData.srv_checkout_time = this.getCurrentVisit.srv_checkout_time
    }
  }
}
</script>

<style scoped>
.color_field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  margin-bottom: 1.8rem;
  border: 1px solid #929292;
  border-radius: 4px;
}
</style>
