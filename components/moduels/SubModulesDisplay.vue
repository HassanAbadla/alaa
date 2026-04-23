<template>
  <div>
    <!-- Sub-modules Display as Column Layout -->
    <v-expand-transition>
      <div v-if="selectedModule && groupedSubModules.length > 0">
        <v-row dense>
          <v-col v-for="group in groupedSubModules" :key="group.groupId" cols="12" sm="6" md="3" lg="2" xl="2">
            <!-- Group Header -->
            <v-subheader class="pl-0 pb-2 body-1 font-weight-medium text--primary">
              {{ group.groupName }}
            </v-subheader>

            <!-- Sub-modules Column -->
            <div class="d-flex flex-column">
              <v-can
                v-for="subModule in group.subModules"
                :key="subModule.id"
                :permission="subModule.permission.short_name"
              >
                <v-card
                  outlined
                  hover
                  :color="subModule.color || ''"
                  @click="openSubModule(subModule)"
                  class="mb-2 compact-sub-module"
                  elevation="0"
                >
                  <v-card-text class="d-flex align-center pa-2">
                    <v-avatar
                      :color="subModule.color_secondary || 'secondary'"
                      size="24"
                      :class="` ${isRTL ? 'ml-2' : 'mr-2'}`"
                    >
                      <v-icon
                        v-if="subModule.icon"
                        :color="getTextColorForBackground(subModule.color_secondary || 'secondary')"
                        x-small
                        dark
                      >
                        {{ subModule.icon }}
                      </v-icon>
                      <span v-else class="white--text caption font-weight-bold">
                        {{
                          subModule.code
                            ? subModule.code.charAt(0).toUpperCase()
                            : subModule.name.charAt(0).toUpperCase()
                        }}
                      </span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div
                        class="caption font-weight-medium"
                        :style="{ color: getTextColorForBackground(subModule.color) }"
                      >
                        {{ subModule.name }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-can>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <!-- Empty State -->
    <v-expand-transition>
      <div v-if="selectedModule && (!selectedModule.sub_modules || selectedModule.sub_modules.length === 0)">
        <v-alert outlined type="info" class="text-center ma-2" dense>
          <div class="body-2 font-weight-medium mb-1">No Sub-modules</div>
          <div class="caption">{{ selectedModule.name }} doesn't have any sub-modules yet.</div>
        </v-alert>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { colorUtils } from "@/mixins/colorUtils"

export default {
  name: "SubModulesDisplay",
  mixins: [colorUtils],
  props: {
    selectedModule: {
      type: Object,
      default: null
    },
    groupedSubModules: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState(["isRTL"])
  },
  methods: {
    openSubModule(subModule) {
      this.$emit("open-sub-module", subModule)
    }
  }
}
</script>

<style scoped>
.compact-sub-module {
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.compact-sub-module:hover {
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme--dark .compact-sub-module {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.theme--dark .compact-sub-module:hover {
  border-color: rgba(255, 255, 255, 0.25);
}
</style>
