# canvas-2d

- canvas-common: 公共的库
- core: 核心库
- canvas-json: 通过 JSON 数据加载
- canvas-input: 文本输入
- canvas-transform: 元素变换
- canvas-editor: 编辑器

### 功能总览

1. 文本/图形/图像 的渲染
2. 文本编辑

- 文本输入(借助 textarea 的输入功能)
- 光标：上下左右切换、光标定位、换行等
- 选区：滑动选中文本等

3. 元素变换

- 拖拽
- 改变大小
- 旋转

4. 编辑器单击元素变换，双击文本编辑
5. 编辑器配置

- 公共属性: origin（源点）/rotate（旋转）/shadow（阴影）/clip（剪切）
- stroke/fill: color/gradient（渐变）/pattern（模式）
- stoke: lineWidth（线宽）/lineDash（断点）等
- 元素独有属性：图像来源、文本字体。。。等等

6. dpr 适配

### bug

1. 文本输入：Canvas.TextMetrics 不能准确计算出文本的相关尺寸。该项目中，文本的 background 和 border，文本输入的光标选区是根据 Canvas.TextMetrics 做的计算，某些情况下，是不准确的。但是由于时间成本，暂时不做替换。
2. 元素变化：在角度存在的情况下，旋转点拖拽有问题

### todo

- 在坐标系变换的情况下，文本输入
- 思维导图
- 画板
