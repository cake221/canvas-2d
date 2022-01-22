import { Element, Paragraph } from "@canvas-2d/core"
import { CanvasJSON, JSON_DATA } from "@canvas-2d/canvas-json/src"
import { CanvasTransform } from "@canvas-2d/canvas-transform/src"
import { CanvasInput } from "@canvas-2d/canvas-input/src"

export type EleActiveCallback = (ele?: Element | null) => void

interface CanvasEditorParams extends Omit<JSON_DATA, "canvas"> {
  container: HTMLElement
  eleChange: EleActiveCallback
}

export class CanvasEditor extends CanvasJSON {
  dynamicCanvas = document.createElement("canvas")

  canvasTransform!: CanvasTransform

  canvasInput!: CanvasInput

  isEditor = false

  eleChange: EleActiveCallback = () => {}

  constructor(params: CanvasEditorParams) {
    const { container, width, height, eleChange } = params
    super(params)

    const { dynamicCanvas } = this

    eleChange && (this.eleChange = eleChange)

    dynamicCanvas.setAttribute("width", `${width}`)

    dynamicCanvas.setAttribute("height", `${height}`)

    this.canvasTransform = new CanvasTransform({
      canvas: dynamicCanvas,
      elementBlurCallback: (ev: PointerEvent, isDblclick: boolean) =>
        this.transElementBlurCallback(ev, isDblclick),
      renderCallBack: () => this.eleChange()
    })

    this.canvasInput = new CanvasInput({
      canvas: dynamicCanvas,
      elementBlurCallback: (ev: PointerEvent) => this.inputCanvasBlurCallback(ev),
      renderCallBack: () => this.eleChange()
    })

    this.createCanvas(container)
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

    this.removeTransCanvas()

    // 显示 CanvasInput
    this.canvasInput.setParagraph(ele)
    this.disappearElement(ele)

    // 更新元素
    this.updateElement(ele)
  }

  inputCanvasBlurCallback(ev: PointerEvent) {
    const { canvasInput } = this
    if (!canvasInput.paragraph) return

    // 移除 canvasInput
    this.appearElement(canvasInput.paragraph)
    this.canvasInput.removeParagraph()

    // 触发 canvasTrans
    this.cancelDblclickEffect()
    this.onPointerdown(ev)

    this.updateElement(null)
  }

  transformCanvasActive(ele: Element, ev: PointerEvent) {
    const { canvasTransform } = this
    if (canvasTransform.controlElement) return

    // transformCanvas 展示
    canvasTransform.setBoxElement(ele)
    this.disappearElement(ele)

    // 更新元素
    this.updateElement(ele)

    this.canvasTransform.onPointerdown(ev)
  }

  // 移除 canvasTrans
  removeTransCanvas() {
    const { canvasTransform } = this
    if (!canvasTransform.controlElement) return

    this.appearElement(canvasTransform.controlElement.boxElement as Element)
    canvasTransform.removeBoxElement()
  }

  transElementBlurCallback = (ev: PointerEvent, isDblclick: boolean) => {
    const { canvasTransform } = this
    if (isDblclick) {
      const { boxElement } = canvasTransform.controlElement!
      if ((boxElement as Element).type !== "paragraph") {
        return
      }
    }

    this.removeTransCanvas()
    this.isDblclick = isDblclick

    // 触发 CanvasInput
    this.cancelDblclickEffect()
    this.onPointerdown(ev)

    this.updateElement(null)
  }

  // 是否选中元素
  updateElement(ele: Element | null) {
    if (ele === null) {
      if (!this.canvasInput.paragraph && !this.canvasTransform.controlElement) {
        this.eleChange(null)
        this.updateFocusCanvas(false)
      }
    } else {
      this.eleChange(ele)
      this.updateFocusCanvas(true)
    }
  }

  update() {
    const { canvasInput, canvasTransform } = this
    if (canvasInput.paragraph) {
      canvasInput.render()
    } else if (canvasTransform.controlElement) {
      canvasTransform.render()
    } else {
      this.render()
    }
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

  cancelDblclickEffect() {
    super.cancelDblclickEffect()
    this.canvasTransform.cancelDblclickEffect()
    this.canvasInput.cancelDblclickEffect()
  }

  async createCanvas(container: HTMLElement) {
    const { canvas, dynamicCanvas, width, height } = this
    container.innerHTML = ""
    if (width) {
      dynamicCanvas.width = width
      container.style.width = width + "px"
      dynamicCanvas.style.width = width + "px"
    }
    if (height) {
      dynamicCanvas.height = height
      container.style.height = height + "px"
      dynamicCanvas.style.height = height + "px"
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
  }
}
