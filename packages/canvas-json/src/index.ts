import { CanvasBase, cloneJson } from "@canvas-2d/shared"
import { D_ASSET, D_ELEMENT, Element, genElement, genAsset, IAsset } from "@canvas-2d/core"

export type JSON_DATA = {
  assets?: D_ASSET[]
  layers?: D_ELEMENT[]
  width?: number
  height?: number
  dpr?: number
  canvas?: HTMLCanvasElement
}

export class CanvasJSON extends CanvasBase {
  assetsData: D_ASSET[] = []

  layersData: D_ELEMENT[] = []

  public elements: Element[] = []

  constructor(public json: JSON_DATA) {
    super(json)
    const { assets, layers } = json
    if (!this.ctx) {
      throw new Error("绘制有问题")
    }
    assets && (this.assetsData = assets)
    layers && (this.layersData = layers)
  }

  disappearElement(ele: Element) {
    ele.disappear()
    this.render()
  }

  appearElement(ele: Element) {
    ele.appear()
    this.render()
  }

  render() {
    const { ctx, elements, dpr } = this
    ctx.clearRect(0, 0, this.width, this.height)
    if (dpr > 0 && dpr !== 1) this.setDpr()
    for (const ele of elements) {
      if (!ele.visible) continue
      ctx.save()
      ele.render(ctx)
      ctx.restore()
    }
  }

  async loadAssets() {
    const { assetsData } = this
    return Promise.allSettled(assetsData.map(genAsset))
  }

  async loadElements() {
    const { layersData } = this
    for (const layer of layersData) {
      const ele = genElement(layer)
      if ("load" in ele) {
        await ((ele as unknown) as IAsset).load()
      }
      this.elements.push(ele)
    }
  }

  genData(): JSON_DATA {
    const { elements, assetsData, width, height, dpr } = this
    const layers = elements.map((ele) => ele.toJSON() as D_ELEMENT)

    return {
      width,
      height,
      layers,
      assets: assetsData,
      dpr: dpr ? dpr : 1
    }
  }
}

export async function loadJson(json: JSON_DATA) {
  const staticCanvas2D = new CanvasJSON(cloneJson(json))
  await staticCanvas2D.loadAssets()
  await staticCanvas2D.loadElements()
  staticCanvas2D.render()
  return staticCanvas2D
}
