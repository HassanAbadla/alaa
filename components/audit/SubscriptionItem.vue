<template>
  <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap primary--text text--darken-2">
    <v-col>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="white--text text--darken-2" v-bind="attrs" v-on="on">
            {{ truncateText(item.title || `Contract id: ${item.id}`, 25) }}
          </span>
        </template>
        <span>{{ item.title || `Contract id: ${item.id}` }}</span>
      </v-tooltip>
    </v-col>
    <v-col cols="auto" class="d-flex align-center" justify-center>
      <v-can :permission="'access_compliance_contract_note'">
        <editable-note-form
          :note="item.note"
          :title="getItemName"
          :item-id="item.id"
          :loading="loadingStates[`update_note_${item.id}`]"
          :disable-edit="Boolean(item.close)"
          @update-item="updateNote"
          icon-size="small"
          icon-color="white"
        />
      </v-can>
      <v-can :permission="'close_compliance_contract'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <lock-button
              :locked="Boolean(item.close)"
              :disabled="loadingStates[`toggle_sub_${item.id}`] || Boolean(item.close)"
              @click="showDialog('closeSubscription')"
              small
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <span>{{ Boolean(item.close) ? $t("page.subscription_closed") : $t("page.close_contract") }}</span>
        </v-tooltip>
      </v-can>
    </v-col>
    <confirm-dialog
      v-model="dialog.closeSubscription"
      :title="$t('page.confirm_close')"
      :message="$t('page.confirm_close_message', { itemName: getItemName })"
      :confirm-button-text="$t('page.close_item')"
      confirm-button-color="error"
      @confirm="$emit('toggle-status', item)"
    />
  </v-row>
</template>

<script>
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import { truncateText } from "@/helpers/misc"
import VCan from "../VCan.vue"
import LockButton from "../buttons/LockButton.vue"

export default {
  name: "SubscriptionItem",
  components: {
    EditableNoteForm,
    VCan,
    LockButton
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    loadingStates: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: { closeSubscription: false }
    }
  },
  computed: {
    getItemName() {
      return this.item?.title
    }
  },
  methods: {
    truncateText,
    showDialog(name) {
      this.dialog[name] = true
    },
    updateNote(id, payload) {
      this.$emit("update-note", id, payload)
    }
  }
}
</script>
<style scoped></style>
