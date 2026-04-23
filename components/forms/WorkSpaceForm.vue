<template>
  <v-container>
    <v-container class="py-8">
      <custom-input
        v-model="formData.name"
        :label="$t('form.name')"
        :required="true"
      />
      <custom-TextArea
        v-model="formData.note"
        :label="$t('form.notes')"
        :required="false"
      />
      <v-btn @click="handleSubmit" :loading="loading" color="primary" block>{{
        $t("form.add")
      }}</v-btn>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "LookupForm1",
  props: {
    itemPath: {
      type: String,
      required: true,
    },
    itemId: {
      type: [Number, String],
      required: true,
    },
    editForm: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      formData: {
        name: "",
        note: "",
      },
      loading: false,
    };
  },
  methods: {
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      this.closeDrawer();
    },
    async loadLookup() {
      if (this.editForm) {
        switch (this.itemPath) {
          case "manufacturers":
            break;
          case "locations":
            break;
          default:
            console.error("Invalid itemPath prop:", this.itemPath);
        }
      }
    },
  },
  computed: {},
  async mounted() {
    // await this.loadLookup()
  },
};
</script>
