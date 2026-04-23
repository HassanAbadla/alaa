<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-dropdown
      v-model="formData.room_id"
      :label="$t('form.room')"
      :items="getRoomBuildings"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingRooms"
    />
    <custom-dropdown
      v-model="formData.arc_cabinet_type_id"
      :label="$t('form.cabinet_type')"
      :items="getCabinetTypes"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadCabinetTypes"
    />
    <custom-input v-model="formData.wall_name" :label="$t('form.wall_name')" :required="false" />
    <custom-dropdown
      v-model="formData.project_id"
      :label="$t('form.project')"
      :items="getProjects"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadCabinetTypes"
    />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "ArchRoomStoragesForm",
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
        name: { en: "", ar: "" },
        room_id: null,
        wall_name: "",
        arc_cabinet_type_id: null,
        project_id: null,
        note: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentRoomStorage: "archRoomStorages/getCurrentRoomStorage",
      loadRoomStorage: "archRoomStorages/isLoading",
      //
      getRoomBuildings: "srvRoomsBuildings/getRoomBuildings",
      loadingRooms: "srvRoomsBuildings/isLoading",
      getCabinetTypes: "archCabinetTypes/getCabinetTypes",
      loadCabinetTypes: "archCabinetTypes/isLoading",
      getProjects: "projects/projects"
    })
  },

  methods: {
    ...mapActions({
      addRoomStorage: "archRoomStorages/addRoomStorage",
      updateRoomStorage: "archRoomStorages/updateRoomStorage",
      fetchRoomStorageById: "archRoomStorages/fetchRoomStorageById",
      //
      fetchRoomBuildings: "srvRoomsBuildings/fetchRoomBuildings",
      fetchCabinetTypes: "archCabinetTypes/fetchCabinetTypes",
      fetchProjects: "projects/fetchProjects"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadRoomStorage = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateRoomStorage(this.formData)
      } else {
        await this.addRoomStorage(this.formData)
      }
      this.loadRoomStorage = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchRoomBuildings()
    this.fetchCabinetTypes()
    this.fetchProjects()
    if (this.editForm) {
      await this.fetchRoomStorageById(this.itemId)

      this.formData = {
        ...this.getCurrentRoomStorage,
        name: { ...this.getCurrentRoomStorage.name }
      }
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
