import { Point } from "./point"

export interface CanvasBaseParam {
  width?: number
  height?: number
  dpr?: number
  canvas?: HTMLCanvasElement
}

export class CanvasBase {
  canvas!: HTMLCanvasElement

  ctx!: CanvasRenderingContext2D

  /**
   * devicePixelRatio 设备像素 / css 像素
   */
  dpr = 1

  setDpr() {
    const { dpr, width, height, ctx } = this
    this.width = dpr * width
    this.height = dpr * height
    ctx.setTransform(1, 0, 0, 1, 0, 0) // scale 前先恢复变换矩阵，不然会重复 scale
    ctx.scale(dpr, dpr)
  }

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

  constructor({ dpr, width, height, canvas }: CanvasBaseParam) {
    if (canvas) {
      this.canvas = canvas
    } else {
      this.canvas = document.createElement("canvas")
    }
    this.ctx = this.canvas.getContext("2d")!
    if (!this.ctx) {
      throw new Error("没有 ctx")
    }
    dpr && (this.dpr = dpr)
    width && (this.width = width)
    height && (this.height = height)

    this.canvas.addEventListener("click", (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      this.onPoint(this.dom2CanvasPoint(ev.pageX, ev.pageY))
    })
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
}
