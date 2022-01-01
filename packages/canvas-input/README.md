# 文本编辑

caret 与 cursor 都指光标，但是表示的内容不同。

- caret 指的是那个一闪一闪提示用户输入的小图标，它的位置相对固定的，作用是提示用户当前文档的输入位置；
- cursor 指的是鼠标的图标，跟着一直随着鼠标一起移动，它的作用是提示当前文档的模式，是只读还是可编辑。通常会把 cursor 设置成 “工” 的图形。

### caret 光标相关数据的计算

```ts
export interface CaretCoord {
  caretRow: number
  caretColumn: number
}

export interface CaretData {
  coord: CaretCoord
  position: Point
  index: number
}
```

为了实现文本编辑的功能，我们将 光标数据抽象成 `CaretData` 结构。在该数据中，包含了三个相关信息， `coord` 表示光标的坐标， `position` 表示光标的渲染位置， `index` 表示光标的索引。接下来，讲述一下如果计算光标的相关数据。

![光标与字符的关系](/doc/images/2021-12-29-11-25-33.png)

光标的坐标(`coord`)。上图是文本与 光标 的坐标关系图。文本包括了三行，第一行是`0123`，第二行是`56`，第三行是 `89`。除了尾行，每一行的末尾都是一个 换行符(`\n`)，用于切换到下一行。黄色的坐标表示的是 光标 的坐标。

![光标的索引与字符字符索引的关系](/doc/images/2021-12-29-12-03-38.png)

光标的索引位置(`index`)。上图是光标的索引与字符字符索引的关系。通过观察可以发现，光标分布在每个字符间隔之中，除了最后一个光标，其它的第 `i` 个光标在第 `i` 个字符的左边。光标的总量是文本总量加一。

在计算光标的 `position`时。我们可以通过对应字符计算。除了最后一个光标，其他的第`i`个光标的位置都是第`i`个字符的右上角。最后一个`(2, 2)`光标的位置在最后一个字符 `9` 的左上角。除了这两种情况，还有一种尾行为空的情况，如下图所示，可以发现，没有相关字符与其相邻，所以需要用到上一行的数据计算相关位置，尾行为空的光标 `(1, 0)` 的位置是上一行的最后一个字符`a`的左下角。当首行既是尾行时，光标的位置是文本的起始点。

![尾行为空](/doc/images/2021-12-29-11-30-56.png)

在本项目中，提供了几个 util 用于 caret

- countCaretIndexByCoord: 通过光标坐标计算光标索引
- countCaretCoordByIndex: 通过光标索引计算光标坐标
- countCaretCoordByPoint: 通过点击事件的位置 point，计算光标坐标
- countCaretPositionByCoord: 通过光标坐标，计算光标渲染位置

### 技术方案

多行文本的实现

- 按照 `\n` 换行符，分割文本
- 一行一行的渲染相关的文本
- 自动换行: 在渲染过程中，如果该行的宽度超过了设定的宽度值，在该相应字符后插入 `\n`，重新渲染文本

caret 光标的实现

- caret 行为: 编辑状态时，光标的位置会发生变化；选区存在时，光标消失；其余状态，光标闪烁。
- caret 闪烁: 光标展示前，记录当前位置的图像快照；光标擦出后，将图像快照渲染到相应的位置
- caret 跟随: 记录光标后的字符数量，每次文本发生变化，都通过光标后的字符数量计算出光标的索引位置，从而渲染出对应的光标

selection 的实现

- 当鼠标拖动跨越两个字符时，出现选区
- 根据点击的第一个光标位置和最后一个光标位置，计算出对应的选区区域，做相应的选区渲染

textarea 代理

- textarea 代理文本输入，避免处理太多的输入逻辑
- 通过 caret 和 selection 的相关索引，更新 textarea 的 `selectionStart` 和 `selectionEnd`，从而实现 textarea 光标和选区的跟随。
- 在某些情况下，caret 的计算结果可能跟 textarea 的计算结果不一致。比如，向上向下的光标移动，textarea 按照文本的宽度计算相应的光标位置。但是，本项目在实现的时候，考虑到技术的复杂性，采用了文本的数量计算方案。出现这种情况时，重新修正 textarea 的光标位置，以达到 textarea 和 canvas-input 的行为一致。

### 参考

- [用 Canvas 实现文本编辑器（支持艺术字渲染与动画）](https://segmentfault.com/a/1190000008816574)
- [深入了解 CSS 字体度量，行高和 vertical-align](https://www.w3cplus.com/css/css-font-metrics-line-height-and-vertical-align.html)
- [字体设计](https://designwithfontforge.com/zh-CN/Introduction.html)
- [web 编辑器中的光标原理](https://zhuanlan.zhihu.com/p/407713779)
- [用 Canvas 实现文本编辑器（支持艺术字渲染与动画）](https://segmentfault.com/a/1190000008816574)

### 其他项目的技术方案实现

TODO

### todo

- canvas-common -> shared
- static-canvas-2d -> core

光标:

- clip
- fillRect + clear
