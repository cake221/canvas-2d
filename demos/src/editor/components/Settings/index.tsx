import React, { useEffect, useRef } from "react"
import FormRender, { useForm } from "form-render"
import { Element, assetManage, assertElement } from "@canvas-2d/core/src"
import { cloneJson } from "@canvas-2d/shared"

import { settingSchema } from "./settingSchema"
import { fillSchemaValue } from "./fillSchemaValue"
import { parseSchemaValue } from "./parseSchemaValue"
import { ImageUpload, gradientInput } from "./widget"

interface SettingsProps {
  ele: Element
  update: () => void
  eleIsUpdate: boolean
}

export function Settings(props: SettingsProps) {
  const { ele, update, eleIsUpdate } = props
  const form = useForm()
  const formIsSetValueRef = useRef<boolean>(false)

  useEffect(() => {
    const formData = cloneJson(fillSchemaValue(ele))
    form.setValues(formData)
    formIsSetValueRef.current = true
  }, [eleIsUpdate])

  const onDataChange = (value: any) => {
    if (formIsSetValueRef.current) {
      formIsSetValueRef.current = false
      return
    }
    try {
      const eleData = parseSchemaValue(value, ele)
      assertElement(eleData)
      ele.fromJSON(eleData)
      assetManage.loadAllAsset().then(() => {
        update()
      })
    } catch (error) {
      console.log("catch", error)
    }
  }

  return (
    <FormRender
      form={form}
      schema={settingSchema}
      widgets={{
        imageUpload: ImageUpload,
        gradientInput
      }}
      watch={{
        "#": {
          immediate: false,
          handler: (v) => onDataChange(v)
        }
      }}
    />
  )
}
