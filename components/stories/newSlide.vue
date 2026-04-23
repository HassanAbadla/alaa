// This fixes the "Cannot read properties of undefined (reading 'setData')" error // when selecting the first slide

<template>
  <div>
    <v-toolbar dense flat floating>
      <v-app-bar-nav-icon @click.stop="slides_drawer = !slides_drawer"></v-app-bar-nav-icon>
      <v-btn color="primary" icon @click="treeLayers = !treeLayers">
        <v-icon>mdi-family-tree</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn color="primary" icon @click="addLayer('content')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn color="primary" icon @click="addLayer('image')">
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <v-btn color="primary" icon @click="addLayer('video')">
        <v-icon>mdi-video</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>

      <v-btn
        color="blue"
        icon
        @click.stop="
          layers[selectedLayer.layer].contents[selectedLayer.content].lock =
            !layers[selectedLayer.layer].contents[selectedLayer.content].lock
          saveToLocalStorage()
        "
      >
        <v-icon
          v-if="selectedLayer.content !== null && layers[selectedLayer.layer]?.contents[selectedLayer.content]?.lock"
        >
          mdi-lock
        </v-icon>
        <v-icon v-else>mdi-lock-open-variant</v-icon>
      </v-btn>
      <v-btn color="red" icon @click="deleteLayer" @keydown.delete="deleteLayer">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn color="blue" icon @click.stop="drawer = !drawer">
        <v-icon>mdi-pen</v-icon>
      </v-btn>
      <v-btn
        v-if="
          selectedLayer.layer != null &&
          selectedLayer.content !== null &&
          layers[selectedLayer.layer]?.contents[selectedLayer.content]?.type === 'content'
        "
        color="black"
        icon
        @click.stop="editorDialog = true"
      >
        <v-icon>mdi-signature-text</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>

      <slide-player :slide-layers="layers" />
      <v-btn color="blue" icon @click="saveLayers">
        <v-icon>mdi-content-save-all</v-icon>
      </v-btn>
      <v-btn icon @click="share = true">
        <v-icon>mdi-share</v-icon>
      </v-btn>
      <!-- Add new discard changes button -->
      <v-btn v-if="hasUnsavedChanges" color="orange" icon @click="discardChanges" title="Discard unsaved changes">
        <v-icon>mdi-restore</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" right app fixed clipped>
      <div class="px-1" v-if="canEditSelected">
        <v-card outlined class="pa-2">
          <v-text-field
            label="Layer Group title"
            type="text"
            v-model="layers[selectedLayer.layer].title"
            @input="saveToLocalStorage"
          />
          <v-select
            label="layer"
            v-model="changedLayer"
            :items="layers"
            @change="changeLayer()"
            item-text="title"
            item-value="id"
          ></v-select>
        </v-card>
        <v-divider></v-divider>
        <v-card outlined class="pa-2 mt-2">
          <v-switch
            label="transparent"
            false-value="blue"
            true-value="transparent"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].color"
            @change="saveToLocalStorage"
          />
          <v-text-field label="color" type="color" @input="saveToLocalStorage" />
          <v-color-picker
            v-if="
              layers[selectedLayer.layer].contents[selectedLayer.content].type == 'content' &&
              layers[selectedLayer.layer].contents[selectedLayer.content].color != 'transparent'
            "
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].color"
            dot-size="25"
            swatches-max-height="200"
            @input="saveToLocalStorage"
          ></v-color-picker>
          <v-file-input
            label="image"
            accept="image/*"
            v-if="layers[selectedLayer.layer].contents[selectedLayer.content].type == 'image'"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].image"
            @change="imagePreviewOnChange(selectedLayer.layer, selectedLayer.content)"
          />
          <v-file-input
            label="video"
            accept="video/*"
            v-if="layers[selectedLayer.layer].contents[selectedLayer.content].type == 'video'"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].video"
            @change="videoPreviewOnChange(selectedLayer.layer, selectedLayer.content)"
          />
        </v-card>
        <v-card outlined class="pa-2 mt-2">
          <v-text-field
            label="Item title"
            type="text"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].title"
            @input="saveToLocalStorage"
          />
          <v-text-field
            label="Z index"
            type="number"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].z_index"
            @input="saveToLocalStorage"
          />

          <v-select
            label="layer type"
            :items="['content', 'image', 'video']"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].type"
            @change="saveToLocalStorage"
          />
          <v-select
            label="animation"
            :items="['click', 'auto']"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].slideType"
            @change="saveToLocalStorage"
          />
          <v-select
            label="animation"
            :items="[
              'animate__backInDown',
              'animate__jello',
              'animate__swing',
              'animate__backInLeft',
              'animate__rubberBand'
            ]"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].animation"
            @change="saveToLocalStorage"
          />
          <v-text-field
            label="animation duration (s)"
            type="number"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].duration"
            @input="saveToLocalStorage"
          />
          <v-text-field
            label="animation delay (s)"
            type="number"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].delay"
            @input="saveToLocalStorage"
          />

          <div v-if="showEditor">
            <ckeditor-nuxt
              v-if="editorReady && layers[selectedLayer.layer]?.contents?.[selectedLayer.content]?.type === 'content'"
              v-model="layers[selectedLayer.layer].contents[selectedLayer.content].content"
              :content="getContentSafely(selectedLayer.layer, selectedLayer.content)"
              :config="{
                removePlugins: ['Title'],
                toolbar: ['bold', 'italic', 'fontsize', 'fontColor', 'numberedList', 'bulletedList']
              }"
              @input="saveToLocalStorage"
            />
          </div>
        </v-card>
      </div>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="treeLayers" left app clipped>
      <v-btn block color="primary" @click="newLayer">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-treeview hoverable activatable :items="layers" item-text="title" item-children="contents">
        <template v-slot:label="{ item }">
          <Draggable>
            <v-list-item>{{ item.title }}</v-list-item>
          </Draggable>
        </template>
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.type">mdi-layers</v-icon>
          <v-icon v-else>mdi-content-paste</v-icon>
        </template>
      </v-treeview>
    </v-navigation-drawer>
    <v-bottom-sheet hide-overlay v-model="slides_drawer">
      <v-sheet height="120px" color="blue">
        <v-row align="center" justify="center">
          <v-col cols="12" style="overflow-x: auto">
            <Container behaviour="contain" orientation="horizontal" @drop="onDrop" style="width: 100%; display: flex">
              <Draggable v-for="(layer, key) in layers" :key="key">
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="draggable-item-horizontal mx-2"
                    @click="selectLayer(key)"
                    height="100px"
                    width="150px"
                    :elevation="selectedLayer.layer == key ? 6 : 1"
                    style="transition-duration: 0.1s"
                  >
                    <v-layout fill-height justify-center align-center>
                      <span>{{ layer.title }}</span>
                    </v-layout>
                  </v-card>
                </v-hover>
              </Draggable>
            </Container>
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>
    <v-container fluid>
      <v-responsive :aspect-ratio="16 / 9">
        <v-card style="overflow: hidden" outlined width="100%" height="100%" color="blue">
          <div v-for="(layer, i) in layers" style="height: 100%; width: 100%">
            <v-tooltip bottom v-for="(content, j) in layer.contents" v-if="layer.contents && layer.contents.length > 0">
              <template v-slot:activator="{ on, attr }">
                <vue-drag-resize
                  :z="content.z_index"
                  :x="content.left"
                  :y="content.top"
                  :key="i"
                  :isResizable="content.lock"
                  @activated="selectLayer(i, j)"
                  :isDraggable="content.lock"
                  :isActive="true"
                  :w="content.width"
                  :h="content.height"
                  @resizing="resize"
                  @dragging="resize"
                  @dragstop="actEnd(content)"
                  @resizestop="actEnd(layer)"
                >
                  <v-card
                    v-on="on"
                    v-bind="attr"
                    :elevation="selectedLayer.layer == i && selectedLayer.content == j ? 12 : 0"
                    @click="selectLayer(i, j)"
                    :style="'animation-duration:' + content.duration + 's;animation-delay:' + content.delay + 's'"
                    :class="'animate__animated ' + content.animation"
                    :height="content.height"
                    :width="content.width"
                    :color="content.color"
                  >
                    <v-card-text v-if="content.type == 'content'">
                      <div v-html="getContentSafely(i, j)" v-if="content.type == 'content'"></div>
                    </v-card-text>
                    <div v-if="content.type == 'video'">
                      <video
                        v-if="content.videoPreview || content.video"
                        id="video-preview"
                        :src="content.videoPreview || content.video"
                        :width="content.width"
                        :height="content.height"
                        controls
                        v-show="true"
                      />
                    </div>
                    <div v-if="content.type == 'image'">
                      <v-img
                        v-if="content.imagePreview || content.image"
                        :src="content.imagePreview || content.image"
                        :width="content.width"
                        :height="content.height"
                      />
                    </div>
                  </v-card>
                </vue-drag-resize>
              </template>
              <span>{{ content.title }}</span>
            </v-tooltip>
          </div>
        </v-card>
      </v-responsive>
    </v-container>

    <!-- Editor Modal -->
    <v-dialog v-model="editorDialog">
      <v-card v-if="canEditSelected" class="pa-4" width="100%" style="overflow: hidden" min-height="500px">
        <div v-if="editorReady">
          <ckeditor-nuxt
            v-if="layers[selectedLayer.layer]?.contents?.[selectedLayer.content]?.type === 'content'"
            v-model="layers[selectedLayer.layer].contents[selectedLayer.content].content"
            :content="getContentSafely(selectedLayer.layer, selectedLayer.content)"
            :config="{
              removePlugins: ['Title'],
              toolbar: {
                items: [
                  'undo',
                  'redo',
                  '|',
                  'heading',
                  '|',
                  'fontfamily',
                  'fontsize',
                  'fontColor',
                  'fontBackgroundColor',
                  '|',
                  'bold',
                  'italic',
                  'strikethrough',
                  'subscript',
                  'superscript',
                  'code',
                  '|',
                  'link',
                  'blockQuote',
                  'codeBlock',
                  '|',
                  'alignment',
                  '|',
                  'bulletedList',
                  'numberedList',
                  'todoList',
                  'outdent',
                  'indent'
                ],
                shouldNotGroupWhenFull: true
              }
            }"
            @input="saveToLocalStorage"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- Share dialog -->
    <v-dialog v-model="share">
      <v-card v-if="selectedLayer.layer != null" class="pa-4" width="100%" style="overflow: hidden">
        <v-text-field readonly @click="copyTo()" :value="originUrl" append-icon="mdi-content-copy"></v-text-field>
      </v-card>
    </v-dialog>

    <!-- Unsaved changes indicator -->
    <v-snackbar v-model="showUnsavedChanges" :timeout="-1" color="warning" bottom>
      You have unsaved changes
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="saveLayers">Save</v-btn>
        <v-btn text v-bind="attrs" @click="discardChanges">Discard</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import editor from "~/components/Editor.vue"
import SlidePlayer from "@/components/SlidePlayer.vue"
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag, generateItems } from "@/utils/helpers"
export default {
  name: "newSlide",
  props: {
    slideId: String
  },
  components: {
    Container,
    Draggable,
    SlidePlayer,
    "ckeditor-nuxt": () => {
      if (process.client) {
        return import("@blowstack/ckeditor-nuxt").catch(() => {
          console.error("Failed to load CKEditor component")
          // Provide a fallback component to prevent undefined errors
          return {
            render: (h) => h("div", { class: "ckeditor-error" }, "Editor could not be loaded")
          }
        })
      }
    }
  },
  data() {
    return {
      drawer: false,
      treeLayers: false,
      share: false,
      slide_id: null,
      slides_drawer: false,
      editorDialog: false,
      changedLayer: null,
      selectedLayer: {
        layer: null,
        content: null
      },
      layers: [],
      deletedLayers: [],
      // width: 100,
      // height: 100,
      // top: 10,
      // left: 20,
      originUrl: null,
      dataLoaded: null,
      editorReady: false,
      showEditor: false,
      file: "",

      unsavedChanges: false,
      showUnsavedChanges: false,
      originalLayersFromDB: null
    }
  },
  computed: {
    // Add safety check for selected layer/content
    canEditSelected() {
      return (
        this.selectedLayer.layer !== null &&
        this.selectedLayer.content !== null &&
        this.layers.length > 0 &&
        this.layers[this.selectedLayer.layer] &&
        this.layers[this.selectedLayer.layer].contents &&
        this.layers[this.selectedLayer.layer].contents[this.selectedLayer.content]
      )
    },
    // Helper computed property for local storage key
    localStorageKey() {
      return `slide_data_${this.slide_id}`
    },
    // Check if there are unsaved changes
    hasUnsavedChanges() {
      return this.unsavedChanges
    }
  },
  watch: {
    dataLoaded(newVal) {
      if (newVal === false && this.layers.length === 0) {
        // Initialize with default layer only if no data was loaded
        // this.initializeDefaultLayers()
      }
    },
    selectedLayer: {
      deep: true,
      handler(newVal) {
        // Reset editor state when selection changes
        this.showEditor = false
        this.editorReady = false

        // This allows time for the component to update before working with it
        if (newVal.layer !== null && newVal.content !== null) {
          this.$nextTick(() => {
            // Set editor ready after DOM has updated
            setTimeout(() => {
              this.editorReady = true
              this.showEditor = true
            }, 100)
          })
        }
      }
    },
    slideId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          // If we have unsaved changes on the current slide, save them to localStorage before changing slides
          if (this.slide_id && this.unsavedChanges) {
            this.saveToLocalStorage()
          }

          // Reset editor state when slide changes
          this.editorReady = false
          this.showEditor = false

          // Reset selected layer
          this.selectedLayer = {
            layer: null,
            content: null
          }

          // Load new slide data
          this.slide_id = newVal
          this.getLayers(newVal)
        }
      }
    },
    // Show the unsaved changes banner when unsavedChanges becomes true
    unsavedChanges(newVal) {
      if (newVal) {
        this.showUnsavedChanges = true
      }
    }
  },
  async mounted() {
    if (this.slideId) {
      this.slide_id = this.slideId
      await this.getLayers(this.slideId)
      this.originUrl = window.location.origin + this.localePath("/education/play/" + this.$route.params.id)
    }

    // Add a window beforeunload event listener to warn about unsaved changes
    if (process.client) {
      window.addEventListener("beforeunload", this.handleBeforeUnload)
    }
  },
  beforeDestroy() {
    // Clean up event listener when component is destroyed
    if (process.client) {
      window.removeEventListener("beforeunload", this.handleBeforeUnload)
    }
  },
  methods: {
    // Handle beforeunload event to warn user about unsaved changes
    handleBeforeUnload(event) {
      if (this.unsavedChanges) {
        // Standard way to show a confirmation dialog before leaving
        event.preventDefault()
        event.returnValue = ""
        return ""
      }
    },

    // Save current state to localStorage
    saveToLocalStorage() {
      if (!process.client || !this.slide_id) return

      try {
        // Mark that we have unsaved changes
        this.unsavedChanges = true

        // Create a clean version of layers without File objects (which can't be serialized)
        const cleanedLayers = this.prepareLayersForStorage(this.layers)

        // Save to localStorage
        localStorage.setItem(this.localStorageKey, JSON.stringify(cleanedLayers))

        console.log("Saved to localStorage:", this.localStorageKey)
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    },

    // Prepare layers for storage by removing non-serializable content
    prepareLayersForStorage(layers) {
      return layers.map((layer) => {
        const newLayer = { ...layer }

        if (newLayer.contents) {
          newLayer.contents = newLayer.contents.map((content) => {
            const newContent = { ...content }

            // Remove File objects which can't be serialized
            if (newContent.image instanceof File) {
              newContent.image = null
            }
            if (newContent.video instanceof File) {
              newContent.video = null
            }

            // Keep the preview URLs for images and videos
            return newContent
          })
        }

        return newLayer
      })
    },

    // Load from localStorage if available
    loadFromLocalStorage() {
      if (!process.client || !this.slide_id) return null

      try {
        const savedData = localStorage.getItem(this.localStorageKey)
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          console.log("Loaded from localStorage:", this.localStorageKey)
          return parsedData
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error)
      }

      return null
    },

    // Clear localStorage for this slide
    clearLocalStorage() {
      if (!process.client || !this.slide_id) return

      try {
        localStorage.removeItem(this.localStorageKey)
        console.log("Cleared localStorage:", this.localStorageKey)
      } catch (error) {
        console.error("Error clearing localStorage:", error)
      }
    },

    // Discard unsaved changes and reload from DB
    discardChanges() {
      this.clearLocalStorage()
      this.getLayers(this.slide_id)
      this.unsavedChanges = false
      this.showUnsavedChanges = false
    },

    initializeDefaultLayers() {
      console.log("Initializing default layers")

      this.layers = [
        {
          title: "layer #1",
          contents: [
            {
              title: "content #1",
              width: 270,
              height: 400,
              top: 10,
              left: 20,
              z_index: 1,
              slideType: "click",
              color: "primary",
              content: "content xxx",
              animation: "",
              duration: 1,
              type: "content",
              delay: 0,
              image: null,
              imagePreview: null,
              video: null,
              videoPreview: null,
              lock: true
            }
          ]
        }
      ]

      // Save initial state to localStorage
      this.saveToLocalStorage()
    },

    getContentSafely(layerIndex, contentIndex) {
      if (
        !this.layers ||
        !this.layers[layerIndex] ||
        !this.layers[layerIndex].contents ||
        !this.layers[layerIndex].contents[contentIndex]
      ) {
        return ""
      }
      return this.layers[layerIndex].contents[contentIndex].content || ""
    },

    copyTo() {
      navigator.clipboard.writeText(this.originUrl)
    },

    async getLayers(slide_id) {
      try {
        // First check localStorage for unsaved changes
        const localData = this.loadFromLocalStorage()

        // Then get data from API
        const res = await this.$axios.get("content/slide/" + slide_id)

        // Save original data from DB for comparison
        this.originalLayersFromDB = JSON.parse(JSON.stringify(res.data.layers || []))

        if (localData) {
          // Use localStorage data if available
          this.layers = localData
          this.dataLoaded = true
          this.unsavedChanges = true
          this.showUnsavedChanges = true
        } else if (res.data.layers && res.data.layers.length > 0) {
          // Otherwise use API data
          this.layers = res.data.layers
          this.dataLoaded = true
          this.unsavedChanges = false
          this.showUnsavedChanges = false
        } else {
          // If no layers came from the API, set the flag to false to trigger default initialization
          this.dataLoaded = false
        }
      } catch (error) {
        console.error("Error loading layers:", error)
        this.dataLoaded = false
      }
    },

    saveLayers() {
      const formData = new FormData()
      formData.append("slide_id", this.slide_id)

      // Filter out layers with empty contents
      const filteredLayers = this.layers.filter(
        (layer) => layer.contents && Array.isArray(layer.contents) && layer.contents.length > 0
      )

      // If we have no layers with content, don't proceed with the save
      if (filteredLayers.length === 0) {
        console.log("No layers with content to save")
        return
      }

      // Using the filtered layers for saving
      filteredLayers.forEach((layer, layerIndex) => {
        formData.append(`layers[${layerIndex}][title]`, layer.title)
        if (layer.id) {
          formData.append(`layers[${layerIndex}][id]`, layer.id)
        }

        layer.contents.forEach((content, contentIndex) => {
          // Handle all properties except lock first
          Object.keys(content).forEach((key) => {
            if (
              key !== "lock" &&
              key !== "image" &&
              key !== "video" &&
              key !== "imagePreview" &&
              key !== "videoPreview"
            ) {
              formData.append(`layers[${layerIndex}][contents][${contentIndex}][${key}]`, content[key])
            }
          })

          // Handle lock separately - only once
          if (content.hasOwnProperty("lock")) {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][lock]`, content.lock === true ? 1 : 0)
          }

          // Handle files
          if (content.type === "image" && content.image instanceof File) {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][image]`, content.image)
          } else if (content.image) {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][image]`, content.image)
          } else {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][image]`, "")
          }

          if (content.type === "video" && content.video instanceof File) {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][video]`, content.video)
          } else if (content.video) {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][video]`, content.video)
          } else {
            formData.append(`layers[${layerIndex}][contents][${contentIndex}][video]`, "")
          }
        })
      })

      // Send the request
      this.$axios
        .post("content/store", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((res) => {
          console.log(res)
          // After successful save, clear localStorage and reset unsaved changes flag
          this.clearLocalStorage()
          this.unsavedChanges = false
          this.showUnsavedChanges = false

          // Update the originalLayersFromDB with the current state
          this.originalLayersFromDB = JSON.parse(JSON.stringify(this.layers))
        })
        .catch((error) => {
          console.error("Error saving layers:", error)
        })
    },

    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left

      // Save changes to localStorage when resizing
      this.saveToLocalStorage()
    },

    actEnd(layer) {
      layer.width = this.width
      layer.height = this.height
      layer.top = this.top
      layer.left = this.left

      // Save changes to localStorage when drag/resize ends
      this.saveToLocalStorage()
    },

    changeLayer() {
      let currentLayer = this.selectedLayer.layer
      console.log("currentLayer", currentLayer)
      console.log("changedLayer", this.changedLayer)

      this.layers.map((item, key) => {
        if (item.id == this.changedLayer) this.changedLayer = key
      })

      if (currentLayer != this.changedLayer) {
        this.layers[this.changedLayer].contents.push(
          this.layers[this.selectedLayer.layer].contents[this.selectedLayer.content]
        )
        this.deleteLayer()
        this.selectedLayer = {
          layer: null,
          content: null
        }

        // Save changes to localStorage after changing layer
        this.saveToLocalStorage()
      }
    },

    newLayer() {
      let id = this.layers.length + 1
      this.layers.push({
        title: "new layer",
        id: id,
        contents: []
      })

      // Save changes to localStorage after adding new layer
      this.saveToLocalStorage()
    },

    addLayer(type) {
      // Safety check - initialize layer array if needed
      if (this.layers.length === 0) {
        this.layers.push({
          title: "layer #1",
          contents: []
        })
      }

      let slideNum = this.layers[0].contents ? this.layers[0].contents.length + 1 : 1
      this.layers[0].contents = this.layers[0].contents || []

      this.layers[0].contents.push({
        title: "content #" + slideNum,
        width: 100,
        height: 100,
        top: 10,
        left: 20,
        color: "primary",
        slideType: "auto",
        content: "",
        animation: "",
        z_index: 1,
        duration: 1,
        type: type,
        delay: 0,
        image: null,
        imagePreview: null,
        video: null,
        videoPreview: null,
        lock: true
      })

      // Save changes to localStorage after adding a new content layer
      this.saveToLocalStorage()
    },

    selectLayer(i, j = 0) {
      this.selectedLayer = {
        layer: i,
        content: j
      }
      this.changedLayer = this.layers[i]?.id || null
    },
    // selectLayer(i, j = 0) {
    //   // First reset editor state
    //   this.editorReady = false
    //   this.showEditor = false

    //   // Set selected layer after a delay to avoid race conditions
    //   setTimeout(() => {
    //     this.selectedLayer = {
    //       layer: i,
    //       content: j
    //     }

    //     // Set editor state after selection
    //     setTimeout(() => {
    //       this.editorReady = true
    //       this.showEditor = true
    //     }, 100)
    //   }, 10)
    // },

    deleteLayer() {
      if (!this.canEditSelected) return

      let contentId = this.layers[this.selectedLayer.layer].contents[this.selectedLayer.content].id
      let indexLayer = this.selectedLayer.content

      if (this.layers[this.selectedLayer.layer] && this.layers[this.selectedLayer.layer].contents.length > 0) {
        this.layers[this.selectedLayer.layer].contents = this.layers[this.selectedLayer.layer].contents.filter(
          (item, index) => index != indexLayer
        )

        if (contentId) {
          this.$axios
            .delete("content/delete/" + contentId)
            .then((res) => {
              console.log(res)
            })
            .catch((error) => {
              console.error("Error deleting content:", error)
            })
        }

        // Reset selection after deletion
        this.selectedLayer = {
          layer: null,
          content: null
        }

        // Save changes to localStorage after deleting a layer
        this.saveToLocalStorage()
      }
    },

    imagePreviewOnChange(selected, selectedContent) {
      // Safety check
      if (!this.layers[selected] || !this.layers[selected].contents[selectedContent]) return

      let e = this.layers[selected].contents[selectedContent].image
      const file = e
      if (file) {
        this.layers[selected].contents[selectedContent].imagePreview = URL.createObjectURL(file)
      } else {
        this.layers[selected].contents[selectedContent].imagePreview = null
      }

      // Save changes to localStorage after changing an image
      this.saveToLocalStorage()
    },

    videoPreviewOnChange(selected, selectedContent) {
      // Safety check
      if (
        !this.layers[selected] ||
        !this.layers[selected].contents[selectedContent] ||
        !this.layers[selected].contents[selectedContent].video
      )
        return

      let reader = new FileReader()
      reader.readAsDataURL(this.layers[selected].contents[selectedContent].video)
      reader.addEventListener("load", () => {
        this.layers[selected].contents[selectedContent].videoPreview = reader.result
        // Save changes to localStorage after changing a video
        this.saveToLocalStorage()
      })
    },

    onDrop(dropResult) {
      // Apply the drag operation to get the new order
      const reorderedLayers = applyDrag(this.layers, dropResult)
      // Update the order values based on the new positions (starting from 1)
      reorderedLayers.forEach((layer, index) => {
        layer.order = (index + 1).toString()
      })

      this.layers = reorderedLayers

      // Save changes to localStorage after reordering
      // this.saveToLocalStorage()

      // You can then save the updated order to the backend

      this.saveLayerOrder()
    },

    saveLayerOrder() {
      // Prepare the data to send to the backend
      const layerOrders = this.layers.map((layer) => ({
        id: layer.id,
        order: layer.order
      }))

      this.$axios
        .post("/layers/update-order", { layers: layerOrders })
        .then((response) => {
          localStorage.removeItem(`slide_data_${this.slide_id}`)
          this.$emit("refresh", this.slide_id)
        })
        .catch((error) => {
          console.error("Error updating layer order:", error)
        })
    }
  }
}
</script>

<style scoped></style>
