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
    if (!DBM.Actions.Canvas.FilterJS) DBM.Actions.Canvas.FilterJS = DBM.Actions.getMods().require('imagedata-filters')
    DBM.Actions.Canvas.filterFnc = function (imageData, type, value) {
      let filtered
      switch (type) {
        case 0: case 'blur':
          filtered = this.FilterJS.blur(imageData, { amount: value / 100 })
          break
        case 1: case 'huerotate':
          filtered = this.FilterJS.hueRotate(imageData, { amount: value / 180 * Math.PI })
          break
        case 2: case 'brightness':
          filtered = this.FilterJS.brightness(imageData, { amount: (100 - value) / 100 })
          break
        case 3: case 'contrast':
          filtered = this.FilterJS.contrast(imageData, { amount: (100 - value) / 100 })
          break
        case 4: case 'grayscale':
          filtered = this.FilterJS.grayscale(imageData, { amount: value / 100 })
          break
        case 5: case 'invert':
          filtered = this.FilterJS.invert(imageData, { amount: value / 100 })
          break
        case 6: case 'opacity':
          filtered = this.FilterJS.opacity(imageData, { amount: (100 - value) / 100 })
          break
        case 7: case 'saturate':
          filtered = this.FilterJS.saturate(imageData, { amount: (100 - value) / 100 })
          break
        case 8: case 'sepia':
          filtered = this.FilterJS.sepia(imageData, { amount: value / 100 })
          break
      }
      return filtered
    }
    DBM.Actions.Canvas.Filter = async function (sourceImage, type, value) {
      const blurOptimize = [[0.1, 10], [0.5, 2], [0.2, 2.5, 2]]
      let blurSize = []
      if (typeof type === 'string') type = type.toLowerCase()
      if (['blur', 0].includes(type)) {
        let image = this.loadImage(sourceImage)
        if (sourceImage.animated) {
          image = image[0]
        }
        blurSize = blurOptimize[(image.width * image.height >= 1000000 || value >= 100) ? ((value > 500) ? 0 : 1) : 2]
      }
      let image = this.loadImage(sourceImage)
      let images
      if (sourceImage.animated) {
        images = image
        image = images[0]
      }
      const { width, height } = image
      let filteredImage
      const canvas = this.CanvasJS.createCanvas(width, height)
      const ctx = canvas.getContext('2d')
      if (sourceImage.animated) {
        const tempImgs = []
        for (let i = 0; i < images.length; i++) {
          let blurIndex = 0
          let draw = 0
          while (draw === 0 || blurSize.length !== blurIndex) {
            if (blurSize.length > blurIndex) {
              canvas.width *= blurSize[blurIndex]
              canvas.height *= blurSize[blurIndex]
              ctx.patternQuality = 'good'
              ctx.scale(blurSize[blurIndex], blurSize[blurIndex])
              blurIndex++
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(images[i], 0, 0)
            if (blurIndex !== 3) {
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const imgDataFiltered = this.filterFnc(imgData, type, (blurIndex > 1) ? Math.max(Math.min(value / 50, 25), 10) : ((blurIndex === 1 && canvas.width * canvas.height <= 250000) ? ((value > 500) ? 500 : value) : value))
              ctx.putImageData(imgDataFiltered, 0, 0)
              image[i] = new this.CanvasJS.Image()
              images[i].src = this.toDataURL(canvas)
              draw++
            }
          }
          tempImgs.push(this.toDataURL(canvas))
        }
        filteredImage = new this.Image(tempImgs, sourceImage)
      } else {
        let blurIndex = 0
        let draw = 0
        while (draw === 0 || blurSize.length !== blurIndex) {
          if (blurSize.length > blurIndex) {
            canvas.width *= blurSize[blurIndex]
            canvas.height *= blurSize[blurIndex]
            ctx.patternQuality = 'good'
            ctx.scale(blurSize[blurIndex], blurSize[blurIndex])
            blurIndex++
          }
          ctx.drawImage(image, 0, 0)
          if (blurIndex !== 3) {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const imgDataFiltered = this.filterFnc(imgData, type, (blurIndex > 1) ? Math.max(Math.min(value / 50, 25), 10) : ((blurIndex === 1 && canvas.width * canvas.height <= 250000) ? ((value > 500) ? 500 : value) : value))
            ctx.putImageData(imgDataFiltered, 0, 0)
            image = new this.CanvasJS.Image()
            image.src = this.toDataURL(canvas)
            draw++
          }
        }
        filteredImage = new this.Image(this.toDataURL(canvas))
      }
      return filteredImage
    }
  }

}
