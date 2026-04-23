<template>
  <div>
    <v-list>
      <template v-if="loading">
        <v-list-item>
          <v-list-item-content class="py-5 d-flex justify-center align-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-else>
        <!-- <div class="error--text">{{ $t("page.returns_all_until_api_is_fixed") }}</div> -->
        <v-list-item v-for="(item, index) in dataArray" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ item[dataKey] }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="dataArray.length === 0">
          <v-list-item-content>
            <v-list-item-title>{{ $t("page.no_items_to_display") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "DataList",
  props: {
    dataArray: {
      type: Array,
      required: true,
      default: () => []
    },
    dataKey: {
      type: String,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
