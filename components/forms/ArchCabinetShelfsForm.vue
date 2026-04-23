<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-input v-model="formData.shelf_no" :label="$t('form.number')" :type="'number'" :required="true" />
    <custom-dropdown
      v-model="formData.room_storage_id"
      :label="$t('form.room_storage')"
      :items="getRoomStorages"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadRoomStorages"
      :disabled="!editForm && this.$route.query.room_storage_id ? true : false"
    />
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
  name: "ArchCabinetShelfsForm",
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
        shelf_no: null,
        room_id: null,
        room_storage_id: Number(this.$route.query.room_storage_id) || null,
        project_id: null,
        note: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentCabinetShelf: "archCabinetShelfs/getCurrentCabinetShelf",
      loadingCabinetShelf: "archCabinetShelfs/isLoading",
      //
      getRoomStorages: "archRoomStorages/getRoomStorages",
      loadRoomStorages: "archRoomStorages/isLoading",
      getProjects: "projects/projects"
    })
  },

  methods: {
    ...mapActions({
      addCabinetShelf: "archCabinetShelfs/addCabinetShelf",
      updateCabinetShelf: "archCabinetShelfs/updateCabinetShelf",
      fetchCabinetShelfById: "archCabinetShelfs/fetchCabinetShelfById",
      //
      fetchRoomStorages: "archRoomStorages/fetchRoomStorages",
      fetchProjects: "projects/fetchProjects"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.formData.shelf_no = parseInt(this.formData.shelf_no, 10)
      this.loadingCabinetShelf = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateCabinetShelf(this.formData)
      } else {
        await this.addCabinetShelf(this.formData)
      }
      this.loadingCabinetShelf = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchRoomStorages()
    this.fetchProjects()
    if (this.editForm) {
      await this.fetchCabinetShelfById(this.itemId)
      this.formData = {
        ...this.getCurrentCabinetShelf,
        name: { ...this.getCurrentCabinetShelf.name }
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
