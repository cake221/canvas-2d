import React, { useRef, useImperativeHandle, forwardRef } from "react"
import FormRender, { useForm } from "form-render"
import { Element, assertElement } from "@canvas-2d/core/src"
import { cloneJson } from "@canvas-2d/shared"

import { settingSchema } from "./settingSchema"
import { fillSchemaValue } from "./fillSchemaValue"
import { parseSchemaValue } from "./parseSchemaValue"
import { ImageUpload, gradientInput } from "./widget"

interface SettingsProps {
  eleRef: React.MutableRefObject<Element | null>
  update: () => void
}

export interface SettingsRef {
  settingUpdate: () => void
}

export const Settings = forwardRef((props: SettingsProps, ref: React.ForwardedRef<SettingsRef>) => {
  const { eleRef, update } = props
  const form = useForm()
  const formIsSetValueRef = useRef<boolean>(false)

  useImperativeHandle(ref, () => ({
    settingUpdate: () => {
      if (!eleRef.current) return
      formIsSetValueRef.current = true
      const formData = cloneJson(fillSchemaValue(eleRef.current))
      form.setValues(formData)
    },
    AA: () => {}
  }))

  const onSettingChange = (value: any) => {
    if (!eleRef.current) return
    // FIXME: settingUpdate 不一定会触发 onSettingChange
    // if (formIsSetValueRef.current) {
    //   formIsSetValueRef.current = false
    //   return
    // }

    try {
      const eleData = parseSchemaValue(value, eleRef.current)
      assertElement(eleData)
      eleRef.current.fromJSON(eleData)
      update()
    } catch (error) {
      console.log("catch", error)
    }
  }

  if (!eleRef.current) return <div />

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
