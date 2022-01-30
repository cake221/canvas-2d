import React, { useCallback, useEffect, useRef, useState } from "react"
import { Element } from "@canvas-2d/core/src"
import { JSON_DATA } from "@canvas-2d/canvas-json"
import { throttleBySTO } from "@canvas-2d/shared"

import "./index.less"

import { EditorCanvas, EleActiveCallback } from "./components/Canvas"
import { Settings } from "./components/Settings"
import { Sidebar } from "./components/Sidebar"

interface ReactProps {
  data: JSON_DATA
}

export function Editor(props: ReactProps) {
  const { data } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<EditorCanvas | null>(null)
  const settingsRef = useRef(null)
  const eleRef = useRef<Element | null>(null)
  const canvasIsUpdateRef = useRef<boolean>(false)
  const [_, eleUpdate] = useState<boolean>(true)

  const settingUpdate = useCallback(
    throttleBySTO(() => {
      // @ts-ignore
      settingsRef.current?.settingUpdate()
      eleUpdate((bool) => !bool)
    }, 300),
    []
  )

  const canvasUpdate = useCallback(() => {
    canvasRef.current!.loadAssets().then(() => {
      canvasIsUpdateRef.current = true
      canvasRef.current?.update()
    })
  }, [])

  const onCanvasChange: EleActiveCallback = (ele) => {
    if (canvasIsUpdateRef.current) {
      // 防止 canvas/setting 循环渲染
      canvasIsUpdateRef.current = false
      return
    }
    if (ele !== undefined) {
      eleRef.current = ele
    }
    settingUpdate()
  }

  useEffect(() => {
    canvasRef.current = new EditorCanvas({
      container: containerRef.current!,
      ...data,
      eleChange: onCanvasChange
    })
    canvasUpdate()
  }, [])

  return (
    <div className="canvas-editor-container">
      <Sidebar />
      <div className="canvas">
        <div
          ref={containerRef}
          style={{
            border: "1px solid red"
          }}
        />
      </div>

      <div className="settings">
        {eleRef.current && (
          <Settings ref={settingsRef} ele={eleRef.current} update={canvasUpdate} />
        )}
      </div>
    </div>
  )
}

export * from "@canvas-2d/canvas-json"
