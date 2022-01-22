import { Attribute } from "./_attr"
import { Origin } from "./origin"

import { D_CLIP, D_PATH, OmitType } from "../type"
import { genPath, Path, Path_Path, assetPath } from "../path"

interface ClipParam {
  origin: Origin
  fillRule?: CanvasFillRule
}

export class Clip extends Attribute implements D_CLIP {
  public type: string = "attr_clip"

  public ATTRIBUTE_NAMES: (keyof D_CLIP)[] = ["d_path"]

  path?: Path

  d_path!: D_PATH

  takeEffect(ctx: CanvasRenderingContext2D, clipParam: ClipParam): void {
    if (!this.path) return
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

  static assertJsonTrue(json?: OmitType<D_CLIP>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { d_path } = json
    assetPath(d_path)
  }

  fromJSON(json: OmitType<D_CLIP>): void {
    super.fromJSON(json)
    const { d_path } = json

    if (d_path) {
      if (this.path === undefined) {
        this.path = genPath(d_path)
      } else {
        this.path.fromJSON(d_path)
      }
    }
  }
}
