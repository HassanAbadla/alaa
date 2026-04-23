<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.srv_contract_id"
      :items="getContracts"
      item-text="name"
      item-value="id"
      :label="$t('form.contract')"
      :required="true"
      :loading="loadingContracts"
      :disabled="!editForm && this.$route.query.srv_contract_id ? true : false"
    />
    <custom-dropdown
      v-model="building_id"
      :items="getBuildings"
      item-text="name"
      item-value="id"
      :label="$t('table.buildings')"
      :required="true"
      :loading="loadbuildings"
      @input="getBuildingRooms"
    />
    <custom-dropdown
      v-model="formData.room_id"
      :items="getRoomBuildings"
      item-text="name"
      item-value="id"
      :label="$t('table.room')"
      :required="true"
      :loading="loadingRoomBuildings"
      :disabled="!building_id"
    />
    <custom-dropdown
      v-model="formData.srv_scope_id"
      :items="getScopes"
      item-text="name"
      item-value="id"
      :label="$t('table.scope')"
      :required="true"
      :loading="loadingScopes"
    />
    <custom-dropdown
      v-model="formData.srv_frequency_id"
      :items="getFrequencies"
      item-text="name"
      item-value="id"
      :label="$t('table.service_frequencies')"
      :required="true"
      :loading="loadingFrequencies"
    />
    <custom-input v-model="formData.room_area" :label="$t('form.room_area')" :required="true" />
    <!-- <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvContractRoomsForm",
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
      formData: {
        srv_contract_id: Number(this.$route.query.srv_contract_id) || null,
        room_id: null,
        srv_scope_id: null,
        room_area: 0,
        srv_frequency_id: null
        // note: ""
      },
      loading: false,
      building_id: null,
      tenant_id: this.$route.query.receiver_tenant_id || null
    }
  },

  computed: {
    ...mapGetters({
      getCurrentContractRoom: "srvContractRooms/getCurrentContractRoom",
      loadingContractRooms: "srvContractRooms/isLoading",
      getContracts: "srvContracts/getContracts",
      loadingContracts: "srvContracts/isLoading",
      getRoomBuildings: "srvRoomsBuildings/getRoomBuildings",
      loadingRoomBuildings: "srvRoomsBuildings/isLoading",
      getScopes: "srvScopes/getScopes",
      loadingScopes: "srvScopes/isLoading",
      getFrequencies: "srvFrequencies/getFrequencies",
      loadingFrequencies: "srvFrequencies/isLoading",
      getBuildings: "buildings/getBuildings",
      loadingBuildings: "buildings/isLoading",
      getTenants: "srvTenants/getTenants",
      loadingTenants: "srvTenants/isLoading"
    }),
    receiverTenantId() {
      return (
        this.getContracts.find((contract) => contract.id === Number(this.$route.query.srv_contract_id))
          ?.receiver_tenant_id || null
      )
    }
  },

  methods: {
    ...mapActions({
      addContractRoom: "srvContractRooms/addContractRoom",
      updateContractRoom: "srvContractRooms/updateContractRoom",
      fetchContractRoomById: "srvContractRooms/fetchContractRoomById",
      fetchContracts: "srvContracts/fetchContracts",
      fetchRoomBuildings: "srvRoomsBuildings/fetchRoomBuildings",
      fetchScopes: "srvScopes/fetchScopes",
      fetchFrequencies: "srvFrequencies/fetchFrequencies",
      fetchBuildings: "buildings/fetchBuildings",
      fetchTenants: "srvTenants/fetchTenants"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingContractRooms = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateContractRoom(this.formData)
      } else {
        await this.addContractRoom(this.formData)
      }
      this.loadingContractRooms = false
      this.closeDrawer()
    },
    getBuildingRooms() {
      this.fetchRoomBuildings({ receiver_tenant_id: this.receiverTenantId, building_id: this.building_id })
    }
  },
  async mounted() {
    await this.fetchContracts()
    // this.getBuildingRooms()
    this.fetchBuildings({ tenant_id: this.receiverTenantId })
    this.fetchRoomBuildings({ receiver_tenant_id: this.$route.query.receiver_tenant_id })
    this.fetchScopes()
    this.fetchFrequencies()
    if (this.editForm) {
      await this.fetchContractRoomById(this.itemId)
      this.formData.room_name = this.getCurrentContractRoom.room_name
      this.formData.room_area = this.getCurrentContractRoom.room_area
      this.formData.srv_scope_id = this.getCurrentContractRoom.srv_scope_id
      this.formData.srv_contract_id = this.getCurrentContractRoom.srv_contract_id
      this.building_id = this.getCurrentContractRoom.room.building_id
      this.formData.room_id = this.getCurrentContractRoom.room_id
      this.formData.srv_frequency_id = this.getCurrentContractRoom.srv_frequency_id
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
