import { Element, Paragraph } from "@canvas-2d/core"
import { CanvasJSON, JSON_DATA } from "@canvas-2d/canvas-json/src"
import { CanvasTransform } from "@canvas-2d/canvas-transform/src"
import { CanvasInput } from "@canvas-2d/canvas-input/src"

interface CanvasEditorParams extends Omit<JSON_DATA, "canvas"> {
  container: HTMLElement
}

export class CanvasEditor extends CanvasJSON {
  dynamicCanvas = document.createElement("canvas")

  canvasTransform!: CanvasTransform

  canvasInput!: CanvasInput

  isEditor = false

  constructor(params: CanvasEditorParams) {
    const { container, width, height } = params
    super(params)

    const { dynamicCanvas } = this

    dynamicCanvas.setAttribute("width", `${width}`)

    dynamicCanvas.setAttribute("height", `${height}`)

    this.canvasTransform = new CanvasTransform({
      canvas: dynamicCanvas,
      elementBlurCallback: (ev: PointerEvent, isDblclick: boolean) =>
        this.transElementBlurCallback(ev, isDblclick)
    })

    this.canvasInput = new CanvasInput({
      canvas: dynamicCanvas,
      elementBlurCallback: (ev: PointerEvent) => this.inputCanvasBlurCallback(ev)
    })

    this.createCanvas(container)
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

  isDblclick = false

  dblclickCallback() {
    this.isDblclick = true
  }

  onPointerdown(ev: PointerEvent) {
    super.onPointerdown(ev)
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    const { elements } = this
    for (let i = 0; i < elements.length; i++) {
      const ele = elements[i]
      if (ele.elementBox.isPointInFrame(p, ele.rotate)) {
        if (this.isDblclick) {
          if (ele.type === "paragraph") {
            this.inputCanvasActive(ele as Paragraph, ev)
          }
          this.isDblclick = false
          return
        }
        this.transformCanvasActive(ele, ev)
        return
      }
    }
  }

  inputCanvasActive(ele: Paragraph, ev: PointerEvent) {
    const { canvasInput } = this
    if (canvasInput.paragraph) return

    this.transformCanvasBlur()

    this.canvasInput.setParagraph(ele)
    this.updateFocusCanvas(true)
    this.disappearElement(ele)
  }

  inputCanvasBlurCallback(ev: PointerEvent) {
    const { canvasInput } = this
    if (!canvasInput.paragraph) return
    this.appearElement(canvasInput.paragraph)
    this.canvasInput.removeParagraph()
    this.updateFocusCanvas(false)
    this.onPointerdown(ev)
  }

  transformCanvasActive(ele: Element, ev: PointerEvent) {
    const { canvasTransform } = this
    if (canvasTransform.controlElement) return
    canvasTransform.setBoxElement(ele)
    this.updateFocusCanvas(true)
    this.canvasTransform.onPointerdown(ev)
    this.disappearElement(ele)
  }

  transformCanvasBlur() {
    const { canvasTransform } = this
    if (!canvasTransform.controlElement) return

    this.appearElement(canvasTransform.controlElement.boxElement as Element)
    canvasTransform.removeBoxElement()
    this.updateFocusCanvas(false)
  }

  transElementBlurCallback = (ev: PointerEvent, isDblclick: boolean) => {
    this.transformCanvasBlur()
    this.isDblclick = isDblclick
    this.onPointerdown(ev)
  }

  update() {
    this.render()
  }

  async createCanvas(container: HTMLElement) {
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
    await this.loadElements()
    this.render()
  }
}

export * from "@canvas-2d/canvas-json"
