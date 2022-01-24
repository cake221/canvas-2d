import React, { useCallback, useEffect, useRef, useState, useReducer } from "react"
import { Element } from "@canvas-2d/core/src"
import { JSON_DATA } from "@canvas-2d/canvas-json"

import "./index.less"

import { CanvasEditor, EleActiveCallback } from "./components/Canvas"
import { Settings } from "./components/Settings"
import { Sidebar } from "./components/Sidebar"

interface ReactProps {
  data: JSON_DATA
}

export function Editor(props: ReactProps) {
  const { data } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<CanvasEditor | null>(null)
  const eleRef = useRef<Element | null>(null)
  const [eleIsUpdate, eleUpdate] = useState<boolean>(true)
  const eleChange = useCallback<EleActiveCallback>(
    (ele) => {
      if (ele !== undefined) {
        eleRef.current = ele
      }
      eleUpdate((bool) => !bool)
    },
    [eleIsUpdate]
  )

  const update = useCallback(() => {
    editorRef.current?.update()
  }, [])

  useEffect(() => {
    editorRef.current = new CanvasEditor({
      container: containerRef.current!,
      ...data,
      eleChange
    })
    editorRef.current.loadAssets().then(() => {
      update()
    })
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
          <Settings ele={eleRef.current} update={update} eleIsUpdate={eleIsUpdate} />
        )}
      </div>
    </div>
  )
}

export * from "@canvas-2d/canvas-json"
