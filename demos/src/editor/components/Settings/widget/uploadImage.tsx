import React, { useState } from "react"
import { Upload, message } from "antd"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

function getBase64(img: any, callback: any) {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result))
  reader.readAsDataURL(img)
}

interface Props {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload(props: Props) {
  const { value, onChange } = props
  const [loading, changeLoading] = useState(false)

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      changeLoading(true)
      return
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (value: string) => {
        changeLoading(false)
        onChange(value)
      })
    }
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!")
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!")
    }
    return isJpgOrPng && isLt2M
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {value ? <img src={value} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
    </Upload>
  )
}
