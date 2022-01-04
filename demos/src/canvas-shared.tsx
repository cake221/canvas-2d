import React, { useEffect, useRef } from "react"
import { onImageLoad, toImageData, imageData2Url, qrImageTransparent } from "@canvas-2d/shared"

import logoPng from "../static/images/logo.png"
import qrPng from "../static/images/qr.png"

export default function CanvasJson() {
  const canvasRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    onImageLoad(logoPng, (logo) => {
      onImageLoad(qrPng, async (qr) => {
        const qrImgData = toImageData(qr as HTMLImageElement)
        const logoData = toImageData(logo as HTMLImageElement)
        qrImageTransparent(logoData, qrImgData, 60, 60, 0.9)

        const imgUrl = await imageData2Url(qrImgData)
        canvasRef.current!.src = imgUrl
      })
    })
  }, [])

  return (
    <img
      ref={canvasRef}
      style={{
        width: "80vw",
        height: "80vw",
        border: "1px solid red"
      }}
    />
  )
}
