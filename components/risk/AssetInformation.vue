<!-- AssetInformation.vue -->
<template>
  <div>
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="6" class="pr-md-2">
        <v-list dense>
          <display-list-item :label="$t('table.name')" :value="{ name: asset?.name }" :show-chip="false" />
          <display-list-item :label="$t('table.code')" :value="{ name: asset?.code }" :show-chip="false" />
          <display-list-item :label="$t('table.type')" :value="{ name: asset?.type?.name }" :show-chip="false" />
          <display-list-item
            :label="$t('table.business_purpose')"
            :value="{ name: asset?.business_purpose }"
            :show-chip="false"
          />
          <display-list-item :label="$t('table.asset_custodian')" :value="{ name: asset?.owner }" :show-chip="false" />
        </v-list>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="6" class="pl-md-2">
        <v-list dense>
          <display-list-item
            :label="$t('table.location')"
            :value="{ name: asset?.location?.name }"
            :show-chip="false"
          />
          <display-list-item
            :label="$t('table.status')"
            :value="{ name: asset?.status?.name, color: asset?.status?.color }"
            :show-chip="true"
          />
          <display-list-item
            :label="$t('table.asset_model')"
            :value="{ name: asset?.asset_model }"
            :show-chip="false"
          />
          <display-list-item
            :label="$t('table.category')"
            :value="{ name: asset?.category?.name }"
            :show-chip="false"
          />
          <display-list-item
            :label="$t('table.asset_network_address')"
            :value="{ name: asset?.asset_network_address }"
            :show-chip="false"
          />
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "AssetInformation",
  props: {
    asset: {
      type: Object,
      default: () => null
    }
  }
}
</script>
