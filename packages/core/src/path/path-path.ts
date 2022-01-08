import { Frame } from "@canvas-2d/shared"

import { D_PATH_PATH } from "../type"
import { Path } from "./_path"

export class Path_Path extends Path implements D_PATH_PATH {
  /**
   * Type of an object
   */
  public readonly type = "path"

  ATTRIBUTE_NAMES: (keyof D_PATH_PATH)[] = ["path"]

  path!: string

  genPath(ctx: CanvasRenderingContext2D): void {
    // TODO: path 应用 origin
    // TODO: 计算 path_Frame
  }
}
