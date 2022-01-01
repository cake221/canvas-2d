import { parseJsonData, toJsonData } from "./type"

export abstract class Base {
  public abstract readonly type: string
  public abstract ATTRIBUTE_NAMES: any[]

  public fromJSON(json: any) {
    parseJsonData(this.ATTRIBUTE_NAMES, this, json)
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
