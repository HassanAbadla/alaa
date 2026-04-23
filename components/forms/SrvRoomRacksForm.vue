<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.rooms_id"
      :items="getRoomBuildings"
      item-text="name"
      item-value="id"
      :label="$t('table.room')"
      :required="true"
      :loading="loadingRoomBuildings"
      :disabled="!editForm && this.$route.query.rooms_id ? true : false"
    />
    <custom-dropdown
      v-model="formData.srv_rack_type_id"
      :items="getRackTypes"
      item-text="name"
      item-value="id"
      :label="$t('table.rack_type')"
      :required="true"
      :loading="loadingRackTpes"
    />

    <custom-input v-model="formData.qty_racks" :label="$t('form.qty_racks')" :required="true" />
    <!-- <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvRoomRacksForm",
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
        srv_rack_type_id: "",
        rooms_id: Number(this.$route.query.rooms_id) || null,
        qty_racks: 0
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentRoomRack: "srvRoomRacks/getCurrentRoomRack",
      loadngRoomRaks: "srvRoomRacks/isLoading",
      getRackTypes: "srvRackTypes/getRackTypes",
      loadingRackTpes: "srvRackTypes/isLoading",
      getRoomBuildings: "srvRoomsBuildings/getRoomBuildings",
      loadingRoomBuildings: "srvRoomsBuildings/isLoading",
      getTenants: "srvTenants/getTenants",
      loadingTenants: "srvTenants/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addRoomRack: "srvRoomRacks/addRoomRack",
      updateRoomRack: "srvRoomRacks/updateRoomRack",
      fetchRoomRackById: "srvRoomRacks/fetchRoomRackById",
      fetchRackTypes: "srvRackTypes/fetchRackTypes",
      fetchRoomBuildings: "srvRoomsBuildings/fetchRoomBuildings"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadngRoomRaks = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateRoomRack(this.formData)
      } else {
        await this.addRoomRack(this.formData)
      }
      this.loadngRoomRaks = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchRackTypes()
    this.fetchRoomBuildings({ receiver_tenant_id: this.$route.query.receiver_tenant_id || null })
    if (this.editForm) {
      await this.fetchRoomRackById(this.itemId)
      this.formData.srv_rack_type_id = this.getCurrentRoomRack.srv_rack_type_id
      this.formData.rooms_id = this.getCurrentRoomRack.rooms_id
      this.formData.qty_racks = this.getCurrentRoomRack.qty_racks
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
