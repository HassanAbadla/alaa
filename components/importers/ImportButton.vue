<template>
  <v-can :permission="permission">
    <v-btn small color="primary" class="mx-1" @click="$emit('click')">
      <v-icon left small>mdi-file-import</v-icon>
      {{ $t("page.import") }}
    </v-btn>
  </v-can>
</template>

<script>
export default {
  name: "ImportButton",
  props: {
    permission: {
      type: [String, Array],
      required: true,
    },
  },
};
</script>
