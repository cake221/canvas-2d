import React, { useCallback, useState } from "react"
import { Menu } from "antd"
import CanvasJson, { JsonTypes } from "./canvas-json"
import CanvasInput from "./canvas-input"
import CanvasShared, { CommonTypes } from "./canvas-shared"
import CanvasTransform from "./canvas-transform"
import CanvasEditor from "./canvas-editor"

const { SubMenu } = Menu

export default function App() {
  const [module, setModule] = useState("canvas-editor")
  const [subModule, setSubModule] = useState("")

  const handleClick = useCallback((e) => {
    const keys = e.key.split(":")
    setModule(keys[0])
    setSubModule(keys[1])
  }, [])

  const renderModule = () => {
    switch (module) {
      case "canvas-json":
        return <CanvasJson subModule={subModule as JsonTypes} />
      case "canvas-input":
        return <CanvasInput />
      case "canvas-shared":
        return <CanvasShared subModule={subModule as CommonTypes} />
      case "canvas-transform":
        return <CanvasTransform />
      case "canvas-editor":
        return <CanvasEditor />
      default:
        return <div />
    }
  }

  return (
    <div
      style={{
        background: "antiquewhite",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Menu onClick={handleClick} selectedKeys={[module]} mode="horizontal">
        <SubMenu key="canvas-json" title="加载JSON">
          <Menu.Item key="canvas-json:text">文本</Menu.Item>
          <Menu.Item key="canvas-json:shape">图形</Menu.Item>
          <Menu.Item key="canvas-json:image">图像</Menu.Item>
          <Menu.Item key="canvas-json:clip">裁剪</Menu.Item>
          <Menu.Item key="canvas-json:gradient-pattern">渐变模型</Menu.Item>
        </SubMenu>
        <Menu.Item key="canvas-transform">元素变换</Menu.Item>
        <Menu.Item key="canvas-input">文本输入</Menu.Item>
        <SubMenu key="canvas-shared" title="公共方法">
          <Menu.Item key="canvas-shared:transparent">透明度</Menu.Item>
          <Menu.Item key="canvas-shared:point-transform">点变换</Menu.Item>
          <Menu.Item key="canvas-shared:box-transform">box 变换</Menu.Item>
        </SubMenu>
        <Menu.Item key="canvas-editor">编辑器</Menu.Item>
      </Menu>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%"
        }}
      >
        {renderModule()}
      </div>
    </div>
  )
}
