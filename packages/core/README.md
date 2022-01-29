# static-canvas-2d

### 主要类的继承关系

`static-canvas-2d` 是一个静态的 Canvas2D 库。通过加载数据，渲染出一个 canvas 图，下面是主要类的继承关系。

![主要类的继承图](/doc/images/2021-12-19-19-54-55.png)

数据的加载通过 Base 类实现。Base 提供了 `fromJson` 和 `static createObj` 加载数据，生成一个实例；提供了 `toJson` 将实例生成数据；加载数据和生成数据都依赖于 `ATTRIBUTE_NAMES` 属性，提供了加载数据和生成数据的属性。数据有三种类型，分别是`Element`、`Attr`和`Asset`。

`Element`用于 Canvas 渲染。内部的`render`函数用于渲染具体的元素。针对 Canvas2D 的特点，`Element` 通过 `fill`、`stroke`、`fillRule`和`strokeParam`来设计填充和描边的相关属性；通过`origin`设置渲染的起始位置；通过`shadow`来设置阴影；通过`transform`来设置元素的变换；通过`filter`设置过滤效果；通过`clip`设置裁剪。`Element`衍生出了`Shape`、`Image`、`Text`三种类型，用于渲染具体的图形、图像和文本。`Shape`的 `path` 用于提供相应的图形路径；`Text`的`Font`用于设置 font 属性；`Image`的`assetImage`用于设置需要渲染的图形。

`Attr`是渲染会用到的相关属性。内部的`takeEffect`方法用于将该属性生效。`Attr`衍生出了很多属性，包括了 `Transform`、`Origin`、`Font`、`Gradient`、`Shadow`、`strokeParam`、`Clip`和`Pattern`。`Path` 是一个特殊的属性，内部的`genPath`用于生成具体的路径。`Path`衍生出了`Rect`、`ellipse`、`arc`生成长方形、椭圆和圆；衍生出了`path-path`生成更为一般的路径，可以通过 svg 路径属性的设置方法来设置该属性。

`Asset`是渲染时需要的资源。内部的`load`方法用于加载资源，资源通过`data`来标记。`Asset`衍生出了`AssetImage`来加载图片资源。

### 功能

- element
  - 文本: 单行文本
  - 图形: 矩形、椭圆、圆、任意路径
  - 图像
- fill 和 stroke 样式
  - 渐变 gradient
  - 图案 pattern
- element 源点
- 文本字体 font 设置
- dpr
- 过滤 filter
- 阴影 shadow
- 合成 composite
- 剪切 clip: 矩形、椭圆、圆、任意路径
- 变换 transform

### todo

1. 将 imageData 相关方法提取到 canvas-util 中
2. 剪切属性全局生效
3. path-path 支持 origin 属性
4. 加载字体文件
5. 文本: 多行文本、单行文本的属性设计
6. element 添加一个 UserParams 参数，在 toJson 中使用，减少用户导出的数据；
7. 将环境设置和渲染分离

### 设计点

1. 给元素的属性提供默认值: 上一个元素的设置值会污染之后的渲染。
2. 减少用户导出的数据 => element 添加一个 UserParams 参数，在 toJson 中使用
3. 将环境设置和渲染分离: 某些时候，需要在设置环境后，做一些操作
