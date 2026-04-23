<template>
  <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap primary--text text--darken-2">
    <v-col>
      <v-can disable-only :permission="'access_audit_rounds'">
        <template #default="{ disabled }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="d-inline-block"
                :style="disabled ? { cursor: 'not-allowed', opacity: '0.6' } : {}"
                @click.prevent="!disabled && $router.push(localePath(`/grc/audit-rounds/${item.id}`))"
              >
                <router-link
                  :to="disabled ? '' : localePath(`/grc/audit-rounds/${item.id}`)"
                  class="text-decoration-none white--text text--darken-2"
                  v-bind="attrs"
                  v-on="on"
                  :style="disabled ? { pointerEvents: 'none' } : {}"
                >
                  <!-- {{ truncateText(item.name, 10) }} -->
                  {{ item.name ? item.name : $t("page.round_number", { number: item.index + 1 }) }}
                </router-link>
              </div>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </template>
      </v-can>
    </v-col>
    <v-col cols="auto" class="d-flex align-center" justify-center>
      <v-can :permission="'access_round_note'">
        <editable-note-form
          :note="item.note"
          :title="item.name || `id: ${item.id}`"
          :item-id="item.id"
          :loading="loadingStates[`update_round_note_${item.id}`]"
          :disable-edit="Boolean(item.close)"
          @update-item="updateNote"
          icon-size="small"
          icon-color="white"
        />
      </v-can>
      <v-can :permission="'close_audit_round'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <lock-button
              :locked="Boolean(item.closed)"
              :disabled="loadingStates[`toggle_${item.id}`] || Boolean(item.closed) || item.parentClosed"
              @click="showDialog('closeRound')"
              small
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <span>{{ item.closed ? $t("page.round_closed") : $t("page.close_round") }}</span>
        </v-tooltip>
      </v-can>
    </v-col>
    <confirm-dialog
      v-model="dialog.closeRound"
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
  name: "RoundItem",
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
      dialog: { closeRound: false }
    }
  },
  computed: {
    getItemName() {
      return this.item?.name
    }
  },
  methods: {
    showDialog(name) {
      this.dialog[name] = true
    },
    updateNote(id, payload) {
      console.log(id, payload)
      this.$emit("update-note", id, payload)
    },
    truncateText
  },
  mounted() {
    console.log("Round Item", this.item)
  }
}
</script>
