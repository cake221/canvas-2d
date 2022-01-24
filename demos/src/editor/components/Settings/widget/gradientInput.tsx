import React, { useEffect, useState } from "react"
import { InputNumber, Space, Button, message } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
// @ts-ignore
import ColorPicker from "rc-color-picker"
import "rc-color-picker/assets/index.css"
import { GradientShape, ColorStop } from "@canvas-2d/core/src"

type GradientTypeArr = GradientShape | ColorStop[]
type GradientType = GradientTypeArr[0]

interface GradientInputProps {
  value: GradientTypeArr
  onChange: (gradientData: GradientTypeArr) => void
}

export function gradientInput(props: GradientInputProps) {
  const { value, onChange } = props
  // @ts-ignore formRender 内部
  const type: "gradientColors" | "gradientShape" = getLastItem(props.schema.$id.split("."))
  const [gradientData, setGradientData] = useState<GradientTypeArr>([])
  useEffect(() => {
    setGradientData(value)
  }, [value])

  function handleChange(newValue: GradientTypeArr) {
    setGradientData(newValue)
    if (type === "gradientShape") {
      if (newValue.length !== 4 && newValue.length !== 6) {
        message.warn("gradientShape 的长度必须是 4 或 6")
        return
      }
    }
    onChange(newValue)
  }

  function handleValueChange(num: number, index: number) {
    const value = Array.from(gradientData as Array<number>)
    value[index] = num
    handleChange(value as GradientTypeArr)
  }

  function handleColorValueChange(str: string, index: number, colorIndex: 0 | 1) {
    const value = Array.from(gradientData as Array<ColorStop>)
    // @ts-ignore
    value[index][colorIndex] = str
    handleChange(value as GradientTypeArr)
  }

  function handleDelete(index: number) {
    const value = Array.from(gradientData as Array<GradientType>)
    value.splice(index, 1)
    handleChange(value as GradientTypeArr)
  }

  function handleAdd() {
    const value = Array.from(gradientData as Array<GradientType>)
    value.push(type === "gradientShape" ? 1 : [0, "#000000"])
    handleChange(value as GradientTypeArr)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Space
        style={{
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {Array.isArray(gradientData) &&
          gradientData.map((v, i) => (
            <div key={i}>
              {type === "gradientShape" && (
                <>
                  <InputNumber
                    size="small"
                    min={0}
                    defaultValue={v as number}
                    style={{
                      width: 80
                    }}
                    onChange={(num: any) => handleValueChange(num, i)}
                  />
                  <DeleteOutlined onClick={() => handleDelete(i)} />
                </>
              )}
              {type === "gradientColors" && (
                <div
                  style={{
                    display: "flex"
                  }}
                >
                  <InputNumber
                    size="small"
                    defaultValue={(v as ColorStop)[0]}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={(num: any) => handleColorValueChange(num, i, 0)}
                  />
                  <ColorPicker
                    animation="slide-up"
                    color={(v as ColorStop)[1]}
                    onChange={({ color }: any) => handleColorValueChange(color, i, 1)}
                  />

                  <DeleteOutlined onClick={() => handleDelete(i)} />
                </div>
              )}
            </div>
          ))}
      </Space>
      <Button onClick={handleAdd}>增加一条</Button>
    </div>
  )
}

function getLastItem(arr: any[] = []) {
  return arr[arr.length - 1]
}
