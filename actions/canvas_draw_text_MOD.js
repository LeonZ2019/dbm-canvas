module.exports = {

  name: 'Canvas Draw Text on Image',

  section: 'Image Editing',

  subtitle: function (data) {
    return `${data.text}`
  },

  fields: ['storage', 'varName', 'x', 'y', 'fontPath', 'fontColor', 'fontSize', 'align', 'text', 'rotate', 'antialias', 'maxWidth', 'fillType'],

  html: function (isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll;">
    <div style="float: left; width: 50%;">
      Source Image:<br>
      <select id="storage" class="round" style="width: 90%" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select><br>
      Local Font URL:<br>
      <input id="fontPath" class="round" type="text" value="fonts/"><br>
      Alignment:<br>
      <select id="align" class="round" style="width: 90%;">
        <option value="0" selected>Top Left</option>
        <option value="1">Top Center</option>
        <option value="2">Top Right</option>
        <option value="3">Middle Left</option>
        <option value="4">Middle Center</option>
        <option value="5">Middle Right</option>
        <option value="6">Bottom Left</option>
        <option value="7">Bottom Center</option>
        <option value="8">Bottom Right</option>
      </select><br>
      X Position:<br>
      <input id="x" class="round" type="text" value="0"><br>
      Rotate (0 - 359):<br>
      <input id="rotate" class="round" type="text" value="0"><br>
      Max Width:<br>
      <input id="maxWidth" class="round" type="text" placeholder="Leave it blank for None."><br>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
      Font Color (Hex):<br>
      <input id="fontColor" class="round" type="text" value="FFFFFF"><br>
      Font Size:<br>
      <input id="fontSize" class="round" type="text" placeholder="Default size 10px"><br>
      Y Position:<br>
      <input id="y" class="round" type="text" value="0"><br>
      Antialias:<br>
      <select id="antialias" class="round" style="width: 90%;">
        <option value="true" selected>True</option>
        <option value="false">False</option>
      </select><br>
      Fill Type:<br>
      <select id="fillType" class="round" style="width: 90%;">
        <option value="fill" selected>Fill</option>
        <option value="stroke">Stroke</option>
      </select><br>
    </div><br><br><br><br>
    <div>
      Text:<br>
      <textarea id="text" rows="2" placeholder="Insert text here..." style="width: 95%; white-space: nowrap; resize: none;"></textarea>
    </div>
  </div>`
  },

  init: function () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('storage'))
  },

  action: function (cache) {
    const fs = require('fs')
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const dataUrl = this.getVariable(storage, varName, cache)
    if (!dataUrl) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }

    const options = {}
    const font = this.evalMessage(data.fontPath, cache)
    if (!fs.existsSync(font)) {
      this.Canvas.onError(data, cache, 'Font file not exist!')
      return
    }
    options.font = font
    options.color = this.evalMessage(data.fontColor, cache)
    options.size = parseInt(this.evalMessage(data.fontSize, cache))
    options.align = parseInt(data.align)
    options.x = parseFloat(this.evalMessage(data.x, cache))
    options.y = parseFloat(this.evalMessage(data.y, cache))
    const maxWidth = this.evalMessage(data.maxWidth)
    if (maxWidth && !isNaN(maxWidth)) options.maxWidth = parseFloat(maxWidth)
    options.rotate = parseFloat(this.evalMessage(data.rotate, cache))
    options.antialias = Boolean(data.antialias === 'true')
    options.type = data.fillType
    const text = this.evalMessage(data.text, cache)
    try {
      const result = this.Canvas.drawText(dataUrl, text, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod: function (DBM) {
    if (!DBM.Actions.Canvas.OpenTypeJS) {
      DBM.Actions.Canvas.OpenTypeJS = DBM.Actions.getMods().require('opentype.js')
    }
    DBM.Actions.Canvas.drawText = function (dataUrl, text, options) {
      if (!options) options = {}
      if (!options.color) {
        options.color = '#000000'
      } else if (!isNaN(options.color) && !options.color.startsWith('#')) {
        options.color = '#' + options.color
      }
      if (!options.size || isNaN(options.size)) options.size = 10
      if (!options.x || isNaN(options.x)) options.x = 0
      if (!options.y || isNaN(options.y)) options.y = 0
      if (!options.rotate || isNaN(options.rotate)) options.rotate = 0
      if (options.maxWidth && isNaN(options.maxWidth)) delete options.maxWidth
      if (typeof options.antialias === 'undefined') options.antialias = true
      if (!options || !isNaN(options.align)) {
        if (options.align > 8 || options.align < 0) options.align = 0
      } else {
        options.align = options.align.toUpperCase()
        if (!['TL', 'TC', 'TR', 'ML', 'MC', 'MR', 'BL', 'BC', 'BR'].includes(options.align)) options.align = 'TL'
      }
      (!options.type || !['fill', 'stroke'].includes(options.type.toLowerCase())) ? options.type = 'fill' : options.type = options.type.toLowerCase()
      const font = this.OpenTypeJS.loadSync(options.font)
      this.CanvasJS.registerFont(options.font, { family: font.names.postScriptName.en })
      const image = this.loadImage(dataUrl)
      const canvas = this.CanvasJS.createCanvas(image.width || dataUrl.width, image.height || dataUrl.height)
      const ctx = canvas.getContext('2d')
      ctx.font = `${font.names.fontSubfamily.en} ${options.size}px "${font.names.postScriptName.en}"`
      ctx.fillStyle = options.color
      // type 1 options.align (Number) [0-9]
      // -------------
      // | 0 | 1 | 2 |
      // -------------
      // | 3 | 4 | 5 |
      // -------------
      // | 6 | 7 | 8 |
      // -------------
      // type 2 options.align (Text) -> [TL, TC, TR, ML MC, MR, BL, BC, BR]
      // ----------------
      // | TL | TC | TR |
      // ----------------
      // | ML | MC | MR |
      // ----------------
      // | BL | BC | BR |
      // ----------------
      switch (options.align) {
        case 0:
        case 'TL':
        default:
          ctx.textBaseline = 'hanging'
          ctx.textAlign = 'left'
          break
        case 1:
        case 'TC':
          ctx.textBaseline = 'hanging'
          ctx.textAlign = 'center'
          break
        case 2:
        case 'TR':
          ctx.textBaseline = 'hanging'
          ctx.textAlign = 'right'
          break
        case 3:
        case 'ML':
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'left'
          break
        case 4:
        case 'MC':
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          break
        case 5:
        case 'MR':
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'right'
          break
        case 6:
        case 'BL':
          ctx.textBaseline = 'alphabetic'
          ctx.textAlign = 'left'
          break
        case 7:
        case 'BC':
          ctx.textBaseline = 'alphabetic'
          ctx.textAlign = 'center'
          break
        case 8:
        case 'BR':
          ctx.textBaseline = 'alphabetic'
          ctx.textAlign = 'right'
          break
      }
      ctx.textDrawingMode = 'path'
      if (options.antialias) ctx.antialias = 'none'
      if (dataUrl.animated) {
        dataUrl.images = []
        for (let i = 0; i < image.length; i++) {
          ctx.drawImage(image[i], 0, 0)
          ctx.save()
          ctx.translate(options.x, options.y)
          ctx.rotate(options.rotate * Math.PI / 180)
          if (options.type === 'fill') {
            (options.maxWidth) ? ctx.fillText(text, 0, 0, options.maxWidth) : ctx.fillText(text, 0, 0)
          } else if (options.type === 'stroke') {
            (options.maxWidth) ? ctx.strokeText(text, 0, 0, options.maxWidth) : ctx.strokeText(text, 0, 0)
          }
          dataUrl.images.push(canvas.toDataURL('image/png'))
          ctx.restore()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        return dataUrl
      } else {
        ctx.translate(options.x, options.y)
        ctx.rotate(options.rotate * Math.PI / 180)
        if (options.type === 'fill') {
          (options.maxWidth) ? ctx.fillText(text, 0, 0, options.maxWidth) : ctx.fillText(text, 0, 0)
        } else if (options.type === 'stroke') {
          (options.maxWidth) ? ctx.strokeText(text, 0, 0, options.maxWidth) : ctx.strokeText(text, 0, 0)
        }
        ctx.drawImage(image, 0, 0)
        return canvas.toDataURL('image/png')
      }
    }
  }

}
