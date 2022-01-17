import { Element } from "@canvas-2d/core"
import { CanvasJSON, JSON_DATA } from "@canvas-2d/canvas-json/src"
import { CanvasTransform } from "@canvas-2d/canvas-transform/src"

interface CanvasEditorParams extends Omit<JSON_DATA, "canvas"> {
  container: HTMLElement
}

export class CanvasEditor extends CanvasJSON {
  dynamicCanvas = document.createElement("canvas")

  canvasTransform: CanvasTransform | null = null

  isEditor = false

  constructor(params: CanvasEditorParams) {
    const { container } = params
    super(params)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)
    this.createCanvas(container)
  }

  createCanvas(container: HTMLElement) {
    const { canvas, dynamicCanvas, width, height } = this
    container.innerHTML = ""
    if (width) {
      canvas.width = width
      dynamicCanvas.width = width
      container.style.width = width + "px"
    }
    if (height) {
      canvas.height = height
      dynamicCanvas.height = height
      container.style.height = height + "px"
    }

    {
      canvas.style.position = "absolute"
      dynamicCanvas.style.position = "absolute"
      container.style.position = "relative"
    }

    {
      canvas.style.top = "0px"
      dynamicCanvas.style.top = "0px"
      canvas.style.left = "0px"
      dynamicCanvas.style.left = "0px"
    }

    {
      container.style.userSelect = "none"
      container.style.boxSizing = "content-box"
      dynamicCanvas.style.pointerEvents = "none"
    }
    container.appendChild(canvas)
    container.appendChild(dynamicCanvas)
    // TODO: 放在 对象 初始化 时
    this.loadElements()
    this.render()
  }

  updateFocusCanvas(isEditor: boolean = false) {
    const { dynamicCanvas } = this
    this.isEditor = isEditor
    if (isEditor) {
      dynamicCanvas.style.pointerEvents = "auto"
    } else {
      dynamicCanvas.style.pointerEvents = "none"
    }
  }

  onPointerdown = (ev: PointerEvent) => {
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    const { elements } = this
    for (let i = 0; i < elements.length; i++) {
      const ele = elements[i]
      if (ele.elementBox.isPointInFrame(p, ele.rotate)) {
        this.transformCanvasActive(ele, ev)
        return
      }
    }
  }

  transformCanvasActive(ele: Element, ev: PointerEvent) {
    if (this.canvasTransform) return
    const { json, dynamicCanvas } = this
    this.canvasTransform = new CanvasTransform({
      ...json,
      canvas: dynamicCanvas,
      elementBlurCallback: (ev: PointerEvent) => this.transElementBlurCallback(ev),
      boxElement: ele
    })

    this.updateFocusCanvas(true)

    this.canvasTransform.onPointerdown(ev)

    this.disappearElement(ele)
  }

  transElementBlurCallback = (ev: PointerEvent) => {
    const { canvasTransform } = this
    if (!canvasTransform || !canvasTransform.controlElement) return
    this.appearElement(canvasTransform.controlElement.boxElement as Element)
    canvasTransform.destroy()
    this.canvasTransform = null

    this.updateFocusCanvas(false)
    this.onPointerdown(ev)
  }

  update() {
    this.render()
  }
}

export * from "@canvas-2d/canvas-json"
