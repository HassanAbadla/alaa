<template>
  <div class="star-rating d-flex align-center">
    <v-icon v-for="star in stars" :key="star.index" :color="star.color" small class="star-icon">
      {{ star.icon }}
    </v-icon>
  </div>
</template>

<script>
export default {
  name: "StarRating",
  props: {
    rating: {
      type: [Number, String],
      required: true
    },
    maxRating: {
      type: Number,
      default: 5
    }
  },
  computed: {
    normalizedRating() {
      const numRating = parseFloat(this.rating)
      return isNaN(numRating) ? 0 : Math.max(0, Math.min(this.maxRating, numRating))
    },
    stars() {
      const stars = []
      const rating = this.normalizedRating

      for (let i = 1; i <= this.maxRating; i++) {
        const starValue = i
        let icon, color

        if (rating >= starValue) {
          // Full star
          icon = "mdi-star"
          color = "secondary"
        } else if (rating >= starValue - 0.5) {
          // Half star
          icon = "mdi-star-half-full"
          color = "secondary"
        } else {
          // Empty star
          icon = "mdi-star-outline"
          color = "grey"
        }

        stars.push({
          index: i,
          icon,
          color
        })
      }

      return stars
    }
  }
}
</script>

<style scoped>
.star-rating {
  gap: 1px;
}

.star-icon {
  cursor: default;
}
</style>
