<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvScopeForm",
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
        name: "",
        note: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getTeams: "srvTeams/getTeams",
      loadingTeams: "srvTeams/isLoading"
    }),
    swatchStyle() {
      return {
        backgroundColor: this.formData.color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        border: "1px solid #929292",
        borderRadius: "4px"
      }
    }
  },

  methods: {
    ...mapActions({
      addTeam: "srvTeams/addTeam",
      updateTeam: "srvTeams/updateTeam",
      getTeamById: "srvTeams/getTeamById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingTeams = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateTeam(this.formData)
      } else {
        await this.addTeam(this.formData)
      }
      this.loadingTeams = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.getTeamById(this.itemId)
      this.formData.name = this.getTeams.name
      this.formData.note = this.getTeams.note
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
