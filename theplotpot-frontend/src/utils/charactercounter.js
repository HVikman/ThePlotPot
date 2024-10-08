import Quill from 'quill'

class Counter {
  constructor(quill, options) {
    this.quill = quill
    this.options = options
    this.container = document.querySelector(options.container)

    // Bind the update function to the 'text-change' event
    quill.on(Quill.events.TEXT_CHANGE, this.update.bind(this))
  }

  // Calculate the character count
  calculate() {
    const text = this.quill.getText().trim() // Get trimmed text

    return text.length // Return the length of the text as character count
  }

  // Update the character count display
  update() {
    const length = this.calculate()
    const maxChars = this.options.maxChars
    this.container.innerText = `${length} / ${maxChars} characters`
  }
}

Quill.register('modules/counter', Counter)
