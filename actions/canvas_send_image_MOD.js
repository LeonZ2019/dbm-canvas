module.exports = {

  name: 'Canvas Send Image',

  section: 'Image Editing',

  subtitle: function (data) {
    const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${channels[parseInt(data.channel)]}`
  },

  github: 'github.com/LeonZ2019',
  version: '2.0.0',

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    return ([data.varName3, 'Message Object'])
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'message', 'spoiler', 'storage2', 'varName3', 'imgName'],

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
    <div style="float: left; width: 35%;">
      Send To:<br>
      <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer')">
        ${data.sendTargets[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    Message:<br>
    <textarea id="message" rows="2" placeholder="Insert message here..." style="width: 94%"></textarea>
  </div><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 44%;">
      Image Spoiler:<br>
      <select id="spoiler" class="round">
        <option value="0" selected>No</option>
        <option value="1">Yes</option>
      </select><br>
    </div>
    <div style="padding-left: 5%; float: left; width: 50%;">
      Image Name (Without extension):<br>
      <input id="imgName" class="round" type="text" value="image"><br>
    </div>
  </div><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName3" class="round" type="text">
    </div>
  </div>`
  },

  init: function () {
    const { glob, document } = this
    glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer')
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2')
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
    }
    const channel = parseInt(data.channel)
    const varName2 = this.evalMessage(data.varName2, cache)
    const target = this.getSendTarget(channel, varName2, cache)
    let name = this.evalMessage(data.imgName, cache)
    if (dataUrl.animated) {
      name += '.gif'
    } else {
      name += '.png'
    }
    if (parseInt(data.spoiler) === 1) name = `SPOILER_${name}`
    try {
      const attachment = await this.Canvas.toAttachment(dataUrl, name)
      if (target && target.send) {
        const content = this.evalMessage(data.message, cache)
        const message = await target.send(content === '' ? '' : content, attachment)
        const storage2 = parseInt(data.storage2)
        if (storage2 !== 0) {
          const varName3 = this.evalMessage(data.varName3, cache)
          this.storeValue(message, storage2, varName3, cache)
        }
      }
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod: function (DBM) {
    DBM.Actions.Canvas.toBuffer = function (dataUrl) {
      const image = this.loadImage(dataUrl)
      const canvas = this.CanvasJS.createCanvas(image.width, image.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const buffer = canvas.toBuffer('image/png', { compressionLevel: 9 })
      return buffer
    }

    DBM.Actions.Canvas.GifToBuffer = function (dataUrl) {
      const encoder = new this.GifEncoder(dataUrl.width, dataUrl.height, 'neuquant', false, dataUrl.images.length)
      encoder.start()
      encoder.setRepeat(dataUrl.loopCount)
      encoder.setDelay(dataUrl.delay)
      encoder.setQuality(20)
      const canvas = this.CanvasJS.createCanvas(dataUrl.width, dataUrl.height)
      const ctx = canvas.getContext('2d')
      const images = this.loadImage(dataUrl)
      for (let i = 0; i < images.length; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(images[i], 0, 0)
        encoder.addFrame(ctx.getImageData(0, 0, dataUrl.width, dataUrl.height).data)
      }
      encoder.finish()
      return encoder.out.getData()
    }

    DBM.Actions.Canvas.toAttachment = function (dataUrl, name) {
      let buffer
      if (dataUrl.animated) {
        buffer = this.GifToBuffer(dataUrl)
      } else {
        buffer = this.toBuffer(dataUrl)
      }
      let possibleExt = '.png'
      if (dataUrl.animated) possibleExt = '.gif'
      const parse = require('path').parse(name)
      if (parse.ext === '') {
        name += possibleExt
      } else if (parse.ext !== possibleExt) {
        name = parse.name + possibleExt
      }
      const attachment = new DBM.DiscordJS.MessageAttachment(buffer, name)
      return attachment
    }
  }
}
