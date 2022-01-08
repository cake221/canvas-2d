import React, { useCallback, useState } from "react"
import { Menu } from "antd"
import CanvasJson, { JsonTypes } from "./canvas-json"
import CanvasInput from "./canvas-input"
import CanvasShared from "./canvas-shared"
import CanvasTransform from "./canvas-transform"

const { SubMenu } = Menu

export default function App() {
  const [module, setModule] = useState("canvas-transform")
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
      case "canvas-common":
        return <CanvasShared />
      case "canvas-transform":
        return <CanvasTransform />
      default:
        return <div />
    }
  }

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
        <Menu.Item key="canvas-transform">元素变换</Menu.Item>
        <Menu.Item key="canvas-input">文本输入</Menu.Item>
        <SubMenu key="canvas-common" title="公共方法">
          <Menu.Item key="canvas-common:transparent">透明度</Menu.Item>
        </SubMenu>
      </Menu>
      <div
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {renderModule()}
      </div>
    </div>
  )
}
