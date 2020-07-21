module.exports = {

  name: 'Canvas Gif to Png',

  section: 'Image Editing',

  subtitle: function (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Extract Frame ${data.frame} to ${storeTypes[parseInt(data.storage2)]} (${data.varName2})`
  },

  fields: ['storage', 'varName', 'frame', 'storage2', 'varName2'],

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
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Extract Frame of:<br>
      <input id="frame" class="round" type="text" value="1" placeholder="frame start with 1">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
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
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    } else if (!dataUrl.animated) {
      this.Canvas.onError(data, cache, 'Image is not a gif image.')
      this.callNextAction(cache)
      return
    }
    const frame = parseInt(this.evalMessage(data.frame, cache))
    if (isNaN(frame)) {
      this.Canvas.onError(data, cache, 'Frame is not a number!')
      this.callNextAction(cache)
      return
    }
    if (frame > dataUrl.images.length) {
      this.Canvas.onError(data, cache, `Gif image ${dataUrl.images.length} frames is less than ${frame}`)
      this.callNextAction(cache)
      return
    }
    const storage2 = parseInt(data.storage2)
    const varName2 = this.evalMessage(data.varName2, cache)
    this.storeValue(dataUrl.images[frame - 1], storage2, varName2, cache)
    this.callNextAction(cache)
  },

  mod: function () {
  }

}
