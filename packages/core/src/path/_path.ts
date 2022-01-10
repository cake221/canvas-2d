import { Frame } from "../frame"
import { Attribute, Origin } from "../attr"
import { D_PATH } from "../type"

export interface PathParam {
  origin: Origin
}

export abstract class Path extends Attribute {
  public abstract type: D_PATH["type"]
  abstract genPath(ctx: CanvasRenderingContext2D, pathParam: PathParam): void
  public path_Frame = new Frame()

  static ELEMENT_ATTRIBUTES: (keyof D_PATH)[] = []

  takeEffect(ctx: CanvasRenderingContext2D, pathParam: PathParam): void {
    this.genPath(ctx, pathParam)
  }
}
