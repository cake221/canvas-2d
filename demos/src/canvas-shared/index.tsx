import React from "react"
import { assertNever } from "@canvas-2d/shared"

import { CanvasPointTrans } from "./point-transform"
import { CanvasTransparent } from "./transparent"
import { BoxTransform } from "./box-transform"

export type CommonTypes = "transparent" | "point-transform" | "box-transform"

interface CanvasSharedProps {
  subModule: CommonTypes
}

export default function CanvasShared(props: CanvasSharedProps) {
  const { subModule } = props
  switch (subModule) {
    case "transparent":
      return <CanvasTransparent />
    case "point-transform":
      return <CanvasPointTrans />
    case "box-transform":
      return <BoxTransform />
    default:
      assertNever(subModule)
  }
}
