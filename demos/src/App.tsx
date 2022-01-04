import React, { useCallback, useState } from "react"
import { Menu } from "antd"
import CanvasJson, { JsonTypes } from "./canvas-json"
import CanvasInput from "./canvas-input"

const { SubMenu } = Menu

function renderModule() {}

export default function App() {
  const [module, setModule] = useState("canvas-input")
  const [subModule, setSubModule] = useState("")

  const handleClick = useCallback((e) => {
    const keys = e.key.split(":")
    setModule(keys[0])
    setSubModule(keys[1])
  }, [])

  return (
    <div style={{ background: "antiquewhite", height: "100vh" }}>
      <Menu onClick={handleClick} selectedKeys={[module]} mode="horizontal">
        <SubMenu key="canvas-json" title="加载JSON">
          <Menu.Item key="canvas-json:text">文本</Menu.Item>
          <Menu.Item key="canvas-json:shape">图形</Menu.Item>
          <Menu.Item key="canvas-json:image">图像</Menu.Item>
          <Menu.Item key="canvas-json:clip">裁剪</Menu.Item>
          <Menu.Item key="canvas-json:gradient-pattern">渐变模型</Menu.Item>
        </SubMenu>
        <Menu.Item key="canvas-input">文本输入</Menu.Item>
      </Menu>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        {module === "canvas-json" ? (
          <CanvasJson subModule={subModule as JsonTypes} />
        ) : (
          <CanvasInput />
        )}
      </div>
    </div>
  )
}
