import Quill from 'quill'

class CharacterCounter {
  constructor(quill, options) {
    this.quill = quill
    this.options = options
    this.container = document.querySelector(options.container)

    quill.on('text-change', this.update.bind(this))
    this.update()
  }

  calculate() {
    let text = this.quill.getText()
    return text.length -1
  }

  update() {
    let charCount = this.calculate()
    if (charCount > this.options.maxChars) {
      let currentText = this.quill.getText()
      let newText = currentText.substring(0, this.options.maxChars)
      this.quill.setText(newText)
    }
    this.container.innerText = charCount + ' / ' + this.options.maxChars
  }
}

Quill.register('modules/characterCounter', CharacterCounter)

export default CharacterCounter
