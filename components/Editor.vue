<template>
  <ckeditor-nuxt />
</template>

<script>

export default {
  components: {
    'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },
  },

  data() {
    return {
      editor: null,
    }
  },

  mounted() {

  },

  beforeDestroy() {

  },
}
</script>
