<template>
  <v-container fluid id="features" class="mt-2">
    <v-row align="center" justify="center">
      <v-col cols="10">
        <v-row align="center" justify="space-around">
          <v-col cols="12" class="text-center">
            <h1 class="font-weight-light display-1">Title</h1>
            <h3 class="font-weight-light">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
          </v-col>
          <v-col cols="12" sm="4" class="text-center" v-for="(feature, i) in 4" :key="i">
            <v-hover v-slot:default="{ hover }">
              <v-card class="card pt-2" shaped :elevation="hover ? 10 : 4" :class="{ up: hover }">
                <v-layout justify-center align-center>
                  <v-icon size="50" class="mb-2">mdi-account</v-icon>
                </v-layout>
                <v-card-title>
                  <v-spacer />
                  <h3 class="font-weight-bold">Title</h3>
                  <v-spacer />
                </v-card-title>
                <v-card-text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MoreInfoSection"
}
</script>

<style></style>
