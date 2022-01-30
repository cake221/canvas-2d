# editor

行为

- 单击: canvasTransform
- 双击: canvasInput
- 未选中: canvasJson

功能

1. 统一事件系统
2. 共享点击事件：canvasInput 和 canvasTransform 同时起作用
3. dpr
4. 统一解析资源，初始时加载

## 架构

- 事件监听/更新
- canvas: onCanvasChange/canvasUpdate
- settings: onSettingChange/settingUpdate

settings -> canvas: onSettingChange -> canvasUpdate
canvas -> settings: onCanvasChange -> 节流 -> eleIsUpdate -> settingUpdate

防止循环渲染：

1. canvasUpdate !-> onCanvasChange
2. settingUpdate !-> onSettingChange
