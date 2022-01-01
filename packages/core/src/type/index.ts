import { D_ELEMENT } from "./element.type"
import { D_ASSET } from "./asset.type"
import { D_ATTR } from "./attr.type"

export function parseJsonData(attrs: any[], obj: any, json?: D_) {
  if (!json) return
  for (const [k, v] of Object.entries(json)) {
    if (attrs.includes(k)) {
      obj[k] = v
    }
  }
}

export function toJsonData(obj: any, attrs: string[]): D_ {
  const json: any = {}
  for (const k of attrs) {
    const v = obj[k]
    if (v !== undefined) {
      json[k] = v
    }
  }
  json.type = obj.type
  return json
}

export type D_ = D_ATTR | D_ELEMENT | D_ASSET

export * from "./_type"
export * from "./attr.type"
export * from "./path.type"
export * from "./element.type"
export * from "./asset.type"
