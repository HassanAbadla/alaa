<template>
  <v-treeview :items="items" :open="initiallyOpen" activatable item-key="id" open-on-click class="pt-2">
    <template v-slot:prepend="{ item }">
      <v-icon small color="white" v-if="item.icon">{{ item.icon }}</v-icon>
    </template>
    <template v-slot:label="{ item }">
      <nuxt-link :to="getLink(item)" class="text-decoration-none">
        <span class="white--text">{{ item.name }}</span>
      </nuxt-link>
    </template>
  </v-treeview>
</template>

<script>
export default {
  name: "TreeView",
  props: {
    items: {
      type: Array,
      required: true
    },
    initiallyOpen: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getLink(item) {
      if (item.type === "contract" && item.parentId) {
        return `/projects/${item.parentId}/contracts/${item.id}`
      }
      return "/" + this.addSToEnd(item.type) + "/" + item.id
    },
    addSToEnd(inputString) {
      if (typeof inputString === "string") {
        return inputString + "s"
      } else {
        return "Input is not a valid string."
      }
    }
  }
}
</script>

<style scoped>
.v-treeview-node__root {
  min-height: 20px;
}
.v-treeview-node__content {
  min-height: 20px;
}
.v-treeview-node__label {
  font-size: 13px;
}
</style>
