import { TextBox } from "@canvas-2d/shared"
import { Shape, D_SHAPE, D_PATH_RECTANGLE } from "@canvas-2d/core"

export class Selection {
  active = false

  renderSelection(ctx: CanvasRenderingContext2D, Rects: D_PATH_RECTANGLE[]) {
    if (!this.active) return
    for (let i = 0; i < Rects.length; i++) {
      Shape.createObj(Shape, {
        type: "shape",
        d_path: Rects[i],
        fill: "rgba(162, 211, 255, 0.5)"
      } as D_SHAPE).render(ctx)
    }
  }

  showSelection(
    ctx: CanvasRenderingContext2D,
    textCharBox: TextBox[][],
    startBoxIndex: number,
    endBoxIndex: number
  ) {
    let count = 0
    let isRender = false
    const rects: D_PATH_RECTANGLE[] = []
    for (let i = 0; i < textCharBox.length; i++) {
      if (endBoxIndex === count) {
        // 拉到最后一行
        this.renderSelection(ctx, rects)
        return
      }
      const line = textCharBox[i]
      let startBox = textCharBox[i]?.[0]
      let width = 0
      for (let j = 0; j < line.length; j++) {
        if (startBoxIndex === count) {
          isRender = true
          startBox = textCharBox[i]?.[j]
          width = 0
        }
        count++
        width += textCharBox[i][j].boxWidth
        if (endBoxIndex === count) {
          rects.push({
            type: "rect",
            x: startBox.boxX,
            y: startBox.boxY,
            width,
            height: startBox.boxHeight
          })
          this.renderSelection(ctx, rects)
          return
        }
      }
      if (isRender) {
        rects.push({
          type: "rect",
          x: startBox.boxX,
          y: startBox.boxY,
          width,
          height: startBox.boxHeight
        })
      }
    }
  }
}
