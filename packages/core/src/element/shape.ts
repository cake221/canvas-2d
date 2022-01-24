import { Box } from "@canvas-2d/shared"

import { Element, RenderParam } from "./_element"
import { D_PATH, D_SHAPE, OmitType } from "../type"
import { genPath, Path, Path_Path, assetPath } from "../path"

export class Shape extends Element implements D_SHAPE {
  public ATTRIBUTE_NAMES: (keyof D_SHAPE)[] = ["d_path"]
  public readonly type = "shape"

  // FIXME: 删除 d_path
  d_path!: D_PATH

  path?: Path

  constructor() {
    super()
    this.ATTRIBUTE_NAMES.push(...Element.ELEMENT_ATTRIBUTES)
  }

  public render(ctx: CanvasRenderingContext2D, param?: RenderParam): void {
    if (!this.path) return
    this.renderParam = param
    ctx.save()
    this.renderBefore(ctx)
    this.renderFillStroke(ctx)
    this.renderAfter(ctx)
    ctx.restore()
  }

  public renderBefore(ctx: CanvasRenderingContext2D): void {
    const { origin } = this
    if (!this.path) return
    super.renderBefore(ctx)
    this.path.takeEffect(ctx, {
      origin
    })
  }

  public countElementBox(ctx: CanvasRenderingContext2D): void {
    if (!this.path) return
    this.elementBox = this.path.pathBox
  }

  public updateElementBox(box: Partial<Box>): void {
    if (!this.path) return
    const { origin } = this
    this.path.updatePathBox(box, { origin })
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

  static assertJsonTrue(json?: OmitType<D_SHAPE>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { d_path } = json
    assetPath(d_path)
  }

  fromJSON(json: OmitType<D_SHAPE>): void {
    super.fromJSON(json)
    const { d_path } = json
    if (d_path) {
      if (!this.path) {
        this.path = genPath(d_path)
      } else {
        this.path.fromJSON(d_path)
      }
    }
  }
}
