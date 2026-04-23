<template>
  <div>
    <v-btn :color="color" :small="small" :loading="loading" :disabled="disabled" @click="exportToPDF">
      <v-icon left small>mdi-file-pdf-box</v-icon>
      {{ $t("export_pdf.button_text") }}
    </v-btn>

    <!-- Audit Status Report Chart (for PDF capture) -->
    <div v-if="progressData" style="position: absolute; left: -9999px">
      <div ref="auditStatusChart" style="width: 800px; padding: 20px; background: white">
        <audit-status-report-chart
          :chart-data="progressData"
          :title="$t('export_pdf.compliance_overview.compliance_status_title', { frameworkName })"
        />
      </div>
    </div>

    <!-- Audit Percentage Completed Chart (for PDF capture) -->
    <div v-if="percentCompleted !== null" style="position: absolute; left: -9999px">
      <div ref="percentCompletedChart" style="width: 800px; padding: 20px; background: white">
        <audit-percentage-completed-chart
          :percent-completed="percentCompleted"
          :title="$t('export_pdf.compliance_overview.completion_title', { frameworkName })"
        />
      </div>
    </div>

    <!-- Domain Status Charts (for PDF capture) -->
    <div v-if="domainStatuses && domainStatuses.length" style="position: fixed; left: -10000px; top: 0">
      <div
        v-for="(status, index) in domainStatuses"
        :key="`domain-${status.id || index}`"
        :ref="`domainChart_${index}`"
        style="width: 800px; padding: 20px; background: white; margin-bottom: 20px"
      >
        <domain-status-chart :domain-status="status" />
      </div>
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake"
import { mapState } from "vuex"
import pdfExportMixin from "@/mixins/pdfExportMixin"
import AuditStatusReportChart from "@/components/AuditStatusReportChart.vue"
import AuditPercentageCompletedChart from "@/components/AuditPercentageCompletedChart.vue"
import DomainStatusChart from "@/components/DomainStatusChart.vue"

export default {
  name: "AuditRoundsExportToPDF",

  components: {
    AuditStatusReportChart,
    AuditPercentageCompletedChart,
    DomainStatusChart
  },

  mixins: [pdfExportMixin],

  props: {
    color: {
      type: String,
      default: "primary"
    },
    small: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    reportTitle: {
      type: String,
      required: true
    },
    frameworkName: {
      type: String,
      default: ""
    },
    customerName: {
      type: String,
      default: ""
    },
    progressData: {
      type: Object,
      default: null
    },
    percentCompleted: {
      type: Number,
      default: 0
    },
    domainStatuses: {
      type: Array,
      default: () => []
    },
    overallCompliancePercentage: {
      type: Number,
      default: 0
    },
    fileName: {
      type: String,
      default: "report.pdf"
    }
  },

  data() {
    return {
      loading: false,
      // Page settings in POINTS (for pdfMake)
      pageWidth: 595.28,
      pageHeight: 841.89,
      marginLeft: 56.69,
      marginRight: 56.69,
      marginTop: 56.69,
      marginBottom: 56.69
    }
  },

  computed: {
    ...mapState("auth", ["user"]),
    ...mapState(["isRTL"]),

    logoUrl() {
      return this.user?.tenant?.logo || null
    }
  },

  mounted() {
    // Load html2canvas from CDN
    if (!window.html2canvas) {
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
      document.head.appendChild(script)
    }
  },

  methods: {
    /**
     * Main export function - generates PDF
     */
    async exportToPDF() {
      try {
        this.loading = true

        console.log("🎨 Starting PDF generation...")

        // Setup fonts
        this.setupPdfMakeFonts(pdfMake)

        // Pre-load logo data URL (needed synchronously in header function)
        let logoDataURL = null
        if (this.logoUrl) {
          try {
            const baseURL = this.$axios.defaults.baseURL
            const proxyUrl = `${baseURL}/proxy-docx?url=${encodeURIComponent(this.logoUrl)}`
            const response = await fetch(proxyUrl)
            if (!response.ok) throw new Error(`Failed to fetch logo: ${response.statusText}`)
            const arrayBuffer = await response.arrayBuffer()
            const sig = new Uint8Array(arrayBuffer.slice(0, 4))
            let mimeType = null
            if (sig[0] === 0x89 && sig[1] === 0x50) mimeType = "image/png"
            else if (sig[0] === 0xff && sig[1] === 0xd8) mimeType = "image/jpeg"
            else if (sig[0] === 0x47 && sig[1] === 0x49) mimeType = "image/gif"
            else if (sig[0] === 0x52 && sig[1] === 0x49) mimeType = "image/webp"
            else if (sig[0] === 0x42 && sig[1] === 0x4d) mimeType = "image/bmp"
            else if ((sig[0] === 0x49 && sig[1] === 0x49) || (sig[0] === 0x4d && sig[1] === 0x4d)) mimeType = "image/tiff"
            // SVG: "<svg" or "<?xml" — also handle UTF-8 BOM (ef bb bf) prefix
            else if (sig[0] === 0x3c && (sig[1] === 0x73 || sig[1] === 0x3f)) mimeType = "image/svg+xml"
            else if (sig[0] === 0xef && sig[1] === 0xbb && sig[2] === 0xbf) mimeType = "image/svg+xml"
            if (!mimeType) throw new Error(`Logo: unrecognized image format (bytes: ${sig[0].toString(16)} ${sig[1].toString(16)} ${sig[2].toString(16)} ${sig[3].toString(16)})`)
            const blobUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: mimeType }))
            logoDataURL = await new Promise((resolve) => {
              const img = new Image()
              img.onload = () => {
                // SVGs with relative dimensions (width="100%") report naturalWidth=0
                const w = img.naturalWidth || 200
                const h = img.naturalHeight || 200
                try {
                  const canvas = document.createElement("canvas")
                  canvas.width = w
                  canvas.height = h
                  canvas.getContext("2d").drawImage(img, 0, 0, w, h)
                  resolve(canvas.toDataURL("image/png"))
                } catch (e) {
                  console.error("❌ Logo canvas error:", e)
                  resolve(null)
                } finally {
                  URL.revokeObjectURL(blobUrl)
                }
              }
              img.onerror = () => {
                URL.revokeObjectURL(blobUrl)
                resolve(null)
              }
              img.src = blobUrl
            })
          } catch (e) {
            console.error("❌ Failed to load logo for header:", e)
          }
        }

        // Build document definition
        const docDefinition = {
          pageSize: "A4",
          pageMargins: [this.marginLeft, this.marginTop, this.marginRight, this.marginBottom],
          defaultStyle: {
            font: "Cairo"
          },
          header: (currentPage) => {
            if (currentPage === 1 || !logoDataURL) return null
            return {
              image: logoDataURL,
              width: 30,
              height: 30,
              alignment: this.isRTL ? "left" : "right",
              margin: this.isRTL ? [this.marginLeft, 15, 0, 0] : [0, 15, this.marginRight, 0]
            }
          },
          content: [
            ...(await this.buildCoverPage(logoDataURL)),
            ...this.buildPage2(),
            ...(await this.buildPage3()),
            ...(await this.buildPage4())
          ]
        }

        console.log("💾 Creating PDF...")
        pdfMake.createPdf(docDefinition).download(this.fileName)

        console.log("✅ PDF generated successfully!")
      } catch (error) {
        console.error("❌ Error generating PDF:", error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Get conclusion range based on compliance percentage
     */
    getConclusionRange(score) {
      if (score <= 20) return "very_weak"
      if (score <= 40) return "weak"
      if (score <= 50) return "emerging"
      if (score <= 60) return "moderate"
      if (score <= 80) return "strong"
      if (score <= 99) return "exceptional"
      return "perfect"
    },

    /**
     * Get recommendations range based on compliance percentage
     */
    getRecommendationsRange(score) {
      if (score <= 20) return "very_low"
      if (score <= 40) return "low"
      if (score <= 50) return "below_moderate"
      if (score <= 60) return "moderate"
      if (score <= 80) return "strong"
      if (score <= 99) return "excellent"
      return "perfect"
    },

    /**
     * Get conclusion text
     */
    getConclusion() {
      const percentage = this.overallCompliancePercentage
      const range = this.getConclusionRange(percentage)

      const template = this.$t("export_pdf.audit_findings.conclusion.template")
      const vars = this.$t(`export_pdf.audit_findings.conclusion.ranges.${range}`)

      return template
        .replace("{variable1}", vars.variable1)
        .replace("{variable2}", vars.variable2)
        .replace("{variable3}", vars.variable3)
    },

    /**
     * Get recommendations
     */
    getRecommendations() {
      const percentage = this.overallCompliancePercentage
      const range = this.getRecommendationsRange(percentage)

      return this.$t(`export_pdf.audit_findings.recommendations.ranges.${range}`)
    },

    /**
     * PAGE 1: Cover Page
     */
    async buildCoverPage(logoDataURL = null) {
      const content = []

      // Add logo if available (centered, larger)
      if (logoDataURL) {
        content.push({
          image: logoDataURL,
          width: 80,
          height: 80,
          alignment: "center",
          margin: [0, 90, 0, 20]
        })
      }

      // Add report title
      const titleText = this.processArabicForPdfmake(
        this.$t("export_pdf.title", { title: this.frameworkName || this.reportTitle })
      )

      content.push({
        text: titleText,
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 15]
      })

      // Add date
      const currentDate = this.formatDateYMD(new Date())

      content.push({
        text: currentDate,
        fontSize: 12,
        alignment: "center",
        margin: [0, 0, 0, 0]
      })

      // Add "Approved by" section at very bottom
      const approvedByText = this.processArabicForPdfmake(this.$t("export_pdf.approved_by"))

      const signatureLineY = this.pageHeight - this.marginBottom
      const approvedByY = signatureLineY - 70
      const signatureLineWidth = 170

      content.push({
        stack: [
          {
            text: approvedByText,
            fontSize: 11,
            alignment: this.getAlignment(),
            margin: [0, 0, 0, 10]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: signatureLineWidth,
                y2: 0,
                lineWidth: 0.5
              }
            ]
          }
        ],
        absolutePosition: {
          x: this.isRTL ? this.pageWidth - this.marginRight - signatureLineWidth : this.marginLeft,
          y: approvedByY
        },
        width: signatureLineWidth
      })

      return content
    },

    /**
     * PAGE 2: Executive Summary + Introduction
     */
    buildPage2() {
      const content = []

      // Start new page
      content.push(this.pageBreak())

      // === EXECUTIVE SUMMARY ===
      content.push(this.sectionTitle(this.$t("export_pdf.executive_summary.title")))
      content.push(this.paragraph(this.$t("export_pdf.executive_summary.paragraph1")))

      // === INTRODUCTION ===
      content.push(this.sectionTitle(this.$t("export_pdf.introduction.title"), { margin: [0, 15, 0, 10] }))

      // Scope subsection
      content.push(this.subsectionTitle(this.$t("export_pdf.introduction.scope.title")))

      content.push(
        this.paragraph(this.$t("export_pdf.introduction.scope.framework_text", { frameworkName: this.frameworkName }))
      )

      content.push(
        this.paragraph(this.$t("export_pdf.introduction.scope.scope_intro", { customerName: this.customerName }))
      )

      // Scope bullets
      const documentsItem = this.$t("export_pdf.introduction.scope.items.documents")
      content.push(this.boldLabeledBullet(documentsItem.label, documentsItem.text))

      const processesItem = this.$t("export_pdf.introduction.scope.items.processes")
      content.push(this.boldLabeledBullet(processesItem.label, processesItem.text, { margin: [20, 0, 0, 15] }))

      // Methodology subsection
      content.push(this.subsectionTitle(this.$t("export_pdf.introduction.methodology.title")))
      content.push(this.paragraph(this.$t("export_pdf.introduction.methodology.intro")))

      // Methodology bullets
      const methodologyItems = this.$t("export_pdf.introduction.methodology.items")

      content.push(
        this.boldLabeledBullet(methodologyItems.documentation_review.label, methodologyItems.documentation_review.text)
      )

      content.push(
        this.boldLabeledBullet(methodologyItems.control_mapping.label, methodologyItems.control_mapping.text)
      )

      content.push(this.boldLabeledBullet(methodologyItems.gap_analysis.label, methodologyItems.gap_analysis.text))

      content.push(
        this.boldLabeledBullet(methodologyItems.evidence_correlation.label, methodologyItems.evidence_correlation.text)
      )

      return content
    },

    /**
     * PAGE 3: Compliance Overview with Charts
     */
    async buildPage3() {
      const content = []

      // Start new page
      content.push(this.pageBreak())

      // === COMPLIANCE OVERVIEW ===
      content.push(this.sectionTitle(this.$t("export_pdf.compliance_overview.title")))
      content.push(this.paragraph(this.$t("export_pdf.compliance_overview.paragraph")))

      // Capture and add Audit Status Chart (Pie Chart)
      if (this.$refs.auditStatusChart) {
        console.log("📊 Capturing Audit Status Chart...")
        const auditStatusImage = await this.captureChartAsImage("auditStatusChart")
        if (auditStatusImage) {
          const imageBlock = this.imageBlock(auditStatusImage, {
            width: 480,
            alignment: "center",
            margin: [0, 10, 0, 20]
          })
          if (imageBlock) content.push(imageBlock)
        }
      }

      // Capture and add Percent Completed Chart (Horizontal Bar)
      if (this.$refs.percentCompletedChart) {
        console.log("📊 Capturing Percent Completed Chart...")
        const percentCompletedImage = await this.captureChartAsImage("percentCompletedChart")
        if (percentCompletedImage) {
          const imageBlock = this.imageBlock(percentCompletedImage, {
            width: 480,
            alignment: "center",
            margin: [0, 0, 0, 20]
          })
          if (imageBlock) content.push(imageBlock)
        }
      }

      return content
    },

    /**
     * PAGE 4: Audit Findings & Recommendations
     */
    async buildPage4() {
      const content = []

      // Start new page
      content.push(this.pageBreak())

      // === AUDIT FINDINGS ===
      content.push(this.sectionTitle(this.$t("export_pdf.audit_findings.title")))

      // Subtitle
      content.push(this.subsectionTitle(this.$t("export_pdf.audit_findings.subtitle")))

      // Domain Charts
      if (this.domainStatuses && this.domainStatuses.length > 0) {
        console.log(`📊 Capturing ${this.domainStatuses.length} domain charts...`)

        // Wait for all domain charts to mount
        await new Promise((resolve) => setTimeout(resolve, 2000))

        for (let i = 0; i < this.domainStatuses.length; i++) {
          const refName = `domainChart_${i}`

          // Get the ref (it's an array in v-for)
          const chartRefs = this.$refs[refName]

          console.log(`🔍 Checking ref ${refName}:`, chartRefs)

          if (chartRefs && chartRefs.length > 0) {
            const chartContainer = chartRefs[0]

            // Verify element is in document
            if (chartContainer && document.body.contains(chartContainer)) {
              console.log(`📊 Capturing domain chart ${i + 1}/${this.domainStatuses.length}...`)
              console.log(`  - Element in DOM:`, document.body.contains(chartContainer))
              console.log(`  - Dimensions: ${chartContainer.offsetWidth}x${chartContainer.offsetHeight}`)

              const domainChartImage = await this.captureChartAsImage(refName, 1500)

              if (domainChartImage) {
                const imageBlock = this.imageBlock(domainChartImage, {
                  width: 480,
                  alignment: "center",
                  margin: [0, 10, 0, 20]
                })
                if (imageBlock) {
                  content.push(imageBlock)
                  console.log(`✅ Domain chart ${i + 1} added to PDF`)
                }
              }
            } else {
              console.error(`❌ Domain chart ${i} not in document`)
            }
          } else {
            console.error(`❌ Domain chart ref ${refName} not found or empty`)
          }
        }
      }

      // Conclusion
      const conclusion = this.getConclusion()
      content.push(this.paragraph(conclusion, { margin: [0, 10, 0, 15] }))

      // Recommendations
      content.push(this.subsectionTitle(this.$t("export_pdf.audit_findings.recommendations.title")))

      const recommendations = this.getRecommendations()

      // Executive action paragraph
      if (recommendations.executive_action) {
        content.push(this.paragraph(recommendations.executive_action))
      }

      // Recommendation bullets
      if (recommendations.items && recommendations.items.length > 0) {
        recommendations.items.forEach((item) => {
          content.push(this.bullet(item))
        })
      }

      return content
    }
  }
}
</script>

<style scoped>
/* Component styles if needed */
</style>
