import { Attribute } from "./_attr"
import { Origin } from "./origin"

import { D_ELEMENT_BASE, D_CLIP, D_PATH, OmitType } from "../type"
import { genPath, Path, Path_Path } from "../path"

interface ClipParam {
  origin: Origin
  fillRule?: CanvasFillRule
}

export class Clip extends Attribute implements D_CLIP {
  public type: string = "attr_clip"

  public ATTRIBUTE_NAMES: (keyof D_CLIP)[] = ["d_path"]

  path!: Path

  d_path!: D_PATH

  takeEffect(ctx: CanvasRenderingContext2D, clipParam: ClipParam): void {
    const { origin, fillRule } = clipParam
    this.path.genPath(ctx, { origin })
    const { path } = this
    if (path instanceof Path_Path) {
      const path2d = new Path2D(path.path)
      if (fillRule === "evenodd") {
        ctx.clip(path2d, fillRule)
      } else {
        ctx.clip(path2d)
      }
    } else {
      if (fillRule === "evenodd") {
        ctx.clip(fillRule)
      } else {
        ctx.clip()
      }
    }
  }

  fromJSON(json: OmitType<D_CLIP>, parent?: D_ELEMENT_BASE): void {
    super.fromJSON(json)
    const { d_path } = json
    this.path = genPath(d_path)
  }
}
