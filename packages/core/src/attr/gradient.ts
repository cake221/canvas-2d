import { assertJsonType, invariant } from "@canvas-2d/shared"
import { Attribute } from "./_attr"
import { D_GRADIENT, OmitType } from "../type"

export class Gradient extends Attribute implements D_GRADIENT {
  public type: D_GRADIENT["type"] = "attr_gradient"
  public ATTRIBUTE_NAMES: (keyof D_GRADIENT)[] = ["gradientShape", "gradientColors"]

  gradientColors: D_GRADIENT["gradientColors"] = []
  gradientShape: D_GRADIENT["gradientShape"] = [0, 0, 0, 0]

  genGradient(ctx: CanvasRenderingContext2D) {
    const { gradientShape, gradientColors } = this
    let gradient!: CanvasGradient
    if (gradientShape.length === 4) {
      gradient = ctx.createLinearGradient(...gradientShape)
    } else {
      gradient = ctx.createRadialGradient(...gradientShape)
    }
    for (const colorStop of gradientColors) {
      gradient.addColorStop(...colorStop)
    }
    return gradient
  }

  static isGradient(obj: any): obj is Gradient {
    return obj.type === "attr_gradient"
  }

  static isGradientData(obj: any): obj is D_GRADIENT {
    return obj.type === "attr_gradient"
  }

  static assertJsonTrue(json?: OmitType<D_GRADIENT>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { gradientShape, gradientColors } = json
    assertJsonType(gradientShape, "array")
    gradientShape &&
      invariant(
        gradientShape.length === 4 || gradientShape.length === 6,
        "gradientShape 数组不符合规范"
      )
    assertJsonType(gradientColors, "array")
  }

  fromJSON(json: OmitType<D_GRADIENT>): void {
    super.fromJSON(json)
    const { gradientColors, gradientShape } = json
    gradientColors && (this.gradientColors = gradientColors)
    gradientShape && (this.gradientShape = gradientShape)
  }
}
