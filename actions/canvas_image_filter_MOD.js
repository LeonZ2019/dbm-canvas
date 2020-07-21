module.exports = {

  name: 'Canvas Image Filter',

  section: 'Image Editing',

  subtitle: function (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    const filter = ['Blur', 'Hue Rotate', 'Brightness', 'Contrast', 'Grayscale', 'Invert', 'Opacity', 'Saturate', 'Sepia']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${filter[parseInt(data.info)]} (${data.value})`
  },

  fields: ['storage', 'varName', 'info', 'value'],

  html: function (isEvent, data) {
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

  init: function () {
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

  action: function (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const dataUrl = this.getVariable(storage, varName, cache)
    if (!dataUrl) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    };
    const info = parseInt(data.info)
    const value = parseFloat(this.evalMessage(data.value, cache))
    try {
      const image = this.Canvas.Filter(dataUrl, info, value)
      this.storeValue(image, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod: function (DBM) {
    if (!DBM.Actions.Canvas.CanvasJS) {
      DBM.Actions.Canvas.FilterJS = DBM.Actions.getMods().require('imagedata-filters')
    }
    DBM.Actions.Canvas.FilterFN = function (imageData, type, value) {
      let imageData2
      switch (type) {
        case 0: case 'blur':
          value = (value / 100).toString()
          imageData2 = this.FilterJS.blur(imageData, { amount: value })
          break
        case 1: case 'huerotate':
          value = (value / 180 * Math.PI).toString()
          imageData2 = this.FilterJS.hueRotate(imageData, { amount: value })
          break
        case 2: case 'brightness':
          value = ((100 - value) / 100).toString()
          imageData2 = this.FilterJS.brightness(imageData, { amount: value })
          break
        case 3: case 'contrast':
          value = ((100 - value) / 100).toString()
          imageData2 = this.FilterJS.contrast(imageData, { amount: value })
          break
        case 4: case 'grayscale':
          value = (value / 100).toString()
          imageData2 = this.FilterJS.grayscale(imageData, { amount: value })
          break
        case 5: case 'invert':
          value = (value / 100).toString()
          imageData2 = this.FilterJS.invert(imageData, { amount: value })
          break
        case 6: case 'opacity':
          value = ((100 - value) / 100).toString()
          imageData2 = this.FilterJS.opacity(imageData, { amount: value })
          break
        case 7: case 'saturate':
          value = ((100 - value) / 100).toString()
          imageData2 = this.FilterJS.saturate(imageData, { amount: value })
          break
        case 8: case 'sepia':
          value = (value / 100).toString()
          imageData2 = this.FilterJS.sepia(imageData, { amount: value })
      }
      return imageData2
    }
    DBM.Actions.Canvas.Filter = function (dataUrl, type, value) {
      let image = this.loadImage(dataUrl)
      let images
      if (dataUrl.animated) {
        images = image
        image = images[0]
      }
      if (typeof type === 'string') type = type.toLowerCase()
      const canvas = this.CanvasJS.createCanvas(image.width, image.height)
      const ctx = canvas.getContext('2d')
      if (dataUrl.animated) {
        dataUrl.images = []
        for (let i = 0; i < images.length; i++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(images[i], 0, 0)
          const imageData = ctx.getImageData(0, 0, image.width, image.height)
          const imageData2 = this.FilterFN(imageData, type, value)
          ctx.putImageData(imageData2, 0, 0)
          dataUrl.images.push(canvas.toDataURL('image/png'))
        }
        return dataUrl
      } else {
        ctx.drawImage(image, 0, 0)
        const imageData = ctx.getImageData(0, 0, image.width, image.height)
        const imageData2 = this.FilterFN(imageData, type, value)
        ctx.putImageData(imageData2, 0, 0)
        return canvas.toDataURL('image/png')
      };
    }
  }

}
