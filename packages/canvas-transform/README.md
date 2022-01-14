# `canvas-transform`

### transform matrix

transform: `ctx.transform(a: number, b: number, c: number, d: number, e: number, f: number):`

$$
  \begin{matrix}
   a & c & e \\
   b & d & f \\
   0 & 0 & 1
  \end{matrix}
$$

![](../../doc/images/2022-01-09-09-36-24.png)

平移: `translate(x: number, y: number)`

$$
  \begin{matrix}
   1 & 0 & x \\
   0 & 1 & y \\
   0 & 0 & 1
  \end{matrix}
$$

缩放: `scale(x: number, y: number)`

$$
  \begin{matrix}
   x & 0 & 0 \\
   0 & y & 0 \\
   0 & 0 & 1
  \end{matrix}
$$

旋转: `rotate(α: number);`

$$
  \begin{matrix}
   \cos α & -\sin α & 0 \\
   \sin α & \cos α & 0 \\
   0 & 0 & 1
  \end{matrix}
$$

斜切: `skew(x, y)`

$$
  \begin{matrix}
   1 & \tan α & 0 \\
   -\tan α & 1 & 0 \\
   0 & 0 & 1
  \end{matrix}
$$

### 大小的变化
