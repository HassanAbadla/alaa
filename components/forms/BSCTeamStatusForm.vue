<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <v-menu bottom origin="center center" transition="scale-transition" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <div class="color_field">
          <p class="my-0">Color:</p>
          <p class="mx-2 my-0">{{ formData.color || "" }}</p>
          <div :style="swatchStyle" v-bind="attrs" v-on="on"></div>
        </div>
      </template>
      <v-card>
        <v-card-text>
          <v-color-picker
            value="#1976D2"
            v-model="formData.color"
            mode="hexa"
            hide-sliders
            show-swatches
            class="mx-auto"
          ></v-color-picker>
        </v-card-text>
      </v-card>
    </v-menu>
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "BSCTeamStatusForm",
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
        note: "",
        color: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getStatuses: "bscTeamStatuses/getBscTeamStatuses",
      getCurrentStatus: "bscTeamStatuses/getCurrentStatus",
      loadingStatus: "bscTeamStatuses/isLoading"
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
      addStatus: "bscTeamStatuses/addStatus",
      fetchStatuses: "bscTeamStatuses/fetchStatuses",
      updateStatus: "bscTeamStatuses/updateStatus",
      fetchStatusById: "bscTeamStatuses/fetchStatusById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingStatus = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateStatus(this.formData)
        // this.fetchStatuses()
      } else {
        await this.addStatus(this.formData)
        // this.fetchStatuses()
      }
      this.loadingStatus = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchStatusById(this.itemId)
      this.formData.name.en = this.getCurrentStatus.name.en
      this.formData.name.ar = this.getCurrentStatus.name.ar
      this.formData.note = this.getCurrentStatus.note
      this.formData.color = this.getCurrentStatus.color || "#1976D2"
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
