<template>
  <v-card :outlined="outlined" :flat="flat" :elevation="elevation">
    <!-- Custom Toolbar -->
    <v-card-title v-if="!hideToolbar" class="py-2 px-3 grey lighten-4 border-bottom">
      <v-btn-toggle v-model="selectedTool" dense class="toolbar-group" mandatory @change="handleToolChange">
        <v-tooltip bottom v-for="tool in visibleTools" :key="tool.name">
          <template v-slot:activator="{ on }">
            <v-btn small text :value="tool.name" v-on="on" @click="insertBlock(tool.name)">
              <v-icon small>{{ tool.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ tool.label }}</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-card-title>

    <v-card-text :class="{ 'pa-0': noPadding }">
      <div ref="editorjs" :id="editorId"></div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TextEditor",

  props: {
    value: {
      type: [Object, String],
      default: null
    },
    placeholder: {
      type: String,
      default: "Start typing..."
    },
    minHeight: {
      type: Number,
      default: 300
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: false
    },
    elevation: {
      type: [Number, String],
      default: 0
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    hideToolbar: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editor: null,
      editorId: `editor-${Math.random().toString(36).substr(2, 9)}`,
      EditorJS: null,
      tools: null,
      selectedTool: "paragraph",
      internalValue: null, // Track internal state
      isUpdatingFromParent: false, // Flag to prevent loops
      visibleTools: [
        { name: "paragraph", label: "Text", icon: "mdi-format-text" },
        { name: "header", label: "Heading", icon: "mdi-format-header-pound" },
        { name: "list", label: "Unordered List", icon: "mdi-format-list-bulleted" },
        { name: "ordered", label: "Ordered List", icon: "mdi-format-list-numbered" },
        { name: "checklist", label: "Checklist", icon: "mdi-checkbox-marked-outline" },
        { name: "quote", label: "Quote", icon: "mdi-format-quote-close" },
        { name: "code", label: "Code", icon: "mdi-code-tags" },
        { name: "table", label: "Table", icon: "mdi-table" },
        { name: "warning", label: "Warning", icon: "mdi-alert" },
        { name: "delimiter", label: "Delimiter", icon: "mdi-minus" },
        { name: "image", label: "Image", icon: "mdi-image" },
        { name: "embed", label: "Embed", icon: "mdi-youtube" },
        { name: "linkTool", label: "Link", icon: "mdi-link" },
        { name: "attaches", label: "Attach File", icon: "mdi-paperclip" },
        { name: "raw", label: "Raw HTML", icon: "mdi-code-braces" }
      ]
    }
  },

  computed: {
    parsedValue() {
      // If value is a string, parse it to object
      if (typeof this.value === "string" && this.value) {
        try {
          return JSON.parse(this.value)
        } catch (error) {
          console.error("Failed to parse editor value:", error)
          return null
        }
      }
      // If it's already an object or null, return as is
      return this.value
    }
  },

  mounted() {
    // Only run on client-side
    if (process.client) {
      this.loadEditor()
    }
  },

  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },

  methods: {
    async loadEditor() {
      try {
        // Dynamically import EditorJS and all tools on client-side only
        const [
          EditorJS,
          Header,
          List,
          Checklist,
          Quote,
          Code,
          InlineCode,
          Embed,
          Table,
          LinkTool,
          Warning,
          Marker,
          Delimiter,
          RawTool,
          ImageTool,
          AttachesTool
        ] = await Promise.all([
          import("@editorjs/editorjs").then((m) => m.default),
          import("@editorjs/header").then((m) => m.default),
          import("@editorjs/list").then((m) => m.default),
          import("@editorjs/checklist").then((m) => m.default),
          import("@editorjs/quote").then((m) => m.default),
          import("@editorjs/code").then((m) => m.default),
          import("@editorjs/inline-code").then((m) => m.default),
          import("@editorjs/embed").then((m) => m.default),
          import("@editorjs/table").then((m) => m.default),
          import("@editorjs/link").then((m) => m.default),
          import("@editorjs/warning").then((m) => m.default),
          import("@editorjs/marker").then((m) => m.default),
          import("@editorjs/delimiter").then((m) => m.default),
          import("@editorjs/raw").then((m) => m.default),
          import("@editorjs/image").then((m) => m.default),
          import("@editorjs/attaches").then((m) => m.default)
        ])

        this.EditorJS = EditorJS
        this.tools = {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered"
            }
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author"
            }
          },
          code: {
            class: Code,
            config: {
              placeholder: "Enter code"
            }
          },
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+M"
          },
          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                coub: true,
                codepen: true,
                imgur: true,
                gfycat: true,
                twitter: true,
                instagram: true,
                facebook: true,
                vimeo: true
              }
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
            }
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/fetch-url" // You'll need to implement this endpoint
            }
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
              titlePlaceholder: "Title",
              messagePlaceholder: "Message"
            }
          },
          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+H"
          },
          delimiter: Delimiter,
          raw: {
            class: RawTool,
            config: {
              placeholder: "Enter HTML code"
            }
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "/api/upload-image", // You'll need to implement this endpoint
                byUrl: "/api/fetch-image" // You'll need to implement this endpoint
              },
              field: "image",
              types: "image/*",
              captionPlaceholder: "Enter caption",
              buttonContent: "Select an image",
              uploader: {
                // Optional: custom uploader
                uploadByFile(file) {
                  // Return a promise with the uploaded file URL
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: URL.createObjectURL(file)
                    }
                  })
                }
              }
            }
          },
          attaches: {
            class: AttachesTool,
            config: {
              endpoint: "/api/upload-file", // You'll need to implement this endpoint
              field: "file",
              types: "*",
              buttonText: "Select file to upload",
              errorMessage: "File upload failed"
            }
          }
        }

        await this.initEditor()
      } catch (error) {
        console.error("Failed to load Editor.js:", error)
        this.$emit("error", error)
      }
    },

    async initEditor() {
      if (!this.EditorJS) return

      try {
        const initialData = this.parsedValue || {}
        this.internalValue = JSON.stringify(initialData)

        this.editor = new this.EditorJS({
          holder: this.editorId,
          placeholder: this.placeholder,
          autofocus: this.autofocus,
          readOnly: this.readonly,
          minHeight: this.minHeight,
          data: initialData,
          tools: this.tools,

          onChange: async () => {
            try {
              const savedData = await this.editor.save()
              const stringifiedData = JSON.stringify(savedData)

              // Only emit if the data actually changed
              if (this.internalValue !== stringifiedData) {
                this.internalValue = stringifiedData
                this.$emit("input", stringifiedData)
                this.$emit("change", stringifiedData)
              }
            } catch (error) {
              console.error("Saving failed: ", error)
            }
          },

          onReady: () => {
            this.$emit("ready", this.editor)
          }
        })
      } catch (error) {
        console.error("Editor initialization failed:", error)
        this.$emit("error", error)
      }
    },

    async save() {
      if (this.editor) {
        try {
          const savedData = await this.editor.save()
          return savedData
        } catch (error) {
          console.error("Saving failed:", error)
          throw error
        }
      }
      return null
    },

    async clear() {
      if (this.editor) {
        await this.editor.clear()
        const emptyData = JSON.stringify({})
        this.internalValue = emptyData
        this.$emit("input", emptyData)
        this.$emit("change", emptyData)
      }
    },

    async destroy() {
      if (this.editor) {
        await this.editor.destroy()
        this.editor = null
      }
    },

    insertBlock(toolName) {
      if (!this.editor) return

      try {
        const currentBlock = this.editor.blocks.getCurrentBlockIndex()

        if (toolName === "paragraph") {
          this.editor.blocks.insert("paragraph")
        } else if (toolName === "ordered") {
          this.editor.blocks.insert("list", { style: "ordered" })
        } else {
          this.editor.blocks.insert(toolName)
        }
      } catch (error) {
        console.error("Failed to insert block:", error)
      }
    },

    handleToolChange(toolName) {
      // This is called when toolbar button is clicked
    }
  },

  watch: {
    readonly(newVal) {
      if (this.editor) {
        this.editor.readOnly.toggle(newVal)
      }
    },

    value: {
      handler(newVal) {
        // Convert to string for comparison
        const newValueString = typeof newVal === "string" ? newVal : JSON.stringify(newVal)

        // Only render if the value changed from outside (not from internal onChange)
        if (this.editor && newValueString && newValueString !== this.internalValue) {
          this.isUpdatingFromParent = true
          this.internalValue = newValueString

          try {
            const parsedData = typeof newVal === "string" ? JSON.parse(newVal) : newVal
            this.editor
              .render(parsedData)
              .then(() => {
                this.isUpdatingFromParent = false
              })
              .catch((error) => {
                console.error("Failed to render editor data:", error)
                this.isUpdatingFromParent = false
              })
          } catch (error) {
            console.error("Failed to parse value:", error)
            this.isUpdatingFromParent = false
          }
        }
      },
      immediate: false
    }
  }
}
</script>

<style>
/* Editor.js base styles */
.codex-editor {
  border-radius: 4px;
  position: relative;
}

.codex-editor__redactor {
  padding-bottom: 0 !important;
}

.ce-block__content,
.ce-toolbar__content {
  max-width: 100%;
}

/* Hide default Editor.js toolbar */
.ce-toolbar__plus,
.ce-toolbar__settings-btn {
  display: none !important;
}

/* Custom toolbar styles */
.toolbar-group {
  flex-wrap: wrap;
  gap: 2px;
}

.toolbar-group .v-btn {
  min-width: 36px !important;
  height: 32px !important;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

/* Custom scrollbar for editor */
.codex-editor::-webkit-scrollbar {
  width: 8px;
}

.codex-editor::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.codex-editor::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.codex-editor::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Better editor spacing */
.ce-block {
  padding: 8px 0;
}

.ce-block:first-child {
  padding-top: 16px;
}

/* Prevent content overflow */
.ce-block__content {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Fix table overflow */
.tc-table {
  max-width: 100%;
  overflow-x: auto;
}

/* Ensure images don't overflow */
.image-tool__image {
  max-width: 100%;
  height: auto;
}
</style>
