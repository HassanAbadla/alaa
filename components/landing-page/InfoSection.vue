<template>
  <v-container fluid id="features">
    <v-row>
      <v-col v-for="(section, i) in infoDataSection" :key="i" cols="12" sm="6" md="4" :lg="lg">
        <info-card :image="section.image" :title="section.titleKey" :bullets="section.bulletKeys" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InfoCard from "./InfoCard.vue"
export default {
  components: { InfoCard },
  name: "InfoSection",
  data() {
    return {
      lg: "3",
      ossData: [
        {
          image: "5",
          titleKey: "landing.oss.enhance_productivity.title",
          bulletKeys: ["landing.oss.enhance_productivity.bullets.0", "landing.oss.enhance_productivity.bullets.1"]
        },
        {
          image: "6",
          titleKey: "landing.oss.future_scale.title",
          bulletKeys: ["landing.oss.future_scale.bullets.0", "landing.oss.future_scale.bullets.1"]
        },
        {
          image: "4",
          titleKey: "landing.oss.best_practice.title",
          bulletKeys: ["landing.oss.best_practice.bullets.0", "landing.oss.best_practice.bullets.1"]
        }
      ],

      sectionData: [
        {
          image: "5",
          titleKey: "landing.governance_management.title",
          bulletKeys: [
            "landing.governance_management.bullets.0",
            "landing.governance_management.bullets.1",
            "landing.governance_management.bullets.2",
            "landing.governance_management.bullets.3"
          ]
        },
        {
          image: "6",
          titleKey: "landing.compliance_management.title",
          bulletKeys: [
            "landing.compliance_management.bullets.0",
            "landing.compliance_management.bullets.1",
            "landing.compliance_management.bullets.2",
            "landing.compliance_management.bullets.3",
            "landing.compliance_management.bullets.4"
          ]
        },
        {
          image: "4",
          titleKey: "landing.risk_management.title",
          bulletKeys: [
            "landing.risk_management.bullets.0",
            "landing.risk_management.bullets.1",
            "landing.risk_management.bullets.2",
            "landing.risk_management.bullets.3"
          ]
        },
        {
          image: "2",
          titleKey: "landing.initiative_management.title",
          bulletKeys: [
            "landing.initiative_management.bullets.0",
            "landing.initiative_management.bullets.1",
            "landing.initiative_management.bullets.2",
            "landing.initiative_management.bullets.3"
          ]
        },
        {
          image: "1",
          titleKey: "landing.dashboards.title",
          bulletKeys: ["landing.dashboards.bullets.0"]
        },
        {
          image: "5",
          titleKey: "landing.document_management.title",
          bulletKeys: [
            "landing.document_management.bullets.0",
            "landing.document_management.bullets.1",
            "landing.document_management.bullets.2",
            "landing.document_management.bullets.3"
          ]
        },
        {
          image: "3",
          titleKey: "landing.business_units.title",
          bulletKeys: [
            "landing.business_units.bullets.0",
            "landing.business_units.bullets.1",
            "landing.business_units.bullets.2",
            "landing.business_units.bullets.3"
          ]
        },
        {
          image: "1",
          titleKey: "landing.support_on_premise_deployment.title",
          bulletKeys: [
            "landing.support_on_premise_deployment.bullets.0",
            "landing.support_on_premise_deployment.bullets.1",
            "landing.support_on_premise_deployment.bullets.2"
          ]
        }
      ]
    }
  },

  computed: {
    infoDataSection() {
      if (this.$route.path === "/oss") {
        this.lg = "4"
        return this.ossData
      }
      return this.sectionData
    }
  }
}
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
