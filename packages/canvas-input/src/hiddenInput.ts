import { throttle } from "@canvas-2d/shared"
import { OnValueHandle } from "./index"

const ctrlChars = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

export class HiddenInput {
  hiddenInput = document.createElement("textarea")

  constructor(text: string) {
    this.setStyle()
    this.hiddenInput.value = text
  }

  isCtrlValue(value: string) {
    return ctrlChars.includes(value)
  }

  onNewValueCallBack!: (...args: any) => void

  onNewValue(listener: OnValueHandle) {
    this.onNewValueCallBack = throttle(() => listener(this.hiddenInput.value))
    this.hiddenInput.addEventListener("input", this.onNewValueCallBack)
  }

  onKeydownCallBack!: (...args: any) => void

  onKeydown(listener: OnValueHandle) {
    this.onKeydownCallBack = throttle((ev: any) => {
      listener(ev.code)
    })
    this.hiddenInput.addEventListener("keydown", this.onKeydownCallBack)
  }

  setStyle() {
    const { hiddenInput } = this

    hiddenInput.style.position = "absolute"
    hiddenInput.style.opacity = "0"
    hiddenInput.style.pointerEvents = "none"
    hiddenInput.style.zIndex = "0"
    hiddenInput.style.transform = "scale(0)"
  }

  clearValue() {
    this.hiddenInput.value = ""
  }

  focus() {
    document.body.appendChild(this.hiddenInput)
    this.hiddenInput.focus()
  }

  blur() {
    this.hiddenInput.blur()
    this.clearValue()
    if (document.body.contains(this.hiddenInput)) {
      this.hiddenInput.removeEventListener("input", this.onNewValueCallBack)
      this.hiddenInput.removeEventListener("keydown", this.onKeydownCallBack)
      document.body.removeChild(this.hiddenInput)
    }
  }

  updateInputCaret(caretPosition: number) {
    const { hiddenInput } = this
    hiddenInput.selectionStart = caretPosition
    hiddenInput.selectionEnd = caretPosition
  }

  updateInputSelection(selectionStart: number, selectionEnd: number) {
    if (selectionStart === selectionEnd) return
    if (selectionStart > selectionEnd) {
      this.updateInputSelection(selectionEnd, selectionStart)
      return
    }
    const { hiddenInput } = this
    hiddenInput.selectionStart = selectionStart
    hiddenInput.selectionEnd = selectionEnd
  }
}
