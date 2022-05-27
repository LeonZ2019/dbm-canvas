module.exports = {

  name: 'Canvas Create Image',

  section: 'Image Editing',

  version: '3.1.0',

  defaultValue: { 'Canvas Create Background': { width: '', height: '', info: '0', gradient: '', color: '', storage: '1', varName: '', name: 'Canvas Create Background' }, 'Canvas Create Image': { url: 'resources/', type: '0', loop: '0', delay: '100', overlap: '0', storage: '1', varName: '', name: 'Canvas Create Image' }, 'Canvas Crop Image': { storage: '1', varName: '', align: '0', align2: '0', width: '100%', height: '100%', positionx: '0', positiony: '0', name: 'Canvas Crop Image' }, 'Canvas Draw Image on Image': { storage: '1', varName: '', storage2: '1', varName2: '', x: '0', y: '0', effect: '0', opacity: '100', expand: 'false', name: 'Canvas Draw Image on Image' }, 'Canvas Draw Text on Image': { storage: '1', varName: '', x: '0', y: '0', fontPath: 'fonts/', fontColor: 'FFFFFF', fontSize: '', align: '0', text: '', rotate: '0', antialias: 'true', maxWidth: '', fillType: 'fill', autoWrap: '1', name: 'Canvas Draw Text on Image' }, 'Canvas Edit Image Border': { storage: '1', varName: '', circleinfo: '0', radius: '0', name: 'Canvas Edit Image Border' }, 'Canvas Generate Graph': { type: '0', sort: '0', width: '', height: '', title: '', borderWidth: '', borderColor: '', borderColorAlpha: '1', bgColor: '', bgColorAlpha: '0.1', labels: '', datasets: '', storage: '1', varName: '', name: 'Canvas Generate Graph' }, 'Canvas Gif to Png': { storage: '1', varName: '', frame: '1', storage2: '1', varName2: '', name: 'Canvas Gif to Png' }, 'Canvas Image Bridge': { storage: '1', varName: '', type: '0', varName2: '', storage2: '1', name: 'Canvas Image Bridge' }, 'Canvas Image Filter': { storage: '1', varName: '', info: '0', value: '', name: 'Canvas Image Filter' }, 'Canvas Image Options': { storage: '1', varName: '', mirror: '0', rotation: '0', width: '100%', height: '100%', resampling: '0', opacity: '100%', name: 'Canvas Image Options' }, 'Canvas Image Recognize': { storage: '1', varName: '', left: '', top: '', width: '', height: '', lang: 'eng', offsetType: 'pixel', acceptRange: '80', max: '3', offset: '5', forceAccept: 'true', forceMax: 'true', debug: 'false', storage2: '1', varName2: '', name: 'Canvas Image Recognize' }, 'Canvas Save Image': { storage: '1', varName: '', Path: '', storage2: '0', varName2: '', name: 'Canvas Save Image' }, 'Canvas Send Image': { storage: '1', varName: '', channel: '0', varName2: '', sendOrReply: 'send', pingingAuthor: '1', replyingMessage: '0', replyingVarName: '', message: '', spoiler: '0', storage2: '0', varName3: '', imgName: 'image', name: 'Canvas Send Image' }, 'Canvas Set Gif Option': { storage: '1', varName: '', type: '0', value: '', name: 'Canvas Set Gif Option' }, 'Store Canvas Info': { storage: '1', varName: '', info: '0', info2: '', storage2: '1', varName2: '', name: 'Store Canvas Info' } },

  subtitle (data) {
    return `${data.url}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['url', 'type', 'loop', 'delay', 'overlap', 'storage', 'varName'],

  html (isEvent, data) {
    return `
  <div>
    <a id="link" href='#'>Local URL</a> / Web URL:<br>
    <input id="url" class="round" type="text" value="resources/" placeholder="Support extension type (.png | .jpg | .gif)">
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Image Type:<br>
      <select id="type" class="round" onchange="glob.onChange(this)">
        <option value="0" selected>Auto (.gif / .png / .jpg / .webp)</option>
        <option value="1">Animted Images (Local Image only)</option>
        <option value="2">Still Image (.png / .jpg / .webp)</option>
      </select>
    </div>
    <div id="overlapOpt" style="padding-left: 3%; float: left; width: 35%;">
      Redraw Frame:<br>
      <select id="overlap" class="round">
        <option value="0" selected>Auto</option>
        <option value="1">True</option>
        <option value="2">False</option>
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

  init () {
    const { glob, document } = this
    document.getElementById('link').onclick = function () {
      require('child_process').execSync('start https://globster.xyz')
    }
    const gifOption = document.getElementById('gifOption')
    const overlapOpt = document.getElementById('overlapOpt')
    glob.onChange = function (event) {
      if (parseInt(event.value) === 2) {
        gifOption.style.display = 'none'
        overlapOpt.style.display = 'none'
      } else {
        gifOption.style.display = null
        overlapOpt.style.display = null
      }
    }
    glob.onChange(document.getElementById('type'))
  },

  async action (cache) {
    const data = this.Canvas.updateValue(cache.actions[cache.index])
    const type = parseInt(data.type)
    const loop = parseInt(this.evalMessage(data.loop, cache))
    const delay = parseInt(this.evalMessage(data.delay, cache))
    const overlap = parseInt(data.overlap)
    const url = this.evalMessage(data.url, cache)
    try {
      let image
      if (type !== 2) {
        image = await this.Canvas.createImage(url, { loop, delay, overlap })
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

  mod (DBM) {
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
      if (err.stack) console.error(err.stack)
    }
    if (!DBM.Actions.Canvas.CanvasJS) {
      try {
        if (process.arch !== 'x64') {
          const commandExists = DBM.Actions.getMods().require('command-exists')
          if (commandExists.sync('node')) {
            const arch = require('child_process').execSync('node -p "process.arch"').toString()
            if (arch === 'x64\n') {
              console.log(chalk.hex('00FF7F')(`Canvas changed node.js ${process.arch} to node.js x64`))
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
      const fs = require('fs')
      const path = this.solvePath('canvas_dependencies')
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
      let dependencies = this.Glob.sync(Path.join(path, '*'))
      const requiredDeps = { gifski: ['gifski.exe', 'gifski', 'https://github.com/ImageOptim/gifski/releases'], dwebp: ['dwebp.exe', 'dwebp', 'https://developers.google.com/speed/webp/download'], palette: ['palette.js', 'palette.js', 'https://github.com/google/palette.js/blob/master/palette.js'] }
      dependencies = dependencies.filter((dependency) => {
        if (process.platform !== 'win32') {
          return ['', '.js'].includes(require('path').extname(dependency))
        } else {
          return ['.exe', '.js'].includes(require('path').extname(dependency))
        }
      })
      this.dependencies = []
      dependencies.forEach((dependency) => {
        const fncName = Path.basename(dependency).replace(Path.extname(dependency), '')
        if (requiredDeps[fncName]) {
          this.dependencies[fncName] = dependency
          delete requiredDeps[fncName]
        }
      })
      if (Object.keys(requiredDeps).length > 0) {
        let errorMessage = 'Canvas dependencies missing:'
        for (const [dep, data] of Object.entries(requiredDeps)) {
          errorMessage += `\n${(process.platform !== 'win32') ? data[1] : data[0]} - please download ${dep} at ${data[2]}`
        }
        this.onError('', '', errorMessage)
      }
    }
    DBM.Actions.Canvas.loadDependencies()
    DBM.Actions.Canvas.DefaultValue = this.defaultValue
    DBM.Actions.Canvas.updateValue = function (action) { // add new value if data doesn't exist, for people who just update github file without refresh data
      const existAction = this.DefaultValue[action.name]
      if (existAction) {
        for (const [key, value] of Object.entries(existAction)) {
          if (typeof action[key] === 'undefined') {
            action[key] = value
          }
        }
      }
      return action
    }

    DBM.Actions.Canvas.JimpFnc = {
      param0 (fncName) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName]()
          }
        } else {
          jimp[fncName]()
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param1 (fncName, param1) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](param1)
          }
        } else {
          jimp[fncName](param1)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param2 (fncName, param1, param2) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1, 'mirror')
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](param1, param2)
          }
        } else {
          jimp[fncName](param1, param2)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param3 (fncName, param1, param2, param3) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        const jimp2 = DBM.Actions.Canvas.bridge(param1, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](jimp2, param2, param3)
          }
        } else {
          jimp[fncName](jimp2, param2, param3)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param5 (fncName, param1, param2, param3, param4, param5) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](param1, param2, param3, param4, param5) // width auto convert to Infinity if undefined
          }
        } else {
          jimp[fncName](param1, param2, param3, param4, param5)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      getBuffer (mine, cb) {
        try {
          if (typeof cb !== 'function') {
            throw new Error('cb must be a function')
          }
          cb(null, DBM.Actions.Canvas.toBuffer(DBM.Actions.Canvas.bridge(this, 0)))
        } catch (err) {
          cb(err)
        }
      },
      getBitmap () {
        const img = DBM.Actions.Canvas.loadImage(this)
        const { width, height } = img
        return { width, height }
      },
      drawImage (img1, img2, x, y) {
        for (let i = 0; i < img2.bitmap.width; i++) {
          for (let j = 0; j < img2.bitmap.height; j++) {
            const pos = (i * (img2.bitmap.width * 4)) + (j * 4)
            const pos2 = ((i + y) * (img1.bitmap.width * 4)) + ((j + x) * 4)
            const target = img1.bitmap.data
            const source = img2.bitmap.data
            for (let k = 0; k < 4; k++) {
              target[pos2 + k] = source[pos + k]
            }
          }
        }
        return img1
      }
    }

    DBM.Images.drawImageOnImage = function (img1, img2, x, y) {
      const jimp = DBM.Actions.Canvas.bridge(img1, 1)
      const jimp2 = DBM.Actions.Canvas.bridge(img2, 1)
      let tempImage = []
      if (Array.isArray(jimp)) {
        if (Array.isArray(jimp2)) {
          const maxFrame = Math.max(jimp.length, jimp2.length)
          let imgFrame = 0
          let img2Frame = 0
          for (let i = 0; i < maxFrame; i++) {
            tempImage.push(DBM.Actions.Canvas.JimpFnc.drawImage(jimp[imgFrame], jimp2[img2Frame], x, y))
            imgFrame = (imgFrame + 1 >= jimp.length) ? 0 : imgFrame + 1
            img2Frame = (img2Frame + 1 >= jimp2.length) ? 0 : img2Frame + 1
          }
        } else {
          for (let i = 0; i < jimp.length; i++) {
            tempImage.push(DBM.Actions.Canvas.JimpFnc.drawImage(jimp[i], jimp2, x, y))
          }
        }
      } else if (Array.isArray(jimp2)) {
        for (let i = 0; i < jimp2.length; i++) {
          tempImage.push(DBM.Actions.Canvas.JimpFnc.drawImage(jimp, jimp2[i], x, y))
        }
      } else {
        tempImage = DBM.Actions.Canvas.JimpFnc.drawImage(jimp, jimp2, x, y)
      }
      if (Array.isArray(tempImage)) {
        for (let i = 0; i < tempImage.length; i++) {
          if (i < img1.images.length) {
            img1.images[i] = DBM.Actions.Canvas.bridge(tempImage[i], 0).image
          } else {
            img1.images.push(DBM.Actions.Canvas.bridge(tempImage[i], 0).image)
            img1.totalFrames = img1.images.length
          }
        }
      } else {
        img1.image = DBM.Actions.Canvas.bridge(tempImage, 0).image
      }
    }

    DBM.Actions.Canvas.JimpImage = function (canvas, images) { // mainly for gif
      this.name = 'jimp'
      this.extensions = ['.gif']
      this.animated = true
      this.images = images // will hold jimp object here
      this.width = canvas.width
      this.height = canvas.height
      this.delay = canvas.delay // delay (fps)
      this.loop = canvas.loop // loop type, once or forever
      this.totalFrames = canvas.length
    }

    DBM.Actions.Canvas.Image = function (source, options) {
      this.name = 'canvas'
      if (Array.isArray(source)) {
        this.extensions = ['.gif']
        this.images = source
        this.animated = true
        this.width = options.width
        this.height = options.height
        this.delay = options.delay
        this.loop = options.loop
        this.totalFrames = source.length
      } else {
        this.extensions = ['.png', '.jpg', '.webp'] // sort by prefer
        this.image = source
        this.animated = false
      }

      // jimp fnc compability
      this.greyscale = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'greyscale')
      this.invert = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'invert')
      this.normalize = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'normalize')
      this.opaque = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'opaque')
      this.sepia = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'sepia')
      this.dither565 = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'dither565')

      this.blur = (param1) => DBM.Actions.Canvas.JimpFnc.param1.call(this, 'blur', param1)
      this.rotate = (param1) => DBM.Actions.Canvas.JimpFnc.param1.call(this, 'rotate', param1)
      this.pixelate = (param1) => DBM.Actions.Canvas.JimpFnc.param1.call(this, 'pixelate', param1)

      this.mirror = (param1, param2) => DBM.Actions.Canvas.JimpFnc.param2.call(this, 'mirror', param1, param2)
      this.resize = (param1, param2) => DBM.Actions.Canvas.JimpFnc.param2.call(this, 'resize', param1, param2)

      this.mask = (param1, param2, param3) => DBM.Actions.Canvas.JimpFnc.param3.call(this, 'mask', param1, param2, param3)
      this.composite = (param1, param2, param3) => DBM.Actions.Canvas.JimpFnc.param3.call(this, 'composite', param1, param2, param3)

      this.print = (param1, param2, param3, param4, param5) => DBM.Actions.Canvas.JimpFnc.param5.call(this, 'print', param1, param2, param3, param4, param5)

      this.bitmap = DBM.Actions.Canvas.JimpFnc.getBitmap.call(this)
      this.getBuffer = DBM.Actions.Canvas.JimpFnc.getBuffer
    }

    DBM.Actions.Canvas.loadImage = function (sourceImage) {
      if (sourceImage.constructor.name.toLowerCase() === 'jimp' || sourceImage.name.toLowerCase() === 'jimp') sourceImage = this.bridge(sourceImage, 0) // auto convert if it is jimp image
      if (sourceImage.animated) {
        const images = []
        for (let i = 0; i < sourceImage.images.length; i++) {
          const image = new this.CanvasJS.Image()
          image.src = sourceImage.images[i]
          images.push(image)
        }
        return images
      } else {
        const image = new this.CanvasJS.Image()
        image.src = sourceImage.image
        return image
      }
    }

    DBM.Actions.Canvas.createImage = async function (path, options) {
      const Path = require('path')
      const fs = require('fs')
      let type
      if (options && !!options.isCache) {
        type = 'local'
      } else {
        try {
          // eslint-disable-next-line no-new
          new URL(path)
          type = 'url'
        } catch (err) {
          type = 'local'
        }
      }
      if (type === 'local') {
        let files
        if (options && !!options.isCache) {
          files = this.Glob.sync(this.solvePath(path)).filter(file => ['.gif', '.webp', '.png', '.jpg'].includes(Path.extname(file).toLowerCase()))
        } else {
          files = [path]
        }
        if (files.length === 0) {
          throw new Error('Image not exist!')
        } else if (files.length === 1) {
          const extname = Path.extname(files[0]).toLowerCase()
          if (extname.startsWith('.gif')) {
            return await this.loadGif(files[0], options)
          } else if (extname.startsWith('.webp')) {
            const temp = fs.mkdtempSync(require('os').tmpdir() + Path.sep)
            require('child_process').execSync(`"${this.dependencies.dwebp}" "${files[0]}" -quiet -o "${temp}${Path.sep}temp.png"`)
            const img = 'data:image/png;base64,' + fs.readFileSync(`${temp}${Path.sep}temp.png`).toString('base64')
            const fsFnc = (process.version.startsWith('v16')) ? 'rmSync' : 'rmdirSync'
            fs[fsFnc](temp, { recursive: true })
            return new this.Image(img)
          } else {
            const image = await this.CanvasJS.loadImage(files[0])
            const canvas = this.CanvasJS.createCanvas(image.width, image.height)
            const width = image.width
            const height = image.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            if (options && !!options.isCache) {
              const imageData = ctx.getImageData(0, 0, width, height)
              if ([0, 1].includes(options.overlap) && options.data.length > 0) {
                const lastData = options.data[options.data.length - 1]
                const nowAlpha = imageData.data.filter((v, i) => (i + 1) % 4 === 0)
                const oldAlpha = lastData.filter((v, i) => (i + 1) % 4 === 0)
                const nowCanFill = nowAlpha.filter((v, i) => v === 0 && oldAlpha[i] > 0).length
                const nowFull = nowAlpha.filter(v => v > 0).length
                const oldFull = oldAlpha.filter(v => v > 0).length
                if ((options.overlap === 0 && nowFull + nowCanFill === oldFull) || options.overlap === 1) {
                  for (let d = 3; d < imageData.data.length; d += 4) {
                    if (imageData.data[d] === 0 && lastData[d] > 0) {
                      imageData.data[d] = lastData[d]
                      imageData.data[d - 1] = lastData[d - 1]
                      imageData.data[d - 2] = lastData[d - 2]
                      imageData.data[d - 3] = lastData[d - 3]
                    }
                  }
                }
              }
              options.data.push(Array.from(imageData.data))
              ctx.putImageData(imageData, 0, 0)
              const returnImg = canvas.toDataURL('image/png')
              return { returnImg, data: options.data, width, height } // getting biggest dimension
            } else {
              return new this.Image(canvas.toDataURL('image/png'))
            }
          }
        } else {
          return await this.loadGif(files, options)
        }
      } else if (type === 'url') {
        if (Path.extname(path).toLowerCase().startsWith('.webp')) {
          const res = await this.Fetch(path)
          const temp = fs.mkdtempSync(require('os').tmpdir() + Path.sep)
          fs.writeFileSync(`${temp}${Path.sep}temp.webp`, await res.buffer())
          require('child_process').execSync(`"${this.dependencies.dwebp}" "${temp}${Path.sep}temp.webp" -quiet -o "${temp}${Path.sep}temp.png"`)
          const img = 'data:image/png;base64,' + fs.readFileSync(`${temp}${Path.sep}temp.png`).toString('base64')
          const fsFnc = (process.version.startsWith('v16')) ? 'rmSync' : 'rmdirSync'
          fs[fsFnc](temp, { recursive: true })
          return new this.Image(img)
        } else if (Path.extname(path).toLowerCase().startsWith('.gif')) {
          return await this.loadGif(path, options)
        } else {
          const image = await this.CanvasJS.loadImage(path)
          const canvas = this.CanvasJS.createCanvas(image.width, image.height)
          const ctx = canvas.getContext('2d')
          ctx.drawImage(image, 0, 0)
          return new this.Image(canvas.toDataURL('image/png'))
        }
      }
    }

    DBM.Actions.Canvas.loadGif = async function (path, options) {
      const images = []
      const data = []
      let loop, delay, width, height
      if (Array.isArray(path)) {
        console.log('Auto picked for the first image')
        path = path[0]
      }
      if (require('path').extname(path) === '.gif') {
        const parsedGif = await this.PixelGif.parse(path)
        const canvas = this.CanvasJS.createCanvas(parsedGif[0].width, parsedGif[0].height)
        delay = parsedGif.map(i => i.delay).reduce((a, c) => a + c, 0) / parsedGif.length
        loop = (parsedGif.loop) ? parsedGif.loop : 0
        width = canvas.width
        height = canvas.height
        const ctx = canvas.getContext('2d')
        let imageData = ctx.getImageData(0, 0, width, height)
        const backupImageData = imageData
        const tmpImages = (await this.PixelGif.parse(path)).filter(image => image != null)
        for (let i = 0; i < tmpImages.length; i++) {
          imageData = backupImageData
          for (let d = 0; d < parsedGif[i].data.length; d++) {
            imageData.data[d] = parsedGif[i].data[d]
          }
          if ([0, 1].includes(options.overlap) && data.length > 0) {
            const lastData = data[data.length - 1]
            const nowAlpha = imageData.data.filter((v, i) => (i + 1) % 4 === 0)
            const oldAlpha = lastData.filter((v, i) => (i + 1) % 4 === 0)
            const nowCanFill = nowAlpha.filter((v, i) => v === 0 && oldAlpha[i] > 0).length
            const nowFull = nowAlpha.filter(v => v > 0).length
            const oldFull = oldAlpha.filter(v => v > 0).length
            if ((options.overlap === 0 && nowFull + nowCanFill === oldFull) || options.overlap === 1) {
              for (let d = 3; d < imageData.data.length; d += 4) {
                if (imageData.data[d] === 0 && lastData[d] > 0) {
                  imageData.data[d] = lastData[d]
                  imageData.data[d - 1] = lastData[d - 1]
                  imageData.data[d - 2] = lastData[d - 2]
                  imageData.data[d - 3] = lastData[d - 3]
                }
              }
            }
          }
          data.push(Array.from(imageData.data))
          ctx.putImageData(imageData, 0, 0)
          images.push(canvas.toDataURL('image/png'))
        }
      } else {
        const allWidth = []
        const allHeight = []
        for (let i = 0; i < path.length; i++) {
          const image = await this.createImage(path[i], { isCache: true, overlap: options.overlap, data }) // made create image without research it again, minimize the time for function
          data.push(image.data)
          images.push(image.returnImg)
          allWidth.push(image.width)
          allHeight.push(image.height)
        }
        delay = (options.delay) ? options.delay : 100 // default value (ms)
        loop = (options.loop) ? options.loop : 0 // default value
        width = Math.max(...allWidth)
        height = Math.max(...allHeight)
      }
      return new this.Image(images, { delay, loop, width, height })
    }
  }
}
