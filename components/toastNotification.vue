<template>
  <v-snackbar top timeout="5000" v-model="show" :color="color">
    {{ message }}
    <template v-slot:action="{}">
      <v-btn text @click="show = false"><v-icon>mdi-close</v-icon></v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "ToastNotification",
  data() {
    return {
      show: false,
      message: "",
      color: ""
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "alert/showMessage") {
        this.message = state.alert.message
        this.color = state.alert.color
        this.show = true
      }
    })
  }
}
</script>
