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

export function parseJsonData(obj: any, json: any, attrs?: any[], deep = false) {
  if (!json) return
  for (const [k, v] of Object.entries(json)) {
    if (v !== undefined && (!attrs || attrs.includes(k))) {
      if (!deep && typeof v === "object") continue
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

export function throttleByRAF(fun: Function) {
  let flag = false
  return function(...args: any) {
    if (flag) return
    requestAnimationFrame(() => {
      flag = false
      fun(...args)
    })
    flag = true
  }
}

export function throttleBySTO(fun: Function, delay: number = 0) {
  let flag = false
  return function(...args: any) {
    if (flag) return
    setTimeout(() => {
      flag = false
      fun(...args)
    }, delay)
    flag = true
  }
}

export function debounceByRAF(fun: Function) {
  let timer: number
  return function(...args: any) {
    if (timer) {
      cancelAnimationFrame(timer)
    }
    timer = requestAnimationFrame(() => fun(args))
  }
}

export function debounceBySTO(fun: Function, delay: number = 0) {
  let timer: NodeJS.Timeout
  return function(...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => fun(args), delay)
  }
}
