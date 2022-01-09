import { Point } from "@canvas-2d/shared"

export class Frame {
  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}

  // 边框的四个点的坐标: 左上、右上、右下、左下
  framePoints(): [Point, Point, Point, Point] {
    const { x, y, width, height } = this
    return [
      new Point(x, y),
      new Point(x + width, y),
      new Point(x + width, y + height),
      new Point(x, y + height)
    ]
  }
}
