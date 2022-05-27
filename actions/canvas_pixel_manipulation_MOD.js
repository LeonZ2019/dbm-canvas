module.exports = {

  name: 'Canvas Image Filter',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    const filter = ['Blur', 'Hue Rotate', 'Brightness', 'Contrast', 'Grayscale', 'Invert', 'Opacity', 'Saturate', 'Sepia']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${filter[parseInt(data.info)]} (${data.value})`
  },

  fields: ['storage', 'varName', 'info', 'value'],

  html (isEvent, data) {
    return `
    <div>
      <div style="float: left; width: 45%;">
        Source Image:<br>
        <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
          ${data.variables[1]}
        </select><br>
      </div>
      <div id="varNameContainer" style="float: right; width: 50%;">
        Variable Name:<br>
        <input id="varName" class="round" type="text" list="variableList"><br>
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 45%;">
        Filter:<br>
        <select id="info" class="round" onchange="glob.onChange1(this)">
          <option value="0" selected>Blur</option>
          <option value="1">Hue Rotate</option>
          <option value="2">Brightness</option>
          <option value="3">Contrast</option>
          <option value="4">Grayscale</option>
          <option value="5">Invert</option>
          <option value="6">Opacity</option>
          <option value="7">Saturate</option>
          <option value="8">Sepia</option>
        </select><br>
      </div>
      <div style="float: right; width: 50%;">
        <span id="valuetext">Value:</span><br>
        <input id="value" class="round" type="text" placeholder="0 = None filter"><br>
      </div>
    </div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('storage'))

    glob.onChange1 = function (event) {
      const value = parseInt(event.value)
      const valuetext = document.getElementById('valuetext')
      if (value === 1) {
        valuetext.innerHTML = 'Value (Degree):'
      } else {
        valuetext.innerHTML = 'Value (Percent):'
      };
    }

    glob.onChange1(document.getElementById('info'))
  },

  async action (cache) {
    const data = this.Canvas.updateValue(cache.actions[cache.index])
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const sourceImage = this.getVariable(storage, varName, cache)
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    };
    const info = parseInt(data.info)
    const value = parseFloat(this.evalMessage(data.value, cache))
    try {
      const image = await this.Canvas.Filter(sourceImage, info, value)
      this.storeValue(image, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas.Color.Replace = function (sourceImage, x, y, hex, opacity, index = 0) { // need do with opacity and index define value
      if (typeof opacity === 'undefined') opacity = 255 // post define
      const image = this.loadImage(sourceImage, index)
      const imageData = DBM.Actions.Canvas.getImageData(image, 0, 0, image.width, image.height)
      const dataReplace = ((y - 1) * image.height + x - 1) * 4 // rgba 4 colors
      const rgba = DBM.Actions.Canvas.Color.hex2rgb(hex).concat(opacity)
      let replace = 1
      for (const value of rgba) {
        imageData[dataReplace + replace] = value
        replace++
      }
      sourceImage = this.putImageData(sourceImage, imageData, 0, 0, index)
      return sourceImage
    }
  }
}
