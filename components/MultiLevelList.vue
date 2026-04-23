<template>
  <v-treeview v-model="selectedItems" :items="items" selectable>
    <template v-slot:label="{ item }">
      {{ item.text }}
    </template>
  </v-treeview>
</template>

<script>
export default {
  data() {
    return {
      selectedItems: []
    }
  },
  async created() {
    // Fetch data from your API
    this.items = await this.fetchData()
  },
  methods: {
    async fetchData() {
      // Implement your API call here and return the data
      // Example using axios:
      // const response = await this.$axios.get('your-api-endpoint');
      // return response.data;

      // Dummy data for testing
      return [
        {
          id: 1,
          text: "Item 1",
          children: [
            { id: 2, text: "Item 1.1" },
            { id: 3, text: "Item 1.2" }
          ]
        },
        {
          id: 4,
          text: "Item 2",
          children: [
            { id: 5, text: "Item 2.1" },
            { id: 6, text: "Item 2.2" }
          ]
        }
      ]
    }
  }
}
</script>
