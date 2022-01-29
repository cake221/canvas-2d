import { CanvasBase, cloneJson } from "@canvas-2d/shared"
import { D_ELEMENT, Element, genElement, assetManage } from "@canvas-2d/core"

export type JSON_DATA = {
  layers?: D_ELEMENT[]
  width?: number
  height?: number
  dpr?: number
  canvas?: HTMLCanvasElement
}

export class CanvasJSON extends CanvasBase {
  layersData: D_ELEMENT[] = []

  public elements: Element[] = []

  constructor(public json: JSON_DATA) {
    super(json)
    const { layers, dpr } = json
    if (!this.ctx) {
      throw new Error("绘制有问题")
    }
    layers && (this.layersData = layers)

    dpr && (this.dpr = dpr)

    this.setJsonCanvas()
    this.loadElements()
  }

  /**
   * devicePixelRatio 设备像素 / css 像素
   */
  dpr = 1

  setDpr() {
    const { dpr, ctx } = this
    ctx.setTransform(1, 0, 0, 1, 0, 0) // scale 前先恢复变换矩阵，不然会重复 scale
    ctx.scale(dpr, dpr)
  }

  get widthDpr() {
    return this.width * this.dpr
  }

  get heightDpr() {
    return this.height * this.dpr
  }

  setJsonCanvas() {
    const { canvas, width, height } = this

    canvas.width = this.widthDpr
    canvas.height = this.heightDpr

    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
  }

  disappearElement(ele: Element) {
    ele.disappear()
    this.render()
  }

  appearElement(ele: Element) {
    ele.appear()
    this.render()
  }

  clear() {
    const { ctx } = this
    ctx.clearRect(0, 0, this.widthDpr, this.heightDpr)
  }

  render() {
    const { ctx, elements, dpr } = this
    this.clear()
    ctx.save()
    if (dpr > 0 && dpr !== 1) this.setDpr()
    for (const ele of elements) {
      if (!ele.visible) continue
      ctx.save()
      ele.render(ctx)
      ctx.restore()
    }
    ctx.restore()
  }

  async loadAssets() {
    return assetManage.loadAllAsset()
  }

  loadElements() {
    const { layersData } = this
    for (const layer of layersData) {
      const ele = genElement(layer)
      this.elements.push(ele)
    }
  }

  genData(): JSON_DATA {
    const { elements, width, height, dpr } = this
    const layers = elements.map((ele) => ele.toJSON() as D_ELEMENT)

    return {
      width,
      height,
      layers,
      dpr: dpr ? dpr : 1
    }
  }
}

export async function loadJson(json: JSON_DATA) {
  const staticCanvas2D = new CanvasJSON(cloneJson(json))
  await staticCanvas2D.loadAssets()
  staticCanvas2D.render()
  return staticCanvas2D
}
