<template>
  <v-card flat class="text-center pa-4" dense>
    <v-img :src="require(`@/static/landing-icons/${image}.png`)" height="64" contain class=""></v-img>
    <v-card-title class="justify-center text-h5 font-weight-bold">{{ $t(title) }}</v-card-title>
    <v-card-text>
      <p class="mb-1 font-weight-bold" v-for="(bullet, i) in bullets" :key="i">• {{ $t(bullet) }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
    image: { type: String, required: true },
    title: { type: String, default: "" },
    bullets: { type: Array, default: () => [] }
  }
}
</script>
