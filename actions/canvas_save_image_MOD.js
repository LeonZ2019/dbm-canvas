module.exports = {

  name: 'Canvas Save Image',

  section: 'Image Editing',

  subtitle (data) {
    return `Save to "${data.Path}"`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    return ([data.varName2, 'Image Path'])
  },

  fields: ['storage', 'varName', 'Path', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 40%;">
      Source Image:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select><br>
    </div>
    <div style="padding-left: 2%; float: left; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 105%;">
      Path (Save to Local):<br>
      <input id="Path" class="round" type="text" placeholder="resources/output.png"><br>
    </div>
  </div><br><br>
  <div>
    <div style="float: left; width: 40%;">
      Store In:<br>
      <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select><br>
    </div>
    <div id="varNameContainer" style="padding-left: 2%; float: left; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text"><br>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer')
  },

  action (cache) {
    const data = this.Canvas.updateValue(cache.actions[cache.index])
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const sourceImage = this.getVariable(storage, varName, cache)
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    const path = this.evalMessage(data.Path, cache)
    if (!path) {
      this.Canvas.onError(data, cache, 'Path not define.')
      return
    }
    try {
      this.Canvas.Export(sourceImage, path)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
    const varName2 = this.evalMessage(data.varName2, cache)
    const storage2 = parseInt(data.storage2)
    if (varName2 && storage2) {
      this.storeValue(path, storage2, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod (DBM) {
    DBM.Actions.Canvas.Export = function (sourceImage, destination) {
      const Path = require('path')
      const parsedDest = Path.parse(destination)
      if (parsedDest.name === '') {
        parsedDest.name = 'template'
      }
      if (parsedDest.ext === '' || !sourceImage.extensions.includes(parsedDest.ext)) {
        parsedDest.ext = sourceImage.extensions[0]
      }
      destination = Path.join(parsedDest.dir, parsedDest.name + parsedDest.ext)
      require('fs').writeFileSync(destination, this.toBuffer(sourceImage))
    }
  }

}
