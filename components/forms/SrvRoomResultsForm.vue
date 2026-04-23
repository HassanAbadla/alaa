<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.srv_visit_id"
      :label="$t('table.visits')"
      :items="getVisits"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingVisits"
      @input="getRooms"
      :disabled="!editForm && this.$route.query.srv_visit_id ? true : false"
    />
    <custom-dropdown
      v-model="formData.srv_contracts_room_id"
      :label="$t('table.room')"
      :items="getContractRooms"
      item-value="id"
      item-text="room.name"
      :required="true"
      :loading="loadingContractRooms"
    />
    <custom-dropdown
      v-model="formData.srv_results_status_id"
      :label="$t('form.status')"
      :items="getResultStatuses"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingResultStatuses"
    />
    <custom-dropdown
      v-model="formData.srv_test_id"
      :label="$t('table.test')"
      :items="getTests"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingTests"
    />
    <custom-input v-model="formData.test_counts" :label="$t('table.count')" :required="true" />
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
  name: "SrvRoomResultsForm",
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
        srv_contracts_room_id: null,
        srv_results_status_id: null,
        test_counts: null,
        srv_visit_id: Number(this.$route.query.srv_visit_id) || null,
        note: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentRoomResult: "srvRoomResults/getCurrentRoomResult",
      loadingRoomResults: "srvRoomResults/isLoading",
      getContractRooms: "srvContractRooms/getContractRooms",
      loadingContractRooms: "srvContractRooms/isLoading",
      getResultStatuses: "srvResultStatuses/getResultStatuses",
      loadingResultStatuses: "srvResultStatuses/isLoading",
      getTests: "srvTests/getTests",
      loadingTests: "srvTests/isLoading",
      getVisits: "srvVisits/getVisits",
      loadingVisits: "srvVisits/isLoading"
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
      addRoomResult: "srvRoomResults/addRoomResult",
      updateRoomResult: "srvRoomResults/updateRoomResult",
      fetchRoomResultById: "srvRoomResults/fetchRoomResultById",
      fetchContractRooms: "srvContractRooms/fetchContractRooms",
      fetchResultStatuses: "srvResultStatuses/fetchResultStatuses",
      fetchTests: "srvTests/fetchTests",
      fetchVisits: "srvVisits/fetchVisits"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    getUsers,
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingRoomResults = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateRoomResult(this.formData)
      } else {
        await this.addRoomResult(this.formData)
      }
      this.loadingRoomResults = false
      this.closeDrawer()
    },
    getRooms(visitId) {
      console.log("visit:", visitId)
      const visit = this.getVisits.find((visit) => visit.id === visitId)
      console.log("visit:", visit)
      const contractId = visit.contract?.id
      this.fetchContractRooms({ srv_contract_id: contractId })
    }
  },
  async mounted() {
    const contractId = this.$route.query.srv_contract_id
    this.fetchContractRooms({ srv_contract_id: contractId })
    this.fetchResultStatuses()
    this.fetchTests()
    this.fetchVisits()
    const users = await this.getUsers(this.$axios)
    this.users = users.data.data
    if (this.editForm) {
      await this.fetchRoomResultById(this.itemId)
      this.formData.srv_contracts_room_id = this.getCurrentRoomResult.srv_contracts_room_id
      this.formData.srv_results_status_id = this.getCurrentRoomResult.srv_results_status_id
      this.formData.srv_test_id = this.getCurrentRoomResult.srv_test_id
      this.formData.test_counts = this.getCurrentRoomResult.test_counts
      this.formData.note = this.getCurrentRoomResult.note
      this.formData.srv_visit_id = this.getCurrentRoomResult.srv_visit_id
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
