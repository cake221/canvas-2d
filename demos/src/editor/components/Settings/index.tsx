import React, { useEffect } from "react"
import FormRender, { useForm } from "form-render"
import { Element, assetElement } from "@canvas-2d/core/src"
import { cloneJson } from "@canvas-2d/shared"

import { settingSchema, parseSchemaValue, fillSchemaValue } from "./settingSchema"

interface SettingsProps {
  ele: Element
  update: () => void
  eleIsUpdate: boolean
}

export function Settings(props: SettingsProps) {
  const { ele, update, eleIsUpdate } = props
  const form = useForm()

  useEffect(() => {
    const formData = cloneJson(fillSchemaValue(ele))
    form.setValues(formData)
  }, [eleIsUpdate])

  const onDataChange = (value: any) => {
    try {
      const eleData = parseSchemaValue(value, ele.type)
      assetElement(eleData)
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
      widgets={{}}
      watch={{
        "#": {
          immediate: false,
          handler: (v) => onDataChange(v)
        }
      }}
    />
  )
}
