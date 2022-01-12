export function invariant(condition: any, message?: string): asserts condition {
  if (condition) {
    return
  }

  throw new Error("Invariant failed: " + (message || ""))
}

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x)
}

export function onImageLoad(
  imageData: string,
  onload: (value: HTMLImageElement | PromiseLike<HTMLImageElement>) => void,
  onerror: OnErrorEventHandler = () => {},
  width = 0,
  height = 0
) {
  const img = new Image()
  img.setAttribute("crossOrigin", "Anonymous")
  width && (img.width = width)
  height && (img.height = height)
  if (!imageData) {
    onload(img)
    return
  }
  img.src = imageData
  img.onload = () => onload(img)
  img.onerror = onerror
}

export function cloneJson(json: any) {
  try {
    return JSON.parse(JSON.stringify(json))
  } catch {
    console.error(json, "不是一个JSON数据")
    return {}
  }
}

export function parseJsonData(obj: any, json: any, attrs?: any[]) {
  if (!json) return
  for (const [k, v] of Object.entries(json)) {
    if (!attrs || attrs.includes(k)) {
      obj[k] = v
    }
  }
}

export function toJsonData(obj: any, attrs: string[]): any {
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
