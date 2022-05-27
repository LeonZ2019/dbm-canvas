module.exports = {

  name: 'Canvas Image Bridge',

  section: 'Image Editing',

  subtitle (data) {
    const bridge = ['Canvas to Jimp', 'Jimp to Canvas']
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${bridge[parseInt(data.bridge)]} ${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${storeTypes[parseInt(data.storage2)]} (${data.varName2})`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    return ([data.varName2, 'Image'])
  },

  fields: ['storage', 'varName', 'type', 'varName2', 'storage2'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 60%;">
      Bridge Direction:<br>
      <select id="type" class="round">
        <option value="0" selected>From Canvas to Jimp</option>
        <option value="1">From Jimp to Canvas</option>
      </select>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Source Image:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage2" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text">
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
  },

  async action (cache) {
    const data = this.Canvas.updateValue(cache.actions[cache.index])
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const image = this.getVariable(storage, varName, cache)
    if (!image) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    try {
      const type = parseInt(data.type)
      const result = this.Canvas.bridge(image, type)
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage2, varName2, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    if (!DBM.Actions.Canvas.PixelGif) {
      try {
        DBM.Actions.Canvas.PixelGif = DBM.Actions.getMods().require('pixel-gif')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }

    DBM.Actions.Canvas.bridge = function (sourceImage, type = -1) {
      const name = sourceImage.name || sourceImage.constructor.name
      switch (name.toLowerCase()) {
        case 'jimp': // this to be test......
          if (type === 1) {
            return sourceImage
          } else { // jimp to canvas
            const { width, height } = sourceImage
            const canvas = this.CanvasJS.createCanvas(width, height)
            const ctx = canvas.getContext('2d')
            if (sourceImage.animated) {
              const outputImgs = []
              for (let i = 0; i < sourceImage.totalFrames; i++) {
                const imageData = this.CanvasJS.createImageData(new Uint8ClampedArray(sourceImage.image[i].bitmap.data), width, height)
                ctx.putImageData(imageData, 0, 0)
                outputImgs.push(this.toDataURL(canvas))
              }
              return new this.Image(outputImgs, sourceImage)
            } else {
              const imageData = this.CanvasJS.createImageData(new Uint8ClampedArray(sourceImage.image.bitmap.data), width, height)
              ctx.putImageData(imageData, 0, 0)
              return new this.Image(this.toDataURL(canvas))
            }
          }
        case 'canvas':
          const Jimp = DBM.Actions.getMods().require('jimp')
          if (type === 0) {
            return sourceImage
          } else { // canvas to jimp
            const image = this.loadImage(sourceImage)
            if (sourceImage.animated) {
              const outputImgs = []
              for (let i = 0; i < image.length; i++) {
                const imageData = this.getImageData(image[0], 0, 0, image[0].width, image[0].height)
                outputImgs.push(new Jimp({ data: Buffer.from(imageData.data), width: sourceImage.width, height: sourceImage.height }))
              }
              return new this.JimpImage(outputImgs, sourceImage) // gif only
            } else {
              const imageData = this.getImageData(image, 0, 0, image.width, image.height)
              return new Jimp({ data: Buffer.from(imageData.data), width: image.width, height: image.height })
            }
          }
      }
    }
  }
}
