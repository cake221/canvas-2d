# canvas-2d

- canvas-common: 公共的库
- core: 核心库
- canvas-json: 通过 JSON 数据加载
- canvas-input: 文本输入

### bug

1. 文本输入：Canvas.TextMetrics 不能准确计算出文本的相关尺寸。该项目中，文本的 background 和 border，文本输入的光标选区是根据 Canvas.TextMetrics 做的计算，某些情况下，是不准确的。但是由于时间成本，暂时不做替换。
2. 元素变化：在角度存在的情况下，旋转点拖拽有问题

### todo

- 在坐标系变换的情况下，文本输入
- 思维导图
- 画板
