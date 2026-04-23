<template>
  <div>
    <v-card flat>
      <v-card-text @click="toggleExpand">
        <div v-if="!expanded">
          <p class="description-line">
            {{ descriptionList[0] }}
            <v-icon v-if="descriptionList.length > 1">
              {{ expanded ? "" : "mdi-chevron-down" }}
            </v-icon>
          </p>
        </div>
        <v-expand-transition>
          <div v-if="expanded">
            <p class="description-line">{{ description }}</p>
            <!-- <p v-for="(line, index) in descriptionList.slice(1)" :key="index" class="description-line">
              {{ line }}
            </p> -->
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "NumberedDescriptionItems",
  props: {
    description: { type: String }
  },
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    descriptionList() {
      return this.parseNumberedItems(this.description)
    }
  },
  methods: {
    parseNumberedItems(input) {
      return input.split(/(?<=\D)(?=\d+\.)/).map((item) => item.trim())
    },
    toggleExpand() {
      if (this.descriptionList.length > 1) {
        this.expanded = !this.expanded
      }
    }
  }
}
</script>

<style scoped>
.description-line {
  cursor: pointer;
  margin-bottom: 4px;
}
.description-line:last-child {
  margin-bottom: 0;
}
</style>
