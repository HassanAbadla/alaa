/**
 * PDF Export Mixin
 * Shared methods for PDF generation across different report types
 * Uses pdfmake library with Cairo font for Arabic/RTL support
 */

import { cairoRegularBase64, cairoBoldBase64 } from "@/utils/fonts"

export default {
  methods: {
    /**
     * Setup pdfmake fonts (Cairo for Arabic/RTL support)
     */
    setupPdfMakeFonts(pdfMake) {
      pdfMake.vfs = {
        "Cairo-Regular.ttf": cairoRegularBase64,
        "Cairo-Bold.ttf": cairoBoldBase64
      }

      pdfMake.fonts = {
        Cairo: {
          normal: "Cairo-Regular.ttf",
          bold: "Cairo-Bold.ttf"
        }
      }
    },

    /**
     * Process Arabic text for pdfmake
     * Mirrors brackets and reverses word order for correct RTL rendering
     */
    processArabicForPdfmake(text) {
      if (!text || typeof text !== "string") return text

      // Only process if RTL
      if (!this.$store.state.isRTL) return text

      // Step 1: Mirror brackets for RTL
      let processed = text
        .replace(/\(/g, "<<<TEMP_OPEN>>>")
        .replace(/\)/g, "(")
        .replace(/<<<TEMP_OPEN>>>/g, ")")

      // Step 2: Reverse word order (split by space, reverse, rejoin)
      processed = processed.split(" ").reverse().join(" ")

      return processed
    },

    /**
     * Capture chart/element as base64 image using html2canvas
     */
    async captureChartAsImage(refName, waitTime = 1000) {
      let chartElement = this.$refs[refName]

      // Handle array refs from v-for
      if (Array.isArray(chartElement)) {
        chartElement = chartElement[0]
      }

      if (!chartElement) {
        console.log(`⚠️ Chart element ${refName} not found`)
        return null
      }

      // Verify element is in DOM
      if (!document.body.contains(chartElement)) {
        console.error(`⚠️ Chart element ${refName} not attached to document`)
        return null
      }

      try {
        // Ensure html2canvas is loaded
        if (!window.html2canvas) {
          await this.loadHtml2Canvas()
        }

        // Wait for chart to render (customizable wait time)
        console.log(`⏳ Waiting ${waitTime}ms for ${refName} to render...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))

        console.log(`📸 Capturing ${refName}...`)
        const canvas = await window.html2canvas(chartElement, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false, // Disable logging for cleaner console
          useCORS: true,
          allowTaint: true,
          windowWidth: chartElement.scrollWidth,
          windowHeight: chartElement.scrollHeight
        })

        console.log(`✅ Canvas created: ${canvas.width}x${canvas.height}`)

        const dataUrl = canvas.toDataURL("image/png")
        const sizeKB = Math.round(dataUrl.length / 1024)
        console.log(`📦 Image size: ${sizeKB} KB`)

        return dataUrl
      } catch (error) {
        console.error(`❌ Error capturing ${refName}:`, error)
        return null
      }
    },

    /**
     * Load html2canvas library from CDN
     */
    async loadHtml2Canvas() {
      return new Promise((resolve, reject) => {
        if (window.html2canvas) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    },

    /**
     * Format date as DD/MM/YYYY
     */
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },

    /**
     * Format date as YYYY/MM/DD (alternative format)
     */
    formatDateYMD(date) {
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return `${year}/${month}/${day}`
    },

    /**
     * Get text alignment based on RTL/LTR
     */
    getAlignment() {
      return this.$store.state.isRTL ? "right" : "left"
    },

    /**
     * Get opposite alignment (for positioning elements on opposite side)
     */
    getOppositeAlignment() {
      return this.$store.state.isRTL ? "left" : "right"
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
     * Get X position for left-aligned content (respects RTL)
     */
    getLeftX(pageWidth, marginLeft, marginRight) {
      return this.$store.state.isRTL ? pageWidth - marginRight : marginLeft
    },

    /**
     * Get X position for right-aligned content (respects RTL)
     */
    getRightX(pageWidth, marginLeft, marginRight) {
      return this.$store.state.isRTL ? marginLeft : pageWidth - marginRight
    },
    /**
     * CONTENT BUILDERS - Return objects, don't manage arrays
     */

    /**
     * Simple bullet point (just "• text")
     */
    bullet(text, options = {}) {
      return {
        text: "• " + this.processArabicForPdfmake(text),
        fontSize: options.fontSize || 11,
        alignment: this.getAlignment(),
        margin: options.margin || [20, 0, 0, 5]
      }
    },

    /**
     * Bold labeled bullet point (e.g., "Documents: text here")
     */
    boldLabeledBullet(label, text, options = {}) {
      return {
        text: [
          {
            text: this.processArabicForPdfmake(label) + " ",
            bold: true
          },
          {
            text: this.processArabicForPdfmake(text),
            bold: false
          }
        ],
        fontSize: options.fontSize || 11,
        alignment: this.getAlignment(),
        margin: options.margin || [20, 0, 0, 5]
      }
    },

    /**
     * Page break
     */
    pageBreak() {
      return { text: "", pageBreak: "before" }
    },

    /**
     * Section title (e.g., "1. EXECUTIVE SUMMARY")
     */
    sectionTitle(text, options = {}) {
      return {
        text: this.processArabicForPdfmake(text),
        fontSize: options.fontSize || 14,
        bold: options.bold !== false,
        color: options.color || "#0C1B2A", // ← Dark navy (default)
        alignment: this.getAlignment(),
        margin: options.margin || [0, 0, 0, 10]
      }
    },

    /**
     * Subsection title (e.g., "2.1.SCOPE:")
     */
    subsectionTitle(text, options = {}) {
      return {
        text: this.processArabicForPdfmake(text),
        fontSize: options.fontSize || 12,
        bold: options.bold !== false,
        color: options.color || "#2D4989", // ← Blue (default)
        alignment: this.getAlignment(),
        margin: options.margin || [0, 10, 0, 8]
      }
    },

    /**
     * Paragraph
     */
    paragraph(text, options = {}) {
      return {
        text: this.processArabicForPdfmake(text),
        fontSize: options.fontSize || 11,
        alignment: this.getAlignment(),
        margin: options.margin || [0, 0, 0, 8]
      }
    },

    /**
     * Centered text
     */
    centeredText(text, options = {}) {
      return {
        text: this.processArabicForPdfmake(text),
        fontSize: options.fontSize || 11,
        bold: options.bold || false,
        alignment: "center",
        margin: options.margin || [0, 0, 0, 5]
      }
    },

    /**
     * Image block
     */
    imageBlock(dataUrl, options = {}) {
      if (!dataUrl || !dataUrl.startsWith("data:image/")) return null

      return {
        image: dataUrl,
        width: options.width || 400,
        alignment: options.alignment || "center",
        margin: options.margin || [0, 10, 0, 20]
      }
    }
  }
}
