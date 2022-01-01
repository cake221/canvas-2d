import { onImageLoad } from "./utils"

export function toImageData(img: HTMLImageElement) {
  const canvas = document.createElement("canvas")
  canvas.height = img.height
  canvas.width = img.width
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

export async function imageData2Ele(imageData: ImageData) {
  const canvas = document.createElement("canvas")
  canvas.height = imageData.height
  canvas.width = imageData.width
  const ctx = canvas.getContext("2d")!
  ctx.putImageData(imageData, 0, 0)
  return new Promise((resolve) => {
    onImageLoad(canvas.toDataURL(), (img) => {
      resolve(img)
    })
  })
}

export async function imageData2Url(imageData: ImageData) {
  const canvas = document.createElement("canvas")
  canvas.height = imageData.height
  canvas.width = imageData.width
  const ctx = canvas.getContext("2d")!
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

// 也可以使用 全局透明度
export function imageTransparent(imageData: ImageData | HTMLImageElement, opacity: number = 0.2) {
  if (imageData instanceof HTMLImageElement) {
    imageData = toImageData(imageData)
  }
  const data = imageData.data
  data.forEach((v, i) => (i + 1) % 4 === 0 && (data[i] = v * opacity))
  return imageData
}

export function qrImageTransparent(
  logo: ImageData | HTMLImageElement,
  qr: ImageData,
  x: number,
  y: number,
  opacity: number = 0.2
) {
  if (logo instanceof HTMLImageElement) {
    logo = toImageData(logo)
  }
  const data = qr.data
  const iData = logo.data
  for (let i = 0; i < logo.width; i++) {
    for (let j = 0; j < logo.height; j++) {
      // 绘制第 (i, j) 个点
      const [qr_i, qr_j] = [i + x, j + y]
      const d_index = (qr_j * qr.width + qr_i) * 4
      const i_index = (j * logo.width + i) * 4
      if (data[d_index] === 255) {
        // 白色
        applyOpacity(data, iData, d_index + 0, i_index + 0, opacity)
        applyOpacity(data, iData, d_index + 1, i_index + 1, opacity)
        applyOpacity(data, iData, d_index + 2, i_index + 2, opacity)
      }
    }
  }
  return logo
}

function applyOpacity(
  data: Uint8ClampedArray,
  iData: Uint8ClampedArray,
  d_index: number,
  i_index: number,
  opacity: number
) {
  data[d_index] = Math.floor(data[d_index] * (1 - opacity) + iData[i_index] * opacity)
  if (data[d_index] > 255) data[d_index] = 255
}
