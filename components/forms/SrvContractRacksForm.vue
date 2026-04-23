<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.srv_contracts_room_id"
      :items="getContractRooms"
      item-text="room.name"
      item-value="id"
      :label="$t('table.service_contract_rooms')"
      :required="true"
      :loading="loadingContractRooms"
      :disabled="!editForm && this.$route.query.srv_contracts_room_id ? true : false"
    />
    <custom-dropdown
      v-model="formData.srv_rack_type_id"
      :items="getRackTypes"
      item-text="name"
      item-value="id"
      :label="$t('table.type')"
      :required="true"
      :loading="loadingRackTpes"
    />
    <custom-input v-model="formData.qty_racks" :label="$t('form.qty_racks')" :type="'number'" :required="true" />
    <!-- <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvContractRacksForm",
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
        srv_contracts_room_id: Number(this.$route.query.srv_contracts_room_id) || null,
        srv_rack_type_id: null,
        qty_racks: 0
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentContractRack: "srvContractRacks/getCurrentContractRack",
      loadingContractRacks: "srvContractRacks/isLoading",
      getContractRooms: "srvContractRooms/getContractRooms",
      loadingContractRooms: "srvContractRooms/isLoading",
      getRackTypes: "srvRackTypes/getRackTypes",
      loadingRackTpes: "srvRackTypes/isLoading"
    }),
    roomId() {
      // return this.$route.query.srv_contracts_room_id
      // convert string to number
      return Number(this.$route.query.srv_contracts_room_id)
    }
  },

  methods: {
    ...mapActions({
      addContractRack: "srvContractRacks/addContractRack",
      updateContractRack: "srvContractRacks/updateContractRack",
      fetchContractRackById: "srvContractRacks/fetchContractRackById",
      fetchContractRooms: "srvContractRooms/fetchContractRooms",
      fetchRackTypes: "srvRackTypes/fetchRackTypes"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingContractRacks = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateContractRack(this.formData)
      } else {
        await this.addContractRack(this.formData)
      }
      this.loadingContractRacks = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchContractRooms()
    this.fetchRackTypes()
    if (this.editForm) {
      await this.fetchContractRackById(this.itemId)
      this.formData.srv_contracts_room_id = this.getCurrentContractRack.srv_contracts_room_id
      this.formData.srv_rack_type_id = this.getCurrentContractRack.srv_rack_type_id
      this.formData.qty_racks = this.getCurrentContractRack.qty_racks
    }
  }
}
</script>

<style scoped></style>
