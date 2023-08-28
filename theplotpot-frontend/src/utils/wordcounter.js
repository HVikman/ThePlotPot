// WordCounter.js

import Quill from 'quill'

class WordCounter {
  constructor(quill, options) {
    this.quill = quill
    this.options = options
    this.container = document.querySelector(options.container)

    quill.on('text-change', this.update.bind(this))
    this.update()
  }

  calculate() {
    let text = this.quill.getText()
    return text.split(/\s+/).filter(Boolean).length
  }

  update() {
    let wordCount = this.calculate()
    if (wordCount > this.options.maxWords) {
      let currentText = this.quill.getText()
      let newText = currentText.split(/\s+/).slice(0, this.options.maxWords).join(' ')
      this.quill.setText(newText)
    }
    this.container.innerText = wordCount + ' / ' + this.options.maxWords
  }
}

Quill.register('modules/wordCounter', WordCounter)

export default WordCounter
