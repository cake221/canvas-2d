import { CanvasBase, CanvasBaseParam } from "@canvas-2d/shared"

interface CanvasTransformParam extends CanvasBaseParam {}

export class CanvasTransform extends CanvasBase {
  constructor(params: CanvasTransformParam) {
    super(params)
  }
}
