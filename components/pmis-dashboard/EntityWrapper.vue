<template>
  <v-col cols="12" md="3">
    <v-can disable-only :permission="permission">
      <template #default="{ disabled }">
        <div
          class="text-decoration-none"
          :style="disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }"
          @click="!disabled && $router.push(localePath(path))"
        >
          <v-card class="mx-auto" height="100%">
            <v-card-text>
              <div class="text-h4">{{ title }}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-center">
              <v-btn v-if="count >= 0" block text small>
                {{ $t("page.item_count", { count: count, items: title }) }}
              </v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <slot name="progress"></slot>
            <v-divider></v-divider>
            <v-card-text>
              <!-- <div class="text-h6 font-weight-light mb-2">Working Example</div>
              <div class="subheading font-weight-light grey--text">Last Campaign Performance</div> -->
              <!-- <v-icon class="mr-2" small>mdi-clock</v-icon> -->
              <!-- <span class="text-caption grey--text font-weight-light">last registration 26 minutes ago</span> -->
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-can>
  </v-col>
</template>

<script>
import VCan from "../VCan.vue"
export default {
  components: { VCan },
  name: "EntityWrapper",
  props: {
    title: { type: String, required: true },
    path: { type: String, required: true },
    count: { type: Number },
    permission: { type: String, required: true }
  }
}
</script>

<style></style>
