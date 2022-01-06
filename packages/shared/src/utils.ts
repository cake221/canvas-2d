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
