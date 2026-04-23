!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.SlVueTree = t())
    : (e.SlVueTree = t())
})(window, function () {
  return (function (e) {
    var t = {}
    function o(r) {
      if (t[r]) return t[r].exports
      var s = (t[r] = { i: r, l: !1, exports: {} })
      return e[r].call(s.exports, s, s.exports, o), (s.l = !0), s.exports
    }
    return (
      (o.m = e),
      (o.c = t),
      (o.d = function (e, t, r) {
        o.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r })
      }),
      (o.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 })
      }),
      (o.t = function (e, t) {
        if ((1 & t && (e = o(e)), 8 & t)) return e
        if (4 & t && "object" == typeof e && e && e.__esModule) return e
        var r = Object.create(null)
        if ((o.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e))
          for (var s in e)
            o.d(
              r,
              s,
              function (t) {
                return e[t]
              }.bind(null, s)
            )
        return r
      }),
      (o.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return o.d(t, "a", t), t
      }),
      (o.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (o.p = ""),
      o((o.s = 0))
    )
  })([
    function (e, t, o) {
      "use strict"
      o.r(t)
      var r = {
          name: "sl-vue-tree",
          props: {
            value: { type: Array, default: () => [] },
            edgeSize: { type: Number, default: 3 },
            showBranches: { type: Boolean, default: !1 },
            level: { type: Number, default: 0 },
            parentInd: { type: Number },
            allowMultiselect: { type: Boolean, default: !0 },
            allowToggleBranch: { type: Boolean, default: !0 },
            allowOnlyInsideDrop: { type: Boolean, default: false },
            multiselectKey: {
              type: [String, Array],
              default: function () {
                return ["ctrlKey", "metaKey"]
              },
              validator: function (e) {
                let t = ["ctrlKey", "metaKey", "altKey"],
                  o = Array.isArray(e) ? e : [e]
                return (o = o.filter((e) => -1 !== t.indexOf(e))), !!o.length
              }
            },
            scrollAreaHeight: { type: Number, default: 70 },
            maxScrollSpeed: { type: Number, default: 20 }
          },
          data() {
            return {
              rootCursorPosition: null,
              scrollIntervalId: 0,
              scrollSpeed: 0,
              lastSelectedNode: null,
              mouseIsDown: !1,
              isDragging: !1,
              lastMousePos: { x: 0, y: 0 },
              preventDrag: !1,
              currentValue: this.value
            }
          },
          mounted() {
            this.isRoot && document.addEventListener("mouseup", this.onDocumentMouseupHandler)
          },
          beforeDestroy() {
            document.removeEventListener("mouseup", this.onDocumentMouseupHandler)
          },
          watch: {
            value: function (e) {
              this.currentValue = e
            }
          },
          computed: {
            cursorPosition() {
              return this.isRoot ? this.rootCursorPosition : this.getParent().cursorPosition
            },
            depth() {
              return this.gaps.length
            },
            nodes() {
              if (this.isRoot) {
                const e = this.copy(this.currentValue)
                return this.getNodes(e)
              }
              return this.getParent().nodes[this.parentInd].children
            },
            gaps() {
              const e = []
              let t = this.level - 1
              for (this.showBranches || t++; t-- > 0; ) e.push(t)
              return e
            },
            isRoot() {
              return !this.level
            },
            selectionSize() {
              return this.getSelected().length
            },
            dragSize() {
              return this.getDraggable().length
            },
            rootAllowOnlyInsideDrop() {
              return this.isRoot ? this.allowOnlyInsideDrop : this.getRoot().allowOnlyInsideDrop
            }
          },
          methods: {
            setCursorPosition(e) {
              this.isRoot ? (this.rootCursorPosition = e) : this.getParent().setCursorPosition(e)
            },
            getNodes(e) {
              let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                o = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
              return e.map((r, s) => {
                const i = t.concat(s)
                return this.getNode(i, r, e, o)
              })
            },
            getNode(e) {
              let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null
              const s = e.slice(-1)[0]
              if (
                ((o = o || this.getNodeSiblings(this.currentValue, e)),
                (t = t || (o && o[s]) || null),
                null == r && (r = this.isVisible(e)),
                !t)
              )
                return null
              const i = null == t.isExpanded || !!t.isExpanded,
                n = null == t.isDraggable || !!t.isDraggable,
                l = null == t.isSelectable || !!t.isSelectable
              return {
                title: t.title,
                id: t.id,
                isLeaf: !!t.isLeaf,
                children: t.children ? this.getNodes(t.children, e, i) : [],
                isSelected: !!t.isSelected,
                isExpanded: i,
                isVisible: r,
                isDraggable: n,
                isSelectable: l,
                data: void 0 !== t.data ? t.data : {},
                path: e,
                pathStr: JSON.stringify(e),
                level: e.length,
                ind: s,
                isFirstChild: 0 == s,
                isLastChild: s === o.length - 1
              }
            },
            isVisible(e) {
              if (e.length < 2) return !0
              let t = this.currentValue
              for (let o = 0; o < e.length - 1; o++) {
                let r = t[e[o]]
                if (!(null == r.isExpanded || !!r.isExpanded)) return !1
                t = r.children
              }
              return !0
            },
            emitInput(e) {
              ;(this.currentValue = e), this.getRoot().$emit("input", e)
            },
            emitSelect(e, t) {
              this.getRoot().$emit("select", e, t)
            },
            emitBeforeDrop(e, t, o) {
              this.getRoot().$emit("beforedrop", e, t, o)
            },
            emitDrop(e, t, o) {
              this.getRoot().$emit("drop", e, t, o)
            },
            emitToggle(e, t) {
              this.getRoot().$emit("toggle", e, t)
            },
            emitNodeClick(e, t) {
              this.getRoot().$emit("nodeclick", e, t)
            },
            emitNodeDblclick(e, t) {
              this.getRoot().$emit("nodedblclick", e, t)
            },
            emitNodeContextmenu(e, t) {
              this.getRoot().$emit("nodecontextmenu", e, t)
            },
            onExternalDragoverHandler(e, t) {
              t.preventDefault()
              const o = this.getRoot(),
                r = o.getCursorPositionFromCoords(t.clientX, t.clientY)
              o.setCursorPosition(r), o.$emit("externaldragover", r, t)
            },
            onExternalDropHandler(e, t) {
              const o = this.getRoot(),
                r = o.getCursorPositionFromCoords(t.clientX, t.clientY)
              o.$emit("externaldrop", r, t), this.setCursorPosition(null)
            },
            select(e) {
              let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null
              const r = Array.isArray(this.multiselectKey) ? this.multiselectKey : [this.multiselectKey],
                s = o && !!r.find((e) => o[e])
              t = (s || t) && this.allowMultiselect
              const i = this.getNode(e)
              if (!i) return null
              const n = this.copy(this.currentValue),
                l = this.allowMultiselect && o && o.shiftKey && this.lastSelectedNode,
                a = []
              let u = !1
              return (
                this.traverse((e, o) => {
                  l
                    ? ((e.pathStr !== i.pathStr && e.pathStr !== this.lastSelectedNode.pathStr) ||
                        ((o.isSelected = e.isSelectable), (u = !u)),
                      u && (o.isSelected = e.isSelectable))
                    : e.pathStr === i.pathStr
                    ? (o.isSelected = e.isSelectable)
                    : t || (o.isSelected && (o.isSelected = !1)),
                    o.isSelected && a.push(e)
                }, n),
                (this.lastSelectedNode = i),
                this.emitInput(n),
                this.emitSelect(a, o),
                i
              )
            },
            onMousemoveHandler(e) {
              if (!this.isRoot) return void this.getRoot().onMousemoveHandler(e)
              if (this.preventDrag) return
              const t = this.isDragging,
                o =
                  this.isDragging ||
                  (this.mouseIsDown && (this.lastMousePos.x !== e.clientX || this.lastMousePos.y !== e.clientY)),
                r = !1 === t && !0 === o
              if (((this.lastMousePos = { x: e.clientX, y: e.clientY }), !o)) return
              const s = this.getRoot().$el,
                i = s.getBoundingClientRect(),
                n = this.$refs.dragInfo,
                l = e.clientY - i.top + s.scrollTop - (0 | n.style.marginBottom),
                a = e.clientX - i.left
              ;(n.style.top = l + "px"), (n.style.left = a + "px")
              const u = this.getCursorPositionFromCoords(e.clientX, e.clientY),
                d = u.node,
                c = u.placement
              r && !d.isSelected && this.select(d.path, !1, e)
              if (!this.getDraggable().length) return void (this.preventDrag = !0)
              ;(this.isDragging = o), this.setCursorPosition({ node: d, placement: c })
              const h = i.bottom - this.scrollAreaHeight,
                g = (e.clientY - h) / (i.bottom - h),
                p = i.top + this.scrollAreaHeight,
                f = (p - e.clientY) / (p - i.top)
              g > 0 ? this.startScroll(g) : f > 0 ? this.startScroll(-f) : this.stopScroll()
            },
            getCursorPositionFromCoords(e, t) {
              const o = document.elementFromPoint(e, t),
                r = o.getAttribute("path") ? o : this.getClosetElementWithPath(o)
              let s, i
              if (r) {
                if (!r) return
                s = this.getNode(JSON.parse(r.getAttribute("path")))
                const e = r.offsetHeight,
                  o = this.edgeSize,
                  n = t - r.getBoundingClientRect().top

                if (this.rootAllowOnlyInsideDrop) {
                  i = "inside"
                } else {
                  i = s.isLeaf ? (n >= e / 2 ? "after" : "before") : n <= o ? "before" : n >= e - o ? "after" : "inside"
                }
              } else {
                const e = this.getRoot().$el.getBoundingClientRect()
                t > e.top + e.height / 2
                  ? ((i = "after"), (s = this.getLastNode()))
                  : ((i = "before"), (s = this.getFirstNode()))
              }
              return { node: s, placement: i }
            },
            getClosetElementWithPath(e) {
              return e ? (e.getAttribute("path") ? e : this.getClosetElementWithPath(e.parentElement)) : null
            },
            onMouseleaveHandler(e) {
              if (!this.isRoot || !this.isDragging) return
              const t = this.getRoot().$el.getBoundingClientRect()
              e.clientY >= t.bottom
                ? this.setCursorPosition({ node: this.nodes.slice(-1)[0], placement: "after" })
                : e.clientY < t.top && this.setCursorPosition({ node: this.getFirstNode(), placement: "before" })
            },
            getNodeEl(e) {
              this.getRoot().$el.querySelector('[path="'.concat(JSON.stringify(e), '"]'))
            },
            getLastNode() {
              let e = null
              return (
                this.traverse((t) => {
                  e = t
                }),
                e
              )
            },
            getFirstNode() {
              return this.getNode([0])
            },
            getNextNode(e) {
              let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                o = null
              return (
                this.traverse((r) => {
                  if (!(this.comparePaths(r.path, e) < 1)) return !t || t(r) ? ((o = r), !1) : void 0
                }),
                o
              )
            },
            getPrevNode(e, t) {
              let o = []
              this.traverse((t) => {
                if (this.comparePaths(t.path, e) >= 0) return !1
                o.push(t)
              })
              let r = o.length
              for (; r--; ) {
                const e = o[r]
                if (!t || t(e)) return e
              }
              return null
            },
            comparePaths(e, t) {
              for (let o = 0; o < e.length; o++) {
                if (null == t[o]) return 1
                if (e[o] > t[o]) return 1
                if (e[o] < t[o]) return -1
              }
              return null == t[e.length] ? 0 : -1
            },
            onNodeMousedownHandler(e, t) {
              0 === e.button && (this.isRoot ? (this.mouseIsDown = !0) : this.getRoot().onNodeMousedownHandler(e, t))
            },
            startScroll(e) {
              const t = this.getRoot().$el
              this.scrollSpeed !== e &&
                (this.scrollIntervalId && this.stopScroll(),
                (this.scrollSpeed = e),
                (this.scrollIntervalId = setInterval(() => {
                  t.scrollTop += this.maxScrollSpeed * e
                }, 20)))
            },
            stopScroll() {
              clearInterval(this.scrollIntervalId), (this.scrollIntervalId = 0), (this.scrollSpeed = 0)
            },
            onDocumentMouseupHandler(e) {
              this.isDragging && this.onNodeMouseupHandler(e)
            },
            onNodeMouseupHandler(e) {
              let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null
              if (0 !== e.button) return
              if (!this.isRoot) return void this.getRoot().onNodeMouseupHandler(e, t)
              if (
                ((this.mouseIsDown = !1),
                this.isDragging || !t || this.preventDrag || this.select(t.path, !1, e),
                (this.preventDrag = !1),
                !this.cursorPosition)
              )
                return void this.stopDrag()
              const o = this.getDraggable()
              for (let e of o) {
                if (e.pathStr == this.cursorPosition.node.pathStr) return void this.stopDrag()
                if (this.checkNodeIsParent(e, this.cursorPosition.node)) return void this.stopDrag()
              }
              const r = this.copy(this.currentValue),
                s = []
              for (let e of o) {
                const t = this.getNodeSiblings(r, e.path)[e.ind]
                s.push(t)
              }
              let i = !1
              if ((this.emitBeforeDrop(o, this.cursorPosition, () => (i = !0)), i)) return void this.stopDrag()
              const n = []
              for (let e of s) n.push(this.copy(e)), (e._markToDelete = !0)
              this.insertModels(this.cursorPosition, n, r),
                this.traverseModels((e, t, o) => {
                  e._markToDelete && t.splice(o, 1)
                }, r),
                (this.lastSelectedNode = null),
                this.emitInput(r),
                this.emitDrop(o, this.cursorPosition, e),
                this.stopDrag()
            },
            onToggleHandler(e, t) {
              this.allowToggleBranch &&
                (this.updateNode(t.path, { isExpanded: !t.isExpanded }), this.emitToggle(t, e), e.stopPropagation())
            },
            stopDrag() {
              ;(this.isDragging = !1), (this.mouseIsDown = !1), this.setCursorPosition(null), this.stopScroll()
            },
            getParent() {
              return this.$parent
            },
            getRoot() {
              return this.isRoot ? this : this.getParent().getRoot()
            },
            getNodeSiblings(e, t) {
              return 1 === t.length ? e : this.getNodeSiblings(e[t[0]].children, t.slice(1))
            },
            updateNode(e, t) {
              if (!this.isRoot) return void this.getParent().updateNode(e, t)
              const o = JSON.stringify(e),
                r = this.copy(this.currentValue)
              this.traverse((e, r) => {
                e.pathStr === o && Object.assign(r, t)
              }, r),
                this.emitInput(r)
            },
            getSelected() {
              const e = []
              return (
                this.traverse((t) => {
                  t.isSelected && e.push(t)
                }),
                e
              )
            },
            getDraggable() {
              const e = []
              return (
                this.traverse((t) => {
                  t.isSelected && t.isDraggable && e.push(t)
                }),
                e
              )
            },
            traverse(e) {
              let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : []
              t || (t = this.currentValue)
              let r = !1
              const s = []
              for (let i = 0; i < t.length; i++) {
                const n = t[i],
                  l = o.concat(i),
                  a = this.getNode(l, n, t)
                if (((r = !1 === e(a, n, t)), s.push(a), r)) break
                if (n.children && ((r = !1 === this.traverse(e, n.children, l)), r)) break
              }
              return !r && s
            },
            traverseModels(e, t) {
              let o = t.length
              for (; o--; ) {
                const r = t[o]
                r.children && this.traverseModels(e, r.children), e(r, t, o)
              }
              return t
            },
            remove(e) {
              const t = e.map((e) => JSON.stringify(e)),
                o = this.copy(this.currentValue)
              this.traverse((e, o, r) => {
                for (const r of t) e.pathStr === r && (o._markToDelete = !0)
              }, o),
                this.traverseModels((e, t, o) => {
                  e._markToDelete && t.splice(o, 1)
                }, o),
                this.emitInput(o)
            },
            insertModels(e, t, o) {
              const r = e.node,
                s = this.getNodeSiblings(o, r.path),
                i = s[r.ind]
              if ("inside" === e.placement) (i.children = i.children || []), i.children.unshift(...t)
              else {
                const o = "before" === e.placement ? r.ind : r.ind + 1
                s.splice(o, 0, ...t)
              }
            },
            insert(e, t) {
              const o = Array.isArray(t) ? t : [t],
                r = this.copy(this.currentValue)
              this.insertModels(e, o, r), this.emitInput(r)
            },
            checkNodeIsParent(e, t) {
              const o = t.path
              return JSON.stringify(o.slice(0, e.path.length)) == e.pathStr
            },
            copy: (e) => JSON.parse(JSON.stringify(e))
          }
        },
        s = function () {
          var e = this,
            t = e.$createElement,
            o = e._self._c || t
          return o(
            "div",
            {
              staticClass: "sl-vue-tree",
              class: {
                "sl-vue-tree-root": e.isRoot,
                "only-inside-drop": e.rootAllowOnlyInsideDrop
              },
              on: {
                mousemove: e.onMousemoveHandler,
                mouseleave: e.onMouseleaveHandler,
                dragend: function (t) {
                  return e.onDragendHandler(null, t)
                }
              }
            },
            [
              o(
                "div",
                { ref: "nodes", staticClass: "sl-vue-tree-nodes-list" },
                [
                  e._l(e.nodes, function (t, r) {
                    return o(
                      "div",
                      { staticClass: "sl-vue-tree-node", class: { "sl-vue-tree-selected": t.isSelected } },
                      [
                        !e.rootAllowOnlyInsideDrop
                          ? o("div", {
                              staticClass: "sl-vue-tree-cursor sl-vue-tree-cursor_before",
                              style: {
                                visibility:
                                  e.cursorPosition &&
                                  e.cursorPosition.node.pathStr === t.pathStr &&
                                  "before" === e.cursorPosition.placement
                                    ? "visible"
                                    : "hidden",
                                "--depth": e.depth
                              },
                              on: {
                                dragover: function (e) {
                                  e.preventDefault()
                                }
                              }
                            })
                          : e._e(),
                        e._v(" "),
                        o(
                          "div",
                          {
                            staticClass: "sl-vue-tree-node-item",
                            class: {
                              "sl-vue-tree-cursor-hover":
                                e.cursorPosition && e.cursorPosition.node.pathStr === t.pathStr,
                              "sl-vue-tree-cursor-inside":
                                e.cursorPosition &&
                                "inside" === e.cursorPosition.placement &&
                                e.cursorPosition.node.pathStr === t.pathStr,
                              "sl-vue-tree-node-is-leaf": t.isLeaf,
                              "sl-vue-tree-node-is-folder": !t.isLeaf
                            },
                            attrs: { path: t.pathStr },
                            on: {
                              mousedown: function (o) {
                                return e.onNodeMousedownHandler(o, t)
                              },
                              mouseup: function (o) {
                                return e.onNodeMouseupHandler(o, t)
                              },
                              contextmenu: function (o) {
                                return e.emitNodeContextmenu(t, o)
                              },
                              dblclick: function (o) {
                                return e.emitNodeDblclick(t, o)
                              },
                              click: function (o) {
                                return e.emitNodeClick(t, o)
                              },
                              dragover: function (o) {
                                return e.onExternalDragoverHandler(t, o)
                              },
                              drop: function (o) {
                                return e.onExternalDropHandler(t, o)
                              }
                            }
                          },
                          [
                            e._l(e.gaps, function (e) {
                              return o("div", { staticClass: "sl-vue-tree-gap" })
                            }),
                            e._v(" "),
                            e.level && e.showBranches
                              ? o(
                                  "div",
                                  { staticClass: "sl-vue-tree-branch" },
                                  [
                                    e._t(
                                      "branch",
                                      function () {
                                        return [
                                          t.isLastChild
                                            ? e._e()
                                            : o("span", [
                                                e._v(
                                                  "\n            " +
                                                    e._s(String.fromCharCode(9500)) +
                                                    e._s(String.fromCharCode(9472)) +
                                                    " \n          "
                                                )
                                              ]),
                                          e._v(" "),
                                          t.isLastChild
                                            ? o("span", [
                                                e._v(
                                                  "\n            " +
                                                    e._s(String.fromCharCode(9492)) +
                                                    e._s(String.fromCharCode(9472)) +
                                                    " \n          "
                                                )
                                              ])
                                            : e._e()
                                        ]
                                      },
                                      { node: t }
                                    )
                                  ],
                                  2
                                )
                              : e._e(),
                            e._v(" "),
                            o(
                              "div",
                              { staticClass: "sl-vue-tree-title" },
                              [
                                t.isLeaf
                                  ? e._e()
                                  : o(
                                      "span",
                                      {
                                        staticClass: "sl-vue-tree-toggle",
                                        on: {
                                          click: function (o) {
                                            return e.onToggleHandler(o, t)
                                          }
                                        }
                                      },
                                      [
                                        e._t(
                                          "toggle",
                                          function () {
                                            return [
                                              o("span", [
                                                e._v(
                                                  "\n             " +
                                                    e._s(t.isLeaf ? "" : t.isExpanded ? "-" : "+") +
                                                    "\n            "
                                                )
                                              ])
                                            ]
                                          },
                                          { node: t }
                                        )
                                      ],
                                      2
                                    ),
                                e._v(" "),
                                e._t(
                                  "title",
                                  function () {
                                    return [e._v(e._s(t.title))]
                                  },
                                  { node: t }
                                ),
                                e._v(" "),
                                !t.isLeaf && 0 == t.children.length && t.isExpanded
                                  ? e._t("empty-node", null, { node: t })
                                  : e._e()
                              ],
                              2
                            ),
                            e._v(" "),
                            o("div", { staticClass: "sl-vue-tree-sidebar" }, [e._t("sidebar", null, { node: t })], 2)
                          ],
                          2
                        ),
                        e._v(" "),
                        t.children && t.children.length && t.isExpanded
                          ? o("sl-vue-tree", {
                              attrs: {
                                value: t.children,
                                level: t.level,
                                parentInd: r,
                                allowMultiselect: e.allowMultiselect,
                                allowToggleBranch: e.allowToggleBranch,
                                edgeSize: e.edgeSize,
                                showBranches: e.showBranches,
                                allowOnlyInsideDrop: e.allowOnlyInsideDrop
                              },
                              on: {
                                dragover: function (e) {
                                  e.preventDefault()
                                }
                              },
                              scopedSlots: e._u(
                                [
                                  {
                                    key: "title",
                                    fn: function (t) {
                                      var o = t.node
                                      return [
                                        e._t(
                                          "title",
                                          function () {
                                            return [e._v(e._s(o.title))]
                                          },
                                          { node: o }
                                        )
                                      ]
                                    }
                                  },
                                  {
                                    key: "toggle",
                                    fn: function (t) {
                                      var r = t.node
                                      return [
                                        e._t(
                                          "toggle",
                                          function () {
                                            return [
                                              o("span", [
                                                e._v(
                                                  "\n             " +
                                                    e._s(r.isLeaf ? "" : r.isExpanded ? "-" : "+") +
                                                    "\n          "
                                                )
                                              ])
                                            ]
                                          },
                                          { node: r }
                                        )
                                      ]
                                    }
                                  },
                                  {
                                    key: "sidebar",
                                    fn: function (t) {
                                      var o = t.node
                                      return [e._t("sidebar", null, { node: o })]
                                    }
                                  },
                                  {
                                    key: "empty-node",
                                    fn: function (t) {
                                      var o = t.node
                                      return [
                                        !o.isLeaf && 0 == o.children.length && o.isExpanded
                                          ? e._t("empty-node", null, { node: o })
                                          : e._e()
                                      ]
                                    }
                                  }
                                ],
                                null,
                                !0
                              )
                            })
                          : e._e(),
                        e._v(" "),
                        !e.rootAllowOnlyInsideDrop
                          ? o("div", {
                              staticClass: "sl-vue-tree-cursor sl-vue-tree-cursor_after",
                              style: {
                                visibility:
                                  e.cursorPosition &&
                                  e.cursorPosition.node.pathStr === t.pathStr &&
                                  "after" === e.cursorPosition.placement
                                    ? "visible"
                                    : "hidden",
                                "--depth": e.depth
                              },
                              on: {
                                dragover: function (e) {
                                  e.preventDefault()
                                }
                              }
                            })
                          : e._e()
                      ],
                      1
                    )
                  }),
                  e._v(" "),
                  e.isRoot
                    ? o(
                        "div",
                        {
                          directives: [
                            { name: "show", rawName: "v-show", value: e.isDragging, expression: "isDragging" }
                          ],
                          ref: "dragInfo",
                          staticClass: "sl-vue-tree-drag-info"
                        },
                        [
                          e._t("draginfo", function () {
                            return [e._v("\n        Items: " + e._s(e.selectionSize) + "\n      ")]
                          })
                        ],
                        2
                      )
                    : e._e()
                ],
                2
              )
            ]
          )
        }
      s._withStripped = !0
      var i = (function (e, t, o, r, s, i, n, l) {
        var a = typeof (e = e || {}).default
        ;("object" !== a && "function" !== a) || (e = e.default)
        var u,
          d = "function" == typeof e ? e.options : e
        if (
          (t && ((d.render = t), (d.staticRenderFns = o), (d._compiled = !0)),
          r && (d.functional = !0),
          i && (d._scopeId = i),
          n
            ? ((u = function (e) {
                ;(e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)) ||
                  "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                  (e = __VUE_SSR_CONTEXT__),
                  s && s.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(n)
              }),
              (d._ssrRegister = u))
            : s &&
              (u = l
                ? function () {
                    s.call(this, this.$root.$options.shadowRoot)
                  }
                : s),
          u)
        )
          if (d.functional) {
            d._injectStyles = u
            var c = d.render
            d.render = function (e, t) {
              return u.call(t), c(e, t)
            }
          } else {
            var h = d.beforeCreate
            d.beforeCreate = h ? [].concat(h, u) : [u]
          }
        return { exports: e, options: d }
      })(r, s, [], !1, null, null, null)
      i.options.__file = "src/sl-vue-tree.vue"
      t.default = i.exports
    }
  ]).default
})
