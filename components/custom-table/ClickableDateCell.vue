<template>
  <div>
    <v-tooltip v-if="isOverdue && showOverdue" bottom>
      <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
          :disabled="disabled"
        >
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <div
              :class="[
                'date-display',
                {
                  'date-display--disabled': disabled,
                  'date-display--overdue': isOverdue && showOverdue
                }
              ]"
              v-bind="{ ...(disabled ? {} : menuAttrs), ...tooltipAttrs }"
              v-on="{ ...(disabled ? {} : menuOn), ...tooltipOn }"
            >
              <div class="date-content">
                <formated-date-time hide-time :date="date" />
                <v-icon small class="edit-icon" v-if="!disabled">mdi-pencil</v-icon>
              </div>
            </div>
          </template>
          <v-date-picker v-model="dateValue" @input="updateDate" :disabled="disabled" no-title></v-date-picker>
        </v-menu>
      </template>
      <span>{{ $t("page.over_due") }}</span>
    </v-tooltip>

    <!-- Non-overdue case -->
    <v-menu
      v-else
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
      :disabled="disabled"
    >
      <template v-slot:activator="{ on, attrs }">
        <div
          :class="[
            'date-display',
            {
              'date-display--disabled': disabled,
              'date-display--overdue': isOverdue && showOverdue
            }
          ]"
          v-bind="disabled ? {} : attrs"
          v-on="disabled ? {} : on"
        >
          <div class="date-content">
            <formated-date-time hide-time :date="date" />
            <v-icon small class="edit-icon" v-if="!disabled">mdi-pencil</v-icon>
          </div>
        </div>
      </template>
      <v-date-picker v-model="dateValue" @input="updateDate" :disabled="disabled" no-title></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import FormatedDateTime from "../FormatedDateTime.vue"

export default {
  name: "ClickableDateCell",
  components: {
    FormatedDateTime
  },
  props: {
    date: {
      type: String,
      default: ""
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    field: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showOverdue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: false,
      dateValue: this.date
    }
  },
  computed: {
    isOverdue() {
      if (!this.date || !this.showOverdue) return false

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const dueDate = new Date(this.date)
      dueDate.setHours(0, 0, 0, 0)

      return dueDate < today
    }
  },
  watch: {
    date(newValue) {
      this.dateValue = newValue
    }
  },
  methods: {
    updateDate() {
      this.menu = false
      this.$emit("date-updated", {
        itemId: this.itemId,
        field: this.field,
        value: this.dateValue
      })
    }
  }
}
</script>

<style scoped>
.date-display {
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.date-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.date-display:hover:not(.date-display--disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.date-display--disabled {
  cursor: default;
}

/* Overdue styling */
.date-display--overdue {
  border: 2px solid #ff5252;
  border-radius: 6px;
}

.date-display--overdue:hover:not(.date-display--disabled) {
  border-color: #d32f2f;
  background-color: rgba(255, 82, 82, 0.05);
}

/* Edit icon styling */
.edit-icon {
  display: none;
  margin-left: 4px;
}

.date-display:hover:not(.date-display--disabled) .edit-icon {
  display: inline-flex;
}

/* Add right padding on hover to accommodate the icon */
.date-display:hover:not(.date-display--disabled) .date-content {
  padding-right: 4px;
}
</style>
