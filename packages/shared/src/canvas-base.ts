import { Point } from "./point"
import { throttle } from "./utils"

export interface CanvasBaseParam {
  width?: number
  height?: number
  canvas?: HTMLCanvasElement
  dblclickDelay?: number
}

export class CanvasBase {
  canvas!: HTMLCanvasElement

  ctx!: CanvasRenderingContext2D

  active = false

  _height = 150

  set height(val: number) {
    this._height = val
    this.canvas.setAttribute("height", `${val}`)
  }

  get height() {
    return this._height
  }

  _width = 300

  set width(val: number) {
    this._width = val
    this.canvas.setAttribute("width", `${val}`)
  }

  get width() {
    return this._width
  }

  toBase64() {
    return this.canvas.toDataURL("image/png")
  }

  constructor(params: CanvasBaseParam) {
    const { width, height, canvas, dblclickDelay } = params
    if (canvas) {
      this.canvas = canvas
    } else {
      this.canvas = document.createElement("canvas")
    }
    this.ctx = this.canvas.getContext("2d")!
    if (!this.ctx) {
      throw new Error("没有 ctx")
    }

    if (width) {
      this.width = width
    } else {
      this._width = Number(this.canvas.getAttribute("width"))
    }

    if (height) {
      this.height = height
    } else {
      this._height = Number(this.canvas.getAttribute("height"))
    }

    dblclickDelay && (this.dblclickDelay = dblclickDelay)

    this.canvas.addEventListener("pointerdown", this.baseOnPointerdown)
    this.canvas.addEventListener("pointermove", this.baseOnPointermove)
    this.canvas.addEventListener("pointerup", this.baseOnPointerup)
  }

  baseOnPointerup = throttle((ev: PointerEvent) => this.onPointerup(ev))
  baseOnPointerdown = throttle((ev: PointerEvent) => this.onPointerdown(ev))
  baseOnPointermove = throttle((ev: PointerEvent) => this.onPointermove(ev))

  destroy() {
    const { canvas } = this
    canvas.removeEventListener("pointerdown", this.baseOnPointerdown)
    canvas.removeEventListener("pointermove", this.baseOnPointermove)
    canvas.removeEventListener("pointerup", this.baseOnPointerup)
  }

  private lastClickTime = 0

  cancelDblclickEffect() {
    this.lastClickTime = 0
  }

  dblclickDelay = 300

  dblclickCallback(ev: PointerEvent) {}

  onPointerdown(ev: PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
    this.active = true

    const time = Date.now()
    if (time - this.lastClickTime < this.dblclickDelay) {
      this.dblclickCallback(ev)
    }
    this.lastClickTime = time
  }

  onPointermove(ev: PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    if (p.x <= 0 || p.y <= 0) {
      this.active = false
    }
  }

  onPointerup(ev: PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
  }

  dom2CanvasPoint(pageX: number, pageY: number) {
    const { canvas, width, height } = this
    const { width: clientWidth, height: clientHeight, left, top } = canvas.getBoundingClientRect()
    const x = ((pageX - left) / clientWidth) * width
    const y = ((pageY - top) / clientHeight) * height
    return new Point(x, y)
  }

  clear() {
    const { ctx } = this
    ctx.clearRect(0, 0, this.width, this.height)
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this.ctx.clearRect(x, y, w, h)
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, h)
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    this.ctx.strokeRect(x, y, w, h)
  }

  setGlobalAlpha(alpha: number) {
    this.ctx.globalAlpha = alpha
  }

  setGlobalCompositeOperation(compositeOperation: string) {
    this.ctx.globalCompositeOperation = compositeOperation
  }

  setBackground(fill: string) {
    const { ctx, width, height } = this
    ctx.save()
    ctx.fillStyle = fill
    this.fillRect(0, 0, width, height)
    ctx.restore()
  }

  onPoint(p: Point) {}

  drawPoint(x: number, y: number, fill = "rgba(255, 0, 255, 0.2)", size = 5) {
    const { ctx } = this
    ctx.save()
    ctx.fillStyle = fill
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
    ctx.restore()
  }

  drawLine(p1: Point, p2: Point, stroke = "rgba(255, 0, 255, 0.2)", firstPointFill = "orange") {
    const { ctx } = this
    ctx.save()
    ctx.strokeStyle = stroke
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
    this.drawPoint(p1.x, p1.y, firstPointFill)
    ctx.restore()
  }
}
