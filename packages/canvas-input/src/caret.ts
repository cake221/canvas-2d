import { Shape, Rect, D_SHAPE } from "@canvas-2d/core"

const caretShapeData: D_SHAPE = {
  type: "shape",
  d_path: {
    type: "rect",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  fill: "red"
}

export class Caret {
  caretImageData?: ImageData

  caretImageX!: number

  caretImageY!: number

  caretShape!: Shape

  show = false

  time?: NodeJS.Timeout

  constructor(
    public x: number = 0,
    public y: number = 0,
    public height: number,
    public width: number = 2
  ) {
    this.caretShape = Shape.createObj(Shape, caretShapeData)
  }

  showCaret(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height, caretShape } = this

    this.caretImageX = x
    this.caretImageY = y
    this.caretImageData = ctx.getImageData(this.caretImageX, this.caretImageY, width, height)
    caretShape.path.origin.x = x
    caretShape.path.origin.y = y
    ;(caretShape.path as Rect).width = width
    ;(caretShape.path as Rect).height = height

    caretShape.render(ctx)
  }

  hideCaret(ctx: CanvasRenderingContext2D): void {
    const { caretImageData, caretImageX, caretImageY } = this
    caretImageData && ctx.putImageData(caretImageData, caretImageX, caretImageY)
  }

  cancelTwinkle(ctx: CanvasRenderingContext2D): void {
    this.hideCaret(ctx)
    clearTimeout(this.time!)
  }

  startTwinkle(ctx: CanvasRenderingContext2D): void {
    this.show = true
    this.twinkle(ctx)
  }

  twinkle(ctx: CanvasRenderingContext2D): void {
    const { show } = this
    show ? this.hideCaret(ctx) : this.showCaret(ctx)
    this.show = !this.show
    this.time = setTimeout(
      () => {
        this.twinkle(ctx)
      },
      show ? 300 : 700
    )
  }

  clearTime() {
    this.time && clearTimeout(this.time)
    this.time = undefined
  }

  update(ctx: CanvasRenderingContext2D): void {
    this.hideCaret(ctx)
    this.showCaret(ctx)
  }

  clear(ctx: CanvasRenderingContext2D): void {
    this.show && this.hideCaret(ctx)
    this.clearTime()
  }
}
