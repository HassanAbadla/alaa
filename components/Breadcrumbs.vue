<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :to="item.to" :exact="true" :disabled="item.disabled">
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
import languageHandler from "../mixins/languageHandler"

export default {
  name: "Breadcrumbs",
  mixins: [languageHandler],
  data() {
    return {
      breadcrumbs: []
    }
  },
  watch: {
    $route: {
      handler() {
        this.updateBreadcrumbs()
      }
    },
    "$i18n.locale": {
      immediate: true,
      handler() {
        this.updateBreadcrumbs()
      }
    }
  },
  methods: {
    updateBreadcrumbs() {
      const pathArray = this.$route.path.split("/").filter((i) => i)
      let path = ""

      // Start from index 0, as we're not relying on URL for language anymore
      this.breadcrumbs = pathArray.map((item, index) => {
        path += `/${item}`
        const text = this.getTranslatedText(item, index > 0 ? pathArray[index - 1] : null)

        return {
          text,
          disabled: index === pathArray.length - 1,
          to: this.localePath(path)
        }
      })
    },

    getTranslatedText(text, previousItem) {
      if (!isNaN(text) && previousItem) {
        // If the item is a number and there's a previous item, use the singular form of the previous item
        return this.$t(`page.${this.getSingular(previousItem)}`)
      }
      // Otherwise, use the plural form for translation
      return this.$t(`page.${text}`)
    },

    getSingular(word) {
      // Basic rules for getting singular form
      if (word.endsWith("ies")) {
        return `${word.slice(0, -3)}y`
      } else if (word.endsWith("s")) {
        return word.slice(0, -1)
      }
      return word
    }
  }
}
</script>
