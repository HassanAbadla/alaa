// utils/editorJsToHtml.js

/**
 * Convert Editor.js JSON data to HTML
 * @param {Object|String} editorData - Editor.js data (object or JSON string)
 * @returns {String} HTML string
 */
export function Editorjstohtml(editorData) {
  // Parse if it's a string
  let data
  try {
    data = typeof editorData === "string" ? JSON.parse(editorData) : editorData
  } catch (error) {
    console.error("Failed to parse editor data:", error)
    return ""
  }

  if (!data || !data.blocks) {
    return ""
  }

  let html = ""

  data.blocks.forEach((block) => {
    switch (block.type) {
      case "header":
        const level = block.data.level || 2
        html += `<h${level}>${block.data.text}</h${level}>`
        break

      case "paragraph":
        html += `<p>${block.data.text || ""}</p>`
        break

      case "list":
        const listTag = block.data.style === "ordered" ? "ol" : "ul"
        html += `<${listTag}>`
        block.data.items.forEach((item) => {
          html += `<li>${item}</li>`
        })
        html += `</${listTag}>`
        break

      case "checklist":
        html += '<ul class="checklist">'
        block.data.items.forEach((item) => {
          const checked = item.checked ? "checked" : ""
          html += `<li><input type="checkbox" ${checked} disabled> ${item.text}</li>`
        })
        html += "</ul>"
        break

      case "quote":
        html += "<blockquote>"
        html += `<p>${block.data.text}</p>`
        if (block.data.caption) {
          html += `<cite>${block.data.caption}</cite>`
        }
        html += "</blockquote>"
        break

      case "code":
        html += `<pre><code>${escapeHtml(block.data.code)}</code></pre>`
        break

      case "warning":
        html += '<div class="warning">'
        if (block.data.title) {
          html += `<strong>${block.data.title}</strong><br>`
        }
        html += block.data.message
        html += "</div>"
        break

      case "delimiter":
        html += "<hr>"
        break

      case "table":
        html += '<table border="1" cellpadding="5" cellspacing="0">'
        block.data.content.forEach((row, index) => {
          html += "<tr>"
          row.forEach((cell) => {
            const tag = block.data.withHeadings && index === 0 ? "th" : "td"
            html += `<${tag}>${cell}</${tag}>`
          })
          html += "</tr>"
        })
        html += "</table>"
        break

      case "image":
        html += '<div class="image-block">'
        if (block.data.file && block.data.file.url) {
          html += `<img src="${block.data.file.url}" alt="${block.data.caption || ""}" style="max-width: 100%;">`
          if (block.data.caption) {
            html += `<p><em>${block.data.caption}</em></p>`
          }
        }
        html += "</div>"
        break

      case "embed":
        if (block.data.embed) {
          html += `<div class="embed">${block.data.embed}</div>`
        }
        break

      case "raw":
        html += block.data.html || ""
        break

      default:
        // Handle unknown block types
        if (block.data.text) {
          html += `<p>${block.data.text}</p>`
        }
    }
  })

  return html
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Generate a complete Word document HTML
 */
export function generateWordDocument(title, content, styles = "") {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <style>
    body {
      font-family: 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      margin: 1cm;
    }
    h1 { font-size: 20pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
    h2 { font-size: 16pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt; }
    h3 { font-size: 14pt; font-weight: bold; margin-top: 8pt; margin-bottom: 6pt; }
    h4, h5, h6 { font-size: 12pt; font-weight: bold; margin-top: 6pt; margin-bottom: 6pt; }
    p { margin-top: 0; margin-bottom: 10pt; }
    ul, ol { margin-top: 0; margin-bottom: 10pt; }
    li { margin-bottom: 5pt; }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 10pt 0;
    }
    th, td { 
      border: 1px solid #000; 
      padding: 5pt; 
      text-align: left;
    }
    th { 
      background-color: #f0f0f0; 
      font-weight: bold;
    }
    blockquote {
      margin: 10pt 20pt;
      padding: 10pt;
      border-left: 3pt solid #ccc;
      font-style: italic;
    }
    code {
      font-family: 'Courier New', monospace;
      background-color: #f5f5f5;
      padding: 2pt 4pt;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10pt;
      overflow-x: auto;
      margin: 10pt 0;
    }
    pre code {
      padding: 0;
    }
    hr {
      border: none;
      border-top: 1pt solid #ccc;
      margin: 20pt 0;
    }
    .warning {
      background-color: #fff3cd;
      border: 1pt solid #ffc107;
      padding: 10pt;
      margin: 10pt 0;
    }
    .warning strong {
      color: #856404;
    }
    .checklist {
      list-style: none;
      padding-left: 0;
    }
    .checklist li {
      margin-bottom: 5pt;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 10pt 0;
    }
    ${styles}
  </style>
</head>
<body>
  ${content}
</body>
</html>`
}
