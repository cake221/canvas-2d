import { Frame } from "../frame"
import { Attribute, Origin } from "../attr"
import { D_PATH } from "../type"

export abstract class Path extends Attribute {
  public abstract type: D_PATH["type"]
  abstract genPath(ctx: CanvasRenderingContext2D): void
  public path_Frame = new Frame()

  static ELEMENT_ATTRIBUTES: (keyof D_PATH)[] = ["origin"]

  origin: Origin = new Origin()

  takeEffect(ctx: CanvasRenderingContext2D): void {
    this.genPath(ctx)
  }

  public fromJSON(json: D_PATH): void {
    super.fromJSON(json)
    this.origin = Origin.createObj(Origin, json.origin!)
  }
}
