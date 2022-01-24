import { parseJsonData, toJsonData } from "@canvas-2d/shared"

export abstract class Base {
  public abstract readonly type: string
  public abstract ATTRIBUTE_NAMES: any[]

  static assertJsonTrue(json?: any) {}

  public fromJSON(json: any) {
    parseJsonData(this, json, this.ATTRIBUTE_NAMES)
  }

  public toJSON() {
    return toJsonData(this, this.ATTRIBUTE_NAMES)
  }

  static createObj(Meta: typeof Base, json: Record<string, any>): any {
    // @ts-ignore
    const obj = new Meta()
    obj.fromJSON(json)
    return obj
  }
}
