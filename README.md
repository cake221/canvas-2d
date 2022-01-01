# canvas-2d

- canvas-common: 公共的库
- core: 核心库
- canvas-json: 通过 JSON 数据加载
- canvas-input: 文本输入

### bug

Canvas.TextMetrics 不能准确计算出文本的相关尺寸。该项目中，文本的 background 和 border，文本输入的光标选区是根据 Canvas.TextMetrics 做的计算，某些情况下，是不准确的。但是由于时间成本，暂时不做替换。

### todo

- 选框
- 拖拽
- 思维导图
- 画板
