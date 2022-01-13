import React, { useEffect, useRef } from "react"
import { onImageLoad, toImageData, imageData2Url, qrImageTransparent } from "@canvas-2d/shared"

import logoPng from "../../public/images/logo.png"
import qrPng from "../../public/images/qr.png"

export function CanvasTransparent() {
  const canvasRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    onImageLoad(logoPng, (logo) => {
      onImageLoad(qrPng, async (qr) => {
        const qrImgData = toImageData(qr as HTMLImageElement)
        const logoData = toImageData(logo as HTMLImageElement)
        qrImageTransparent(logoData, qrImgData, 60, 60, 0.5)

        const imgUrl = await imageData2Url(qrImgData)
        canvasRef.current!.src = imgUrl
      })
    })
  }, [])

  return (
    <img
      ref={canvasRef}
      style={{
        width: "600px",
        height: "600px",
        border: "1px solid red"
      }}
    />
  )
}
