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

  onNewValue(listener: OnValueHandle) {
    this.hiddenInput.addEventListener("input", () => listener(this.hiddenInput.value))
  }

  onKeydown(listener: OnValueHandle) {
    this.hiddenInput.addEventListener("keydown", (ev) => {
      listener(ev.code)
    })
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
