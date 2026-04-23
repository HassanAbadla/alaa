<template>
  <div>
    <v-btn :color="color" :small="small" :loading="loading" :disabled="disabled" @click="exportToPDF">
      <v-icon left small>mdi-file-pdf-box</v-icon>
      {{ $t("export_pdf.button_text") }}
    </v-btn>

    <!-- Domain Status Charts (for PDF capture) -->
    <div v-if="domainStatuses" style="position: absolute; left: -9999px">
      <div
        v-for="(status, index) in domainStatuses"
        :key="status.id"
        :ref="`domainChart_${index}`"
        style="width: 800px; padding: 20px; background: white"
      >
        <domain-status-chart :domain-status="status" />
      </div>
    </div>

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
  </div>
</template>

<script>
import { mapState } from "vuex"
import { amiriRegularBase64, amiriBoldBase64 } from "@/utils/amiriFont"
import DomainStatusChart from "@/components/DomainStatusChart.vue"
import AuditStatusReportChart from "@/components/AuditStatusReportChart.vue"
import AuditPercentageCompletedChart from "@/components/AuditPercentageCompletedChart.vue"

export default {
  name: "ExportToPDF",

  components: {
    DomainStatusChart,
    AuditStatusReportChart,
    AuditPercentageCompletedChart
  },

  props: {
    color: { type: String, default: "primary" },
    small: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    frameworkName: { type: String, default: "" },
    progressData: { type: Object, default: null },
    percentCompleted: { type: Number, default: 0 },
    fileName: { type: String, default: "report.pdf" },
    domainStatuses: { type: Array, default: () => [] },
    reportTitle: { type: String, default: "" },
    customerName: { type: String, default: "" },
    overallCompliancePercentage: { type: Number, default: 0 }
  },

  data() {
    return {
      loading: false,
      pageWidth: 210,
      pageHeight: 297,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20
    }
  },

  computed: {
    ...mapState("auth", ["user"]),
    ...mapState(["isRTL", "language"]),

    logoUrl() {
      return this.user?.tenant?.logo || null
    }
  },

  mounted() {
    // Load html2canvas from CDN
    if (!window.html2canvas) {
      const script1 = document.createElement("script")
      script1.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
      document.head.appendChild(script1)
    }

    // Load jsPDF from CDN
    if (!window.jspdf) {
      const script2 = document.createElement("script")
      script2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      document.head.appendChild(script2)
    }
  },

  methods: {
    /**
     * Fix punctuation positioning for RTL text in PDF
     * Moves trailing punctuation to the beginning for correct PDF rendering
     */
    fixRTLPunctuation(text) {
      if (!this.isRTL || !text || typeof text !== "string") {
        return text
      }

      // TEST 1 FIX: If text STARTS with ":", move it to the END
      if (text.startsWith(":")) {
        return text.substring(1) + ":"
      }

      // Return unchanged for now
      return text
    },

    /**
     * Setup PDF fonts for RTL/LTR support
     */
    setupPDFFont(pdf) {
      if (this.isRTL) {
        // Use Amiri fonts for Arabic (better glyph support)
        pdf.addFileToVFS("Amiri-Regular.ttf", amiriRegularBase64)
        pdf.addFont("Amiri-Regular.ttf", "Amiri-Regular", "normal", "Identity-H")

        pdf.addFileToVFS("Amiri-Bold.ttf", amiriBoldBase64)
        pdf.addFont("Amiri-Bold.ttf", "Amiri-Bold", "normal", "Identity-H")

        pdf.setFont("Amiri-Regular", "normal")
      } else {
        pdf.setFont("helvetica", "normal")
      }
    },

    /**
     * Set font to regular weight
     */
    setRegularFont(pdf) {
      if (this.isRTL) {
        pdf.setFont("Amiri-Regular", "normal")
      } else {
        pdf.setFont("helvetica", "normal")
      }
    },

    /**
     * Set font to bold weight
     */
    setBoldFont(pdf) {
      if (this.isRTL) {
        pdf.setFont("Amiri-Bold", "normal")
      } else {
        pdf.setFont("helvetica", "bold")
      }
    },

    /**
     * Get text alignment based on language direction
     */
    getAlign() {
      return this.isRTL ? "right" : "left"
    },

    /**
     * Add a section title (bold, larger font)
     */
    addSectionTitle(pdf, text, yPosition) {
      this.setBoldFont(pdf)
      pdf.setFontSize(14)
      const xPosition = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft

      // Fix punctuation before rendering
      const fixedText = this.fixRTLPunctuation(text)

      pdf.text(fixedText, xPosition, yPosition, { align: this.getAlign() })
      this.setRegularFont(pdf)
      pdf.setFontSize(11)
    },

    /**
     * Add a paragraph of text
     */
    addParagraph(pdf, text, yPosition, maxWidth = null) {
      const width = maxWidth || this.pageWidth - this.marginLeft - this.marginRight
      const xPosition = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft

      this.setRegularFont(pdf)
      pdf.setFontSize(11)

      // Fix punctuation before rendering
      const fixedText = this.fixRTLPunctuation(text)

      const lines = pdf.splitTextToSize(fixedText, width)
      pdf.text(lines, xPosition, yPosition, { align: this.getAlign() })

      return lines.length * 6
    },

    /**
     * Add a bullet point with bold label
     */
    addBoldLabeledBullet(pdf, label, text, yPosition, indent = 20) {
      const maxWidth = this.pageWidth - this.marginLeft - this.marginRight - indent
      const bulletX = this.isRTL ? this.pageWidth - this.marginRight - indent : this.marginLeft + indent

      // Add bullet
      this.setRegularFont(pdf)
      pdf.setFontSize(11)
      pdf.text("•", bulletX, yPosition, { align: this.getAlign() })

      // Add bold label - fix punctuation
      this.setBoldFont(pdf)
      const labelX = this.isRTL ? bulletX - 10 : bulletX + 10
      const fixedLabel = this.fixRTLPunctuation(label)
      pdf.text(fixedLabel, labelX, yPosition, { align: this.getAlign() })

      // Calculate positions for text
      const labelWidth = pdf.getTextWidth(fixedLabel)
      const textX = this.isRTL ? labelX - labelWidth - 5 : labelX + labelWidth + 5

      // Add regular text - fix punctuation
      this.setRegularFont(pdf)
      const fixedText = this.fixRTLPunctuation(text)
      const remainingWidth = maxWidth - labelWidth - 20
      const lines = pdf.splitTextToSize(fixedText, remainingWidth)
      pdf.text(lines, textX, yPosition, { align: this.getAlign() })

      return lines.length * 6
    },

    /**
     * Add a simple bullet point
     */
    addBullet(pdf, text, yPosition, indent = 20) {
      const maxWidth = this.pageWidth - this.marginLeft - this.marginRight - indent
      const bulletX = this.isRTL ? this.pageWidth - this.marginRight - indent : this.marginLeft + indent

      // Add bullet
      this.setRegularFont(pdf)
      pdf.setFontSize(11)
      pdf.text("•", bulletX, yPosition, { align: this.getAlign() })

      // Add text - fix punctuation
      const textX = this.isRTL ? bulletX - 10 : bulletX + 10
      const fixedText = this.fixRTLPunctuation(text)
      const lines = pdf.splitTextToSize(fixedText, maxWidth - 10)
      pdf.text(lines, textX, yPosition, { align: this.getAlign() })

      return lines.length * 6
    },

    /**
     * Capture chart as image
     */
    async captureChart(element) {
      if (!element) return null

      try {
        const canvas = await window.html2canvas(element, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false
        })
        return canvas.toDataURL("image/png")
      } catch (error) {
        console.error("Error capturing chart:", error)
        return null
      }
    },

    /**
     * Add chart image to PDF
     */
    addChartImage(pdf, imageData, yPosition, maxHeight = 80) {
      if (!imageData) return 0

      const imgWidth = this.pageWidth - this.marginLeft - this.marginRight
      const imgHeight = maxHeight
      const xPosition = this.marginLeft

      pdf.addImage(imageData, "PNG", xPosition, yPosition, imgWidth, imgHeight)

      return imgHeight + 10
    },

    /**
     * Format date helper
     */
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },

    /**
     * Load image as data URL
     */
    async loadImageAsDataURL(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas")
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0)
            const dataURL = canvas.toDataURL("image/png")
            resolve(dataURL)
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = (error) => {
          console.error("Failed to load image:", url)
          reject(error)
        }

        img.src = url
      })
    },

    /**
     * Get conclusion range
     */
    getConclusionRange(score) {
      if (score <= 20) return "very_weak"
      if (score <= 40) return "weak"
      if (score <= 50) return "emerging"
      if (score <= 60) return "moderate"
      if (score <= 80) return "strong"
      return "exceptional"
    },

    /**
     * Get recommendations range
     */
    getRecommendationsRange(score) {
      if (score <= 20) return "very_low"
      if (score <= 40) return "low"
      if (score <= 50) return "below_moderate"
      if (score <= 60) return "moderate"
      if (score <= 75) return "strong"
      return "excellent"
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
     * Main export function
     */
    async exportToPDF() {
      try {
        this.loading = true

        // Wait for jsPDF to load
        while (!window.jspdf) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        // Wait a bit for charts to render
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("✅ Starting PDF export...")

        const { jsPDF } = window.jspdf
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        })

        // Setup fonts
        this.setupPDFFont(pdf)

        let yPos = this.marginTop

        // ===== COVER PAGE =====
        const logoWidth = 50
        const logoHeight = 50
        const logoX = (this.pageWidth - logoWidth) / 2
        const logoY = this.pageHeight / 3

        // Add logo if available
        if (this.logoUrl) {
          try {
            const logoDataURL = await this.loadImageAsDataURL(this.logoUrl)
            pdf.addImage(logoDataURL, "PNG", logoX, logoY, logoWidth, logoHeight)
          } catch (logoError) {
            console.error("❌ Failed to add logo:", logoError)
          }
        }

        yPos = logoY + logoHeight + 10

        // Add title
        if (this.frameworkName) {
          this.setBoldFont(pdf)
          pdf.setFontSize(14)
          const title = this.$t("export_pdf.title", { title: this.frameworkName })
          const fixedTitle = this.fixRTLPunctuation(title)
          const lines = pdf.splitTextToSize(fixedTitle, this.pageWidth - this.marginLeft - this.marginRight)
          pdf.text(lines, this.pageWidth / 2, yPos, { align: "center" })
          yPos += lines.length * 7 + 5
        }

        // Add date
        this.setRegularFont(pdf)
        pdf.setFontSize(12)
        const currentDate = this.formatDate(new Date())
        pdf.text(currentDate, this.pageWidth / 2, yPos, { align: "center" })

        // Add "Approved by" section at bottom
        const approvedByY = this.pageHeight - 40
        const approvedByX = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft

        this.setRegularFont(pdf)
        pdf.setFontSize(11)
        const approvedByText = this.fixRTLPunctuation(this.$t("export_pdf.approved_by"))
        pdf.text(approvedByText, approvedByX, approvedByY, {
          align: this.getAlign()
        })

        // Signature line
        const signatureLineY = approvedByY + 20
        const signatureLineWidth = 60
        const signatureLineStart = this.isRTL ? this.pageWidth - this.marginRight - signatureLineWidth : this.marginLeft
        pdf.setLineWidth(0.3)
        pdf.line(signatureLineStart, signatureLineY, signatureLineStart + signatureLineWidth, signatureLineY)

        // ===== PAGE 2: REPORT CONTENT =====
        pdf.addPage()
        this.setupPDFFont(pdf)
        yPos = this.marginTop

        // Executive Summary
        this.addSectionTitle(pdf, this.$t("export_pdf.executive_summary.title"), yPos)
        yPos += 10

        yPos += this.addParagraph(pdf, this.$t("export_pdf.executive_summary.paragraph1"), yPos)
        yPos += 8

        yPos += this.addParagraph(pdf, this.$t("export_pdf.executive_summary.paragraph2"), yPos)
        yPos += 8

        yPos += this.addParagraph(pdf, this.$t("export_pdf.executive_summary.paragraph3"), yPos)
        yPos += 15

        // Introduction
        this.addSectionTitle(pdf, this.$t("export_pdf.introduction.title"), yPos)
        yPos += 10

        // Scope
        this.setBoldFont(pdf)
        pdf.setFontSize(12)
        const scopeX = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft
        const scopeTitle = this.fixRTLPunctuation(this.$t("export_pdf.introduction.scope.title"))
        pdf.text(scopeTitle, scopeX, yPos, {
          align: this.getAlign()
        })
        yPos += 8
        this.setRegularFont(pdf)
        pdf.setFontSize(11)

        yPos += this.addParagraph(
          pdf,
          this.$t("export_pdf.introduction.scope.framework_text", {
            frameworkName: this.frameworkName
          }),
          yPos
        )
        yPos += 8

        yPos += this.addParagraph(
          pdf,
          this.$t("export_pdf.introduction.scope.scope_intro", {
            customerName: this.customerName
          }),
          yPos
        )
        yPos += 8

        const documentsItem = this.$t("export_pdf.introduction.scope.items.documents")
        yPos += this.addBoldLabeledBullet(pdf, documentsItem.label, documentsItem.text, yPos)
        yPos += 8

        const processesItem = this.$t("export_pdf.introduction.scope.items.processes")
        yPos += this.addBoldLabeledBullet(pdf, processesItem.label, processesItem.text, yPos)
        yPos += 15

        // Check for page break
        if (yPos > this.pageHeight - 50) {
          pdf.addPage()
          this.setupPDFFont(pdf)
          yPos = this.marginTop
        }

        // Methodology
        this.setBoldFont(pdf)
        pdf.setFontSize(12)
        const methodologyX = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft
        const methodologyTitle = this.fixRTLPunctuation(this.$t("export_pdf.introduction.methodology.title"))
        pdf.text(methodologyTitle, methodologyX, yPos, {
          align: this.getAlign()
        })
        yPos += 8
        this.setRegularFont(pdf)
        pdf.setFontSize(11)

        yPos += this.addParagraph(pdf, this.$t("export_pdf.introduction.methodology.intro"), yPos)
        yPos += 8

        const methodologyItems = this.$t("export_pdf.introduction.methodology.items")
        yPos += this.addBoldLabeledBullet(
          pdf,
          methodologyItems.documentation_review.label,
          methodologyItems.documentation_review.text,
          yPos
        )
        yPos += 8

        yPos += this.addBoldLabeledBullet(
          pdf,
          methodologyItems.control_mapping.label,
          methodologyItems.control_mapping.text,
          yPos
        )
        yPos += 8

        yPos += this.addBoldLabeledBullet(
          pdf,
          methodologyItems.gap_analysis.label,
          methodologyItems.gap_analysis.text,
          yPos
        )
        yPos += 8

        yPos += this.addBoldLabeledBullet(
          pdf,
          methodologyItems.evidence_correlation.label,
          methodologyItems.evidence_correlation.text,
          yPos
        )
        yPos += 15

        // ===== COMPLIANCE OVERVIEW WITH CHARTS =====
        if (yPos > this.pageHeight - 100) {
          pdf.addPage()
          this.setupPDFFont(pdf)
          yPos = this.marginTop
        }

        this.addSectionTitle(pdf, this.$t("export_pdf.compliance_overview.title"), yPos)
        yPos += 10

        // Add charts
        if (this.$refs.auditStatusChart) {
          const auditStatusImage = await this.captureChart(this.$refs.auditStatusChart)
          if (auditStatusImage) {
            if (yPos > this.pageHeight - 90) {
              pdf.addPage()
              this.setupPDFFont(pdf)
              yPos = this.marginTop
            }
            yPos += this.addChartImage(pdf, auditStatusImage, yPos, 80)
          }
        }

        if (this.$refs.percentCompletedChart) {
          const percentCompletedImage = await this.captureChart(this.$refs.percentCompletedChart)
          if (percentCompletedImage) {
            if (yPos > this.pageHeight - 50) {
              pdf.addPage()
              this.setupPDFFont(pdf)
              yPos = this.marginTop
            }
            yPos += this.addChartImage(pdf, percentCompletedImage, yPos, 40)
          }
        }

        yPos += 10

        // ===== AUDIT FINDINGS =====
        if (yPos > this.pageHeight - 100) {
          pdf.addPage()
          this.setupPDFFont(pdf)
          yPos = this.marginTop
        }

        this.addSectionTitle(pdf, this.$t("export_pdf.audit_findings.title"), yPos)
        yPos += 10

        // Add subtitle
        this.setBoldFont(pdf)
        pdf.setFontSize(12)
        const subtitleX = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft
        const subtitle = this.fixRTLPunctuation(this.$t("export_pdf.audit_findings.subtitle"))
        pdf.text(subtitle, subtitleX, yPos, {
          align: this.getAlign()
        })
        yPos += 10
        this.setRegularFont(pdf)
        pdf.setFontSize(11)

        // Add domain charts
        if (this.domainStatuses && this.domainStatuses.length > 0) {
          for (let i = 0; i < this.domainStatuses.length; i++) {
            const chartRefs = this.$refs[`domainChart_${i}`]
            const chartContainer = chartRefs ? chartRefs[0] : null

            if (chartContainer) {
              try {
                const domainChartImage = await this.captureChart(chartContainer)
                if (domainChartImage) {
                  if (yPos > this.pageHeight - 70) {
                    pdf.addPage()
                    this.setupPDFFont(pdf)
                    yPos = this.marginTop
                  }
                  yPos += this.addChartImage(pdf, domainChartImage, yPos, 60)
                }
              } catch (error) {
                console.error(`❌ Failed to add chart ${i + 1}:`, error)
              }
            }
          }
        }

        yPos += 10

        // Conclusion
        const conclusion = this.getConclusion()
        yPos += this.addParagraph(pdf, conclusion, yPos)
        yPos += 15

        // Recommendations
        if (yPos > this.pageHeight - 100) {
          pdf.addPage()
          this.setupPDFFont(pdf)
          yPos = this.marginTop
        }

        this.setBoldFont(pdf)
        pdf.setFontSize(12)
        const recX = this.isRTL ? this.pageWidth - this.marginRight : this.marginLeft
        const recTitle = this.fixRTLPunctuation(this.$t("export_pdf.audit_findings.recommendations.title"))
        pdf.text(recTitle, recX, yPos, {
          align: this.getAlign()
        })
        yPos += 10
        this.setRegularFont(pdf)
        pdf.setFontSize(11)

        const recommendations = this.getRecommendations()

        if (recommendations.executive_action) {
          yPos += this.addParagraph(pdf, recommendations.executive_action, yPos)
          yPos += 8
        }

        if (recommendations.items) {
          for (const item of recommendations.items) {
            if (yPos > this.pageHeight - 50) {
              pdf.addPage()
              this.setupPDFFont(pdf)
              yPos = this.marginTop
            }
            yPos += this.addBullet(pdf, item, yPos)
            yPos += 8
          }
        }

        yPos += 15

        // ===== APPENDIX =====
        if (yPos > this.pageHeight - 50) {
          pdf.addPage()
          this.setupPDFFont(pdf)
          yPos = this.marginTop
        }

        this.addSectionTitle(pdf, this.$t("export_pdf.appendix.title"), yPos)
        yPos += 10

        yPos += this.addParagraph(pdf, this.$t("export_pdf.appendix.paragraph"), yPos)

        // Save PDF
        const fileName = `${this.reportTitle} - ${new Date().toISOString().split("T")[0]}.pdf`
        pdf.save(fileName)

        console.log("💾 PDF saved!")

        this.$store.dispatch("showSnackbar", {
          message: "PDF generated successfully!",
          color: "success"
        })
      } catch (error) {
        console.error("❌ Error generating PDF:", error)
        this.$store.dispatch("showSnackbar", {
          message: "Error generating PDF: " + error.message,
          color: "error"
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Component styles */
</style>
