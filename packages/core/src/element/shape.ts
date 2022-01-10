import { Element, RenderParam } from "./_element"
import { D_PATH, D_SHAPE } from "../type"
import { genPath, Path, Path_Path } from "../path"

/**
 * Shape Element class.
 */
export class Shape extends Element implements D_SHAPE {
  public ATTRIBUTE_NAMES: (keyof D_SHAPE)[] = ["d_path"]
  /**
   * Shape type
   */
  public readonly type = "shape"

  d_path!: D_PATH

  path!: Path

  constructor() {
    super()
    this.ATTRIBUTE_NAMES.push(...Element.ELEMENT_ATTRIBUTES)
  }

  public render(ctx: CanvasRenderingContext2D, param?: RenderParam): void {
    if (!this.path) return
    const { origin } = this
    this.renderParam = param
    this.renderBefore(ctx)
    this.path.takeEffect(ctx, {
      origin
    })
    this.renderFillStroke(ctx)
    this.renderAfter(ctx)
  }

  public countFrameElement(ctx: CanvasRenderingContext2D): void {
    this.elementFrame = this.path.path_Frame
  }

  renderFillStroke(ctx: CanvasRenderingContext2D): void {
    this.setContextParam(ctx)
    this.renderFill(ctx)
    this.renderStroke(ctx)
  }

  renderStroke(ctx: CanvasRenderingContext2D) {
    const { path } = this
    if (path instanceof Path_Path) {
      ctx.stroke(new Path2D(path.path))
    } else {
      ctx.stroke()
    }
  }

  renderFill(ctx: CanvasRenderingContext2D) {
    const { path } = this

    if (path instanceof Path_Path) {
      const path2d = new Path2D(path.path)
      if (this.fillRule === "evenodd") {
        ctx.fill(path2d, "evenodd")
      } else {
        ctx.fill(path2d)
      }
    } else {
      if (this.fillRule === "evenodd") {
        ctx.fill("evenodd")
      } else {
        ctx.fill()
      }
    }
  }

  fromJSON(json: D_SHAPE): void {
    super.fromJSON(json)
    const { d_path } = json
    this.path = genPath(d_path)
  }
}
