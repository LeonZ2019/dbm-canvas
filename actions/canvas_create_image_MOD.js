module.exports = {

  name: 'Canvas Create Image',

  section: 'Image Editing',

  subtitle: function (data) {
    return `${data.url}`
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['url', 'type', 'loop', 'delay', 'storage', 'varName'],

  html: function (isEvent, data) {
    return `
  <div>
    <a id="link" href='#'>Local URL</a> / Web URL:<br>
    <input id="url" class="round" type="text" value="resources/" placeholder="Support extension type (.png | .jpg | .gif)"><br>
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Image Type:<br>
      <select id="type" class="round" onchange="glob.onChange(this)">
        <option value="0" selected>Auto (.gif / .png / .jpg / .webp)</option>
        <option value="1">Animted Images (Local Image only)</option>
        <option value="2">Still Image (.png / .webp)</option>
      </select>
    </div>
  </div><br><br><br>
  <div id="gifOption" style="display: none; padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Loop Default Value (integer):<br>
      <input id="loop" class="round" type="text" value="0" placeholder="(0 = Infinity)"><br>
    </div>
    <div style="float: right; width: 50%;">
      Delay Each Frame Default Value (ms):<br>
      <input id="delay" class="round" type="text" value="100"><br>
    </div>
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>`
  },

  init: function () {
    const { glob, document } = this
    document.getElementById('link').onclick = function () {
      require('child_process').execSync('start https://globster.xyz')
    }
    const gifOption = document.getElementById('gifOption')
    glob.onChange = function (event) {
      if (parseInt(event.value) === 2) {
        gifOption.style.display = 'none'
      } else {
        gifOption.style.display = null
      }
    }
    glob.onChange(document.getElementById('type'))
  },

  action: async function (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.type)
    const loop = parseInt(this.evalMessage(data.loop, cache))
    const delay = parseInt(this.evalMessage(data.delay, cache))
    const url = this.evalMessage(data.url, cache)
    try {
      let image
      if (type !== 2) {
        image = await this.Canvas.createImage(url, { loop: loop, delay: delay })
      } else {
        image = await this.Canvas.createImage(url)
      }
      const varName = this.evalMessage(data.varName, cache)
      const storage = parseInt(data.storage)
      this.storeValue(image, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod: function (DBM) {
    DBM.Actions.Canvas = DBM.Actions.Canvas || {}
    const chalk = DBM.Actions.getMods().require('chalk')
    DBM.Actions.Canvas.onError = (data, cache, err) => {
      const colors = ['FF4C4C', 'FFFF7F', '00FF7F']
      if (data && cache) {
        const text = 'Canvas ' + DBM.Actions.getErrorString(data, cache)
        console.error(chalk.hex(colors[0])(text))
      }
      if (err.message && err.message === 'Image given has not completed loading') {
        console.error(chalk.hex(colors[0])(err))
        console.error(chalk.hex(colors[1])('Possible Solution: Canvas mod only made for canvas.'))
      } else {
        console.error(chalk.hex(colors[0])(err))
      }
    }
    if (!DBM.Actions.Canvas.CanvasJS) {
      try {
        if (process.arch !== 'x64') {
          const commandExists = DBM.Actions.getMods().require('command-exists')
          if (commandExists.sync('node')) {
            const arch = require('child_process').execSync('node -p "process.arch"').toString()
            if (arch === 'x64\n') {
              console.log(chalk.hex('00FF7F')(`Solved: Canvas changed node.js ${process.arch} to node.js x64`))
              require('child_process').spawnSync('node', [process.argv[1]], { cwd: process.cwd(), stdio: [0, 1, 2] })
              process.exit()
            } else {
              console.error(chalk.hex('FFFF7F')(`Solution: Please install node.js x64 (currently is ${process.arch}) to your system! Get download 64-bit here https://nodejs.org/en/download/`))
            }
          } else {
            console.log('Node.js is not install on your system, please download here https://nodejs.org/en/download/')
          }
        } else {
          DBM.Actions.Canvas.CanvasJS = DBM.Actions.getMods().require('canvas')
        }
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    if (!DBM.Actions.Canvas.PixelGif) {
      try {
        DBM.Actions.Canvas.PixelGif = DBM.Actions.getMods().require('pixel-gif')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    if (!DBM.Actions.Canvas.Glob) {
      try {
        DBM.Actions.Canvas.Glob = DBM.Actions.getMods().require('glob')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    if (!DBM.Actions.Canvas.Fetch) {
      try {
        DBM.Actions.Canvas.Fetch = DBM.Actions.getMods().require('node-fetch')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    DBM.Actions.Canvas.solvePath = function (path) {
      const Path = require('path')
      path = Path.normalize(path)
      if (process.platform !== 'win32') {
        path = path.replace(/^\\\\\?\\/, '').replace(/\\/g, '/').replace(/\/\/+/g, '/')
      }
      return Path.resolve(Path.join(process.cwd(), path))
    }
    DBM.Actions.Canvas.loadDependencies = function () {
      const Path = require('path')
      let dependencies = this.Glob.sync(this.solvePath('canvas_dependencies\\*'))
      if (dependencies.length === 0) {
        throw new Error('Canvas dependencies not found')
      } else {
        dependencies = dependencies.filter((dependency) => {
          if (process.platform !== 'win32') {
            return ['', '.js'].includes(require('path').extname(dependency))
          } else {
            return ['.exe', '.js'].includes(require('path').extname(dependency))
          }
        })
        this.dependencies = []
        dependencies.forEach((dependency) => {
          this.dependencies[Path.basename(dependency).replace(Path.extname(dependency), '')] = dependency
        })
      }
    }
    DBM.Actions.Canvas.loadDependencies()
    DBM.Actions.Canvas.loadImage = function (dataUrl) {
      if (dataUrl.animated) {
        const images = []
        for (let i = 0; i < dataUrl.images.length; i++) {
          const image = new this.CanvasJS.Image()
          image.src = dataUrl.images[i]
          images.push(image)
        }
        return images
      } else {
        const image = new this.CanvasJS.Image()
        image.src = dataUrl
        return image
      }
    }
    DBM.Actions.Canvas.createImage = async function (path, options) {
      const Path = require('path')
      const fs = require('fs')
      let type
      try {
        // eslint-disable-next-line no-new
        new URL(path)
        type = 'url'
      } catch (err) {
        type = 'local'
      }
      if (type === 'local') {
        const files = this.Glob.sync(this.solvePath(path))
        if (files.length === 0) {
          throw new Error('Image not exist!')
        } else if (files.length === 1) {
          const extname = Path.extname(path)
          if (extname.startsWith('.gif')) {
            return await this.loadGif(files[0])
          } else if (extname.startsWith('.webp')) {
            const temp = fs.mkdtempSync(require('os').tmpdir() + Path.sep)
            require('child_process').execSync(`"${this.dependencies.dwebp}" "${path}" -quiet -o "${temp}${Path.sep}temp.png"`)
            const img = 'data:image/png;base64,' + fs.readFileSync(`${temp}${Path.sep}temp.png`).toString('base64')
            fs.rmdirSync(temp, { recursive: true })
            return img
          } else {
            if (!['.png', '.gif'].includes(extname)) {
              throw new Error('Please provide valid image format.')
            }
            const image = await this.CanvasJS.loadImage(files[0])
            const canvas = this.CanvasJS.createCanvas(image.width, image.height)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            return canvas.toDataURL('image/png')
          }
        } else {
          if (Path.extname(path) === '.gif') {
            console.log('Multiple gif files found, auto choose for the first gif only.')
            return await this.loadGif(files[0])
          } else {
            const Gif = {}
            Gif.images = []
            Gif.delay = (options && options.delay) ? options.delay : 100
            Gif.loopCount = (options && options.loop) ? options.loop : 0
            Gif.animated = true
            for (let i = 0; i < files.length; i++) {
              Gif.images.push(await this.createImage(files[i]))
            }
            const img = this.loadImage(Gif.images[0])
            Gif.width = img.width
            Gif.height = img.height
            return Gif
          }
        }
      } else if (type === 'url') {
        if (Path.extname(path).toLowerCase().startsWith('.webp')) {
          const res = await this.Fetch(path)
          const temp = fs.mkdtempSync(require('os').tmpdir() + Path.sep)
          fs.writeFileSync(`${temp}${Path.sep}temp.webp`, await res.buffer())
          require('child_process').execSync(`"${this.dependencies.dwebp}" "${temp}${Path.sep}temp.webp" -quiet -o "${temp}${Path.sep}temp.png"`)
          const img = 'data:image/png;base64,' + fs.readFileSync(`${temp}${Path.sep}temp.png`).toString('base64')
          fs.rmdirSync(temp, { recursive: true })
          return img
        } else if (Path.extname(path).toLowerCase().startsWith('.gif')) {
          return await this.loadGif(path)
        } else {
          const image = await this.CanvasJS.loadImage(path)
          const canvas = this.CanvasJS.createCanvas(image.width, image.height)
          const ctx = canvas.getContext('2d')
          ctx.drawImage(image, 0, 0)
          return canvas.toDataURL('image/png')
        }
      }
    }

    DBM.Actions.Canvas.loadGif = async function (path) {
      const images = await this.PixelGif.parse(path)
      const canvas = this.CanvasJS.createCanvas(images[0].width, images[0].height)
      const ctx = canvas.getContext('2d')
      const imageData = ctx.getImageData(0, 0, images[0].width, images[0].height)
      let i = 0
      const Gif = {}
      Gif.width = images[0].width
      Gif.height = images[0].height
      Gif.images = []
      Gif.delay = images.map(i => i.delay).reduce((a, c) => a + c, 0) / images.length
      Gif.loopCount = images.loopCount
      Gif.animated = true
      while (images[i] != null) {
        for (let d = 0; d < images[i].data.length; d++) {
          imageData.data[d] = images[i].data[d]
        }
        ctx.putImageData(imageData, 0, 0)
        Gif.images.push(canvas.toDataURL('image/png'))
        i++
      }
      return Gif
    }
  }
}
