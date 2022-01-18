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
      elementBlurCallback: (ev: PointerEvent) => this.transElementBlurCallback(ev)
    })

    this.canvasInput = new CanvasInput({
      canvas: dynamicCanvas,
      elementBlurCallback: () => this.inputCanvasBlurCallback()
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

  onPointerdown(ev: PointerEvent) {
    super.onPointerdown(ev)
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    const { elements } = this
    for (let i = 0; i < elements.length; i++) {
      const ele = elements[i]
      if (ele.elementBox.isPointInFrame(p, ele.rotate)) {
        if (ele.type === "paragraph") {
          this.inputCanvasActive(ele as Paragraph, ev)
        } else {
          this.transformCanvasActive(ele, ev)
        }

        return
      }
    }
  }

  inputCanvasActive(ele: Paragraph, ev: PointerEvent) {
    const { canvasInput } = this
    if (canvasInput.paragraph) return

    this.canvasInput.setParagraph(ele)
    this.transformCanvasBlur()

    this.updateFocusCanvas(true)

    this.canvasInput.onPointerdown(ev)

    this.disappearElement(ele)
  }

  inputCanvasBlurCallback() {
    const { canvasInput } = this
    if (!canvasInput.paragraph) return
    this.appearElement(canvasInput.paragraph)
    this.canvasInput.removeParagraph()
    this.updateFocusCanvas(false)
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

  transElementBlurCallback = (ev: PointerEvent) => {
    this.transformCanvasBlur()
    this.onPointerdown(ev)
  }

  update() {
    this.render()
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
}

export * from "@canvas-2d/canvas-json"
