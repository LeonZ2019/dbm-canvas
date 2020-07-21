/* eslint-disable eqeqeq */
module.exports = {

  name: 'Canvas Draw Image on Image',

  section: 'Image Editing',

  subtitle: function (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${storeTypes[parseInt(data.storage2)]} (${data.varName2}) -> ${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  github: 'github.com/LeonZ2019',
  version: '2.0.0',

  fields: ['storage', 'varName', 'storage2', 'varName2', 'x', 'y', 'effect', 'opacity', 'expand'],

  html: function (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 45%;">
      Source Image:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Image that is Drawn:<br>
      <select id="storage2" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      X Position:<br>
      <input id="x" class="round" type="text" value="0"><br>
    </div>
    <div style="float: right; width: 50%;">
      Y Position:<br>
      <input id="y" class="round" type="text" value="0"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Draw Effect:<br>
      <select id="effect" class="round">
        <option value="0" selected>Overlay</option>
        <option value="1">Mask</option>
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Opacity:<br>
      <input id="opacity" class="round" placeholder="0 - 100" value="100" type="text"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Auto Expand:<br>
      <select id="expand" class="round">
        <option value="false" selected>False</option>
        <option value="true">True</option>
      </select>
    </div>`
  },

  init: function () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
  },

  action: function (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const dataUrl = this.getVariable(storage, varName, cache)
    if (!dataUrl) {
      this.Canvas.onError(data, cache, 'Image 1 not exist!')
      this.callNextAction(cache)
      return
    }
    const storage2 = parseInt(data.storage2)
    const varName2 = this.evalMessage(data.varName2, cache)
    const dataUrl2 = this.getVariable(storage2, varName2, cache)
    if (!dataUrl2) {
      this.Canvas.onError(data, cache, 'Image 2 not exist!')
      this.callNextAction(cache)
      return
    }
    const options = {}
    options.x = parseInt(this.evalMessage(data.x, cache))
    options.y = parseInt(this.evalMessage(data.y, cache))
    options.opacity = parseFloat(this.evalMessage(data.opacity, cache))
    options.expand = Boolean(data.expand === 'true')
    const effect = parseInt(data.effect)
    if (effect == 1) options.effect = 'mask'
    try {
      const result = this.Canvas.drawImage(dataUrl, dataUrl2, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod: function (DBM) {
    DBM.Actions.Canvas.RBGtoLin = function (color) {
      color = color / 255
      if (color <= 0.03928) {
        return color / 12.92
      } else {
        return Math.pow((color + 0.055) / 1.055, 2.4)
      }
    }
    DBM.Actions.Canvas.getLuminance = function (imageData) {
      const Luminance = []
      for (let i = 0; i < imageData.length; i += 4) {
        const Y = (0.2126 * this.RBGtoLin(imageData[i]) + 0.7152 * this.RBGtoLin(imageData[i + 1]) + 0.0722 * this.RBGtoLin(imageData[i + 2])) * imageData[i + 3] / 255
        Luminance.push(Y)
      }
      return Luminance
    }

    DBM.Actions.Canvas.mask = function (ctx, image, image2, x, y, opacity) {
      const imageData = this.getImageData(image, image.width, image.height, false, 0, 0)
      const imageData2 = this.getImageData(image2, image.width, image.height, true, x, y).data
      const Luminance = this.getLuminance(imageData2)
      let alpha = 3
      for (let i = 0; i < Luminance.length; i++) {
        imageData.data[alpha] = Luminance[i] * opacity * 255
        alpha += 4
      }
      ctx.putImageData(imageData, 0, 0)
    }

    DBM.Actions.Canvas.getImageData = function (image, width, height, grayscale, x, y) {
      const tempCanvas = this.CanvasJS.createCanvas(width, height)
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.rect(0, 0, width, height)
      tempCtx.fillStyle = 'white'
      tempCtx.fill()
      if (grayscale) tempCtx.globalCompositeOperation = 'luminosity'
      tempCtx.drawImage(image, x, y)
      return tempCtx.getImageData(0, 0, width, height)
    }

    DBM.Actions.Canvas.drawImage = function (dataUrl, dataUrl2, options) {
      const image = this.loadImage(dataUrl)
      const image2 = this.loadImage(dataUrl2)
      const width = image.width || dataUrl.width
      const height = image.height || dataUrl.height
      let canvas
      if (options.expand) {
        canvas = this.CanvasJS.createCanvas(Math.max(width, image2.width || dataUrl2.width), Math.max(height, image2.height || dataUrl2.height))
      } else {
        canvas = this.CanvasJS.createCanvas(width, height)
      }
      const ctx = canvas.getContext('2d')
      if (!options.x || isNaN(options.x)) options.x = 0
      if (!options.y || isNaN(options.y)) options.y = 0
      if (!options.opacity || (options.opacity && isNaN(options.opacity)) || options.opacity > 100) {
        options.opacity = 1
      } else {
        options.opacity = Number(options.opacity) / 100
      }
      if (options.effect && options.effect == 'mask') {
        if (!dataUrl.animated && !dataUrl2.animated) {
          this.mask(ctx, image, image2, options.x, options.y, options.opacity)
          return canvas.toDataURL('image/png')
        } else if (!dataUrl.animated && dataUrl2.animated) {
          dataUrl2.images = []
          for (let i = 0; i < image2.length; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            this.mask(ctx, image, image2[i], options.x, options.y, options.opacity)
            dataUrl2.images.push(canvas.toDataURL('image/png'))
          }
          return dataUrl2
        } else if (dataUrl.animated && !dataUrl2.animated) {
          dataUrl.images = []
          for (let i = 0; i < image.length; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            this.mask(ctx, image[i], image2, options.x, options.y, options.opacity)
            dataUrl.images.push(canvas.toDataURL('image/png'))
          }
          return dataUrl
        } else if (dataUrl.animated && dataUrl2.animated) {
          dataUrl.images = []
          const maxFrame = Math.max(image.length, image2.length)
          let imageFrame = 0
          let image2Frame = 0
          for (let i = 0; i < maxFrame; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            this.mask(ctx, image[imageFrame], image2[image2Frame], options.x, options.y, options.opacity)
            dataUrl.images.push(canvas.toDataURL('image/png'))
            if (imageFrame + 1 > image.length) {
              imageFrame = 0
            } else {
              imageFrame++
            }
            if (image2Frame + 1 > image2.length) {
              image2Frame = 0
            } else {
              image2Frame++
            }
          }
          return dataUrl
        }
      } else {
        if (!dataUrl.animated && !dataUrl2.animated) {
          ctx.drawImage(image, 0, 0)
          ctx.globalAlpha = options.opacity
          ctx.drawImage(image2, options.x, options.y)
          return canvas.toDataURL('image/png')
        } else if (!dataUrl.animated && dataUrl2.animated) {
          dataUrl2.images = []
          for (let i = 0; i < image2.length; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1
            ctx.drawImage(image, 0, 0)
            ctx.globalAlpha = options.opacity
            ctx.drawImage(image2[i], options.x, options.y)
            dataUrl2.images.push(canvas.toDataURL('image/png'))
          }
          return dataUrl2
        } else if (dataUrl.animated && !dataUrl2.animated) {
          dataUrl.images = []
          for (let i = 0; i < image.length; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1
            ctx.drawImage(image[i], 0, 0)
            ctx.globalAlpha = options.opacity
            ctx.drawImage(image2, options.x, options.y)
            dataUrl.images.push(canvas.toDataURL('image/png'))
          }
          return dataUrl
        } else if (dataUrl.animated && dataUrl2.animated) {
          dataUrl.images = []
          const maxFrame = Math.max(image.length, image2.length)
          let imageFrame = 0
          let image2Frame = 0
          for (let i = 0; i < maxFrame; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1
            ctx.drawImage(image[imageFrame], 0, 0)
            ctx.globalAlpha = options.opacity
            ctx.drawImage(image2[image2Frame], options.x, options.y)
            dataUrl.images.push(canvas.toDataURL('image/png'))
            if (imageFrame + 1 >= image.length) {
              imageFrame = 0
            } else {
              imageFrame++
            }
            if (image2Frame + 1 >= image2.length) {
              image2Frame = 0
            } else {
              image2Frame++
            }
          }
          return dataUrl
        }
      }
    }
  }

}
