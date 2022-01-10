import { D_ATTR_BASE } from "../type"
import { Base } from "../base"

export abstract class Attribute extends Base implements D_ATTR_BASE {
  takeEffect(ctx: CanvasRenderingContext2D, ...other: any) {
    const ctxAttr = this.ATTRIBUTE_NAMES
    for (const key of ctxAttr) {
      // @ts-ignore
      const value = this[key]
      if (value !== undefined && key in ctx) {
        // @ts-ignore
        ctx[key] = value
      }
    }
  }
}
