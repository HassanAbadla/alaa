<template>
  <div class="d-flex flex-row">
    <v-can :permission="permissions.edit" class="mx-2">
      <v-btn color="primary" @click="$emit('edit')">
        {{ $t("page.edit") }}
      </v-btn>
    </v-can>
    <v-can :permission="permissions.delete">
      <v-btn color="error" @click="$emit('delete')">
        {{ $t("page.delete") }}
      </v-btn>
    </v-can>
  </div>
</template>

<script>
export default {
  name: "ActionBtns",
  props: {
    permissions: {
      type: Object,
      default: () => ({
        edit: "",
        delete: ""
      })
    }
  }
}
</script>
