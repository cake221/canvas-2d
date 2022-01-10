import { CanvasBase, CanvasBaseParam } from "./canvas-base"

export interface CanvasCoordParam extends CanvasBaseParam {
  coordInterval?: number
  backgroundColor?: string
}

export class CanvasBackGround extends CanvasBase {
  constructor(params: CanvasCoordParam) {
    super(params)
    const { coordInterval, backgroundColor } = params

    backgroundColor && this.renderBackground(backgroundColor)
    coordInterval && this.renderCoord(coordInterval)
  }

  renderBackground(fill: string) {
    this.setBackground(fill)
  }

  renderCoord(interval: number, fill = "grey") {
    const { width, height } = this
    for (let i = interval; i < width; i += interval) {
      for (let j = interval; j < height; j += interval) {
        if (i === interval) {
          this.ctx.fillText(j + "", i - 10, j)
        }
        if (j === interval) {
          this.ctx.fillText(i + "", i, j - 10)
        }
        this.drawPoint(i, j, fill)
      }
    }
  }
}
