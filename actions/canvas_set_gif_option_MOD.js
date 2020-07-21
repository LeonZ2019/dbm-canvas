module.exports = {

  name: 'Canvas Set Gif Option',

  section: 'Image Editing',

  subtitle: function (data) {
    const type = ['Set Loop', 'Set Delap', 'Set Images']
    return `${type[parseInt(data.type)]} ${data.value}`
  },

  fields: ['storage', 'varName', 'type', 'value'],

  html: function (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Source Image:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 40%;">
      Set Option:<br>
      <select id="type" class="round" onchange="glob.onChange(this)">
        <option value="0" selected>Loop (integer)</option>
        <option value="1">Delay (ms)</option>
        <option value="2">Images (path)</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 60%;">
      Value:<br>
      <input id="value" class="round" type="text">
    </div>
  </div>`
  },

  init: function () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
    const value = document.getElementById('value')
    glob.onChange = function (event) {
      if (parseInt(event.value) === 2) {
        value.placeholder = 'Local Image only'
      } else {
        value.placeholder = 'Number Here'
      }
    }
    glob.onChange(document.getElementById('type'))
  },

  action: async function (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const dataUrl = this.getVariable(storage, varName, cache)
    if (!dataUrl) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    } else if (!dataUrl.animated) {
      this.Canvas.onError(data, cache, 'Image is not a gif!')
      this.callNextAction(cache)
      return
    }
    const type = parseInt(data.type)
    const value = this.evalMessage(data.value, cache)
    if ((type < 2) && isNaN(value)) {
      this.Canvas.onError(data, cache, "'Value' is not a number!")
      this.callNextAction(cache)
      return
    }
    switch (type) {
      case 0:
        dataUrl.loopCount = parseInt(value)
        break
      case 1:
        dataUrl.delay = parseInt(value)
        break
      case 2:
        try {
          if (!value.endsWith('.png') && !value.endsWith('.jpg')) {
            this.Canvas.onError(cache, data, 'Please provide valid image format, png or jpg')
            return
          }
          const glob = this.getMods().require('glob')
          const array = glob.sync(value)
          if (array.length > 0) {
            const list = []
            for (let i = 0; i < array.length; i++) {
              list.push(await this.Canvas.createImage(array[i]))
            }
            const img = this.Canvas.loadImage(list[0])
            dataUrl.images = list
            dataUrl.width = img.width
            dataUrl.height = img.height
          } else {
            this.Canvas.onError(cache, data, "'Value' is not valid images path!")
            break
          }
        } catch (err) {
          this.Canvas.onError(data, cache, err)
        }
        break
    }
    this.storeValue(dataUrl, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod: function () {
  }

}
