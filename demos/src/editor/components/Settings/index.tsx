import React, { useRef, useImperativeHandle, forwardRef } from "react"
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
}

interface SettingsRef {
  settingUpdate: () => void
}
// (props: SettingsProps, ref: React.MutableRefObject<SettingsRef>) => {
export const Settings = forwardRef((props: SettingsProps, ref: any) => {
  const { ele, update } = props
  const form = useForm()
  const formIsSetValueRef = useRef<boolean>(false)

  useImperativeHandle(ref, () => ({
    settingUpdate: () => {
      const formData = cloneJson(fillSchemaValue(ele))
      form.setValues(formData)

      formIsSetValueRef.current = true
    }
  }))

  const onSettingChange = (value: any) => {
    if (formIsSetValueRef.current) {
      formIsSetValueRef.current = false
      return
    }
    try {
      const eleData = parseSchemaValue(value, ele)
      assertElement(eleData)
      ele.fromJSON(eleData)
      update()
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
          handler: (v) => onSettingChange(v)
        }
      }}
    />
  )
})
