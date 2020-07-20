<div align="center">
  <h1>
    <img src="https://silversunset.net/dbm/favicon.ico" width="30px"> Discord Bot Maker Canvas Mod
  </h1>
  <p>
    Image mod interact with default image action
  </p>
  <a href="https://github.com/LeonZ2019/dbm-canvas/releases">
    <img src="https://img.shields.io/github/v/release/LeonZ2019/dbm-canvas?style=flat">

  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/LeonZ2019/dbm-canvas?style=flat">
  </a>
</div>


[Installation](#installation)
[NPM Module Required!!!](#npmModule)
[Documentation](#documentation)
[Image Format](#imageFormat)
[Mod List](#modList)

## Installation
- Download the actions folder from above.
- Copy and paste all the files and folder to your bot's directory actions folder

## NPM Module Required!!!
- Basic Section
 - [x] canvas
 - [x] cwebp
 - [x] glob
 - [x] node-fetch
- GIF Section
 - [x] gif-encoder-2
 - [x] pixel-gif
- Font Section
 - [x] opentype.js
- Image Recognize Section
 - [x] tesseract.js

## Documentation
### Basic Image Manipulate
* [Create Image](#createImage)
* [Draw Image](#drawImage)
* [Draw Text](#drawText)
### Advanced Image Manipulate
* [Image Options](#controlImage)
* [Crop Image](#cropImage)
* [Edit Border](#editBorder)
* [Filter Image](#Filter)
* [Generate Progress Bar](#generateProgress)
* [Image Recognize](#Recognize)
### Others
* [Image Buffer](#toBuffer)
* [GIF Image Buffer](#GifToBuffer)
* [Discord Attachment](#toAttachment)
* [Image Bridge](#imageBridge)

## Create Image
```js
DBM.Actions.Canvas.createImage(url) => Promise[Image]
```
Image type support png, jpg, gif webp(still image) and of course base64 image, it can be web image or local
- [String] **`url`** source image from local or url
```
this.Canvas.createImage('https://www.website.com/image.png').then((image) => {
})

// or with async/await:
const image = await this.Canvas.createImage('.\resources\img_**.png')
}
```

## Draw Image
```js
DBM.Actions.Canvas.drawImage(img1, img2, options) => [Image]
```
Draw img2 on top of img1 with ton of options
- [Image] **`img1`** **`img2`** image generate from canvas
- [Object] **`options`**
  - [Integer] **`x`** Position x of left of img1
  - [Integer] **`y`** Position y of top of img1
  - [Integer] **`opacity`** or name as transparent, which control img2 when it draw, not effect on img1, effective value range is from 0 to 100
  - [Integer | String] **`effect`** draw effect for img2, exist value is `'mask'` or `1`, leave it empty for draw overlay
  - [Boolean] **`expand`** it will expand img1 size if img2 is large than img1
```js
this.Canvas.drawImage(img1 ,img2, { x: 5, y: 5, opacity: 100, expand: false })
```

## Draw Text
```js
DBM.Actions.Canvas.drawText(img, text, options) => [Image]
```
Draw text on above image with support font TrueType and OpenType
- [Image] **`img`** image generate from canvas
- [String] **`text`** Text that will write on the image
- [Object] **`options`**
  - [Integer] **`x`** Position x of img
  - [Integer] **`y`** Position y of img
  - [String] **`color`** Color of the text, example `'#000000'` or `'000000'`
  - [Integer] **`size`** Size of the font
  - [Integer | String] **`align`** Alignment for the text, value should be `0` to `8` or `'TL'`, `'TC'`, `'TR'`, `'ML'`, `'BL'`...
  - [String] **`type`** Fill type, exist value is `'fill'` or `'stroke'`
  - [Integer] **`maxWidth`** Width from start of the text to end of it, if set to `80` the width of text will below or equal to the maxWidth
  - [String] **`font`** The path of the font file
  - [Boolean] **`antialias`** anti alias for the text
  - [Boolean] **`rotate`** Rotate for the text, effective range should be `0` - `359`
```js
this.Canvas.drawText(img, 'Hello World', { x: 5, y: 5, color: '#000000', size: 20, align: 'TL', type: 'fill', maxWidth: 40, font: 'fonts\arial.ttf', rotate: 180, antialias: true})
```

## Image Options
```js
DBM.Actions.Canvas.controlImage(img, options) => [Image]
```
Control image function includes resize or scale, flip and rotate
- [Image] **`img`** image generate from canvas
- [Object] **`options`**
  - [Object] **`resize`** Options for resize
    - [Integer] **`width`** width for the image
    - [Integer] **`height`** height for the image
    - [Boolean] **`aspectRatio`** Set `true` to keep the image look same after scale
  - [Integer | String] **`flip`** Flip image with 3 possible way, `0` - `3` or `horizontal`, `vertical` and `diagonal`
  - [INteger] **`rotate`** Rotate the image, the width and the height will auto change to size after rotate
```js
this.Canvas.controlImage(img, { resize: { width: 500, aspectRatio: true }, rotate: 90 })
```

## Crop Image
```js
DBM.Actions.Canvas.cropImage(img, options)
```
Crop image to smaller or bigger
- [Image] **`img`** image generate from canvas
- [Object] **`options`**
  - [Integer | String] **`width`** Width of the new image size, example `50` or `'125%'`
  - [Integer | String] **`height`** Height of the new image size, example `25` or `'75%'`
  - [Integer | String] **`align`** Alignment for the cropping position, value should be `0` to `9` or `'TL'`, `'TC'`, `'TR'`, `'ML'`, `'BL'`...
  - [Integer | String] **`align2`** Alignment for the cropping position, if `align` value is `9`, then this parameter is required, value should be `0` to `8` or `'TL'`, `'TC'`, `'TR'`, `'ML'`, `'BL'`...
  - [Integer] **`x`** Position x for the alignment
  - [Integer] **`y`** Position y for the alignment
```js
this.Canvas.cropImage(img, { width: '50%', height: '50%', align: 9, align2: 4, x: 15, y: 25 })
```

## Edit Border
```js
DBM.Actions.Canvas.editBorder(img, type, radius) => [Image]
```
Edit image border to get a better look, bounder either is circle or round
- [Image] **`img`** image generate from canvas
- [Integer | String] **`type`** Border type, circle type value is `'circle'` | `1` and round type is `'corner'` or `0`
- [Integer] **`radius`** If border type is `corner`, this parameter is required
```js
this.Canvas.editBorder(img , 'corner', 50)
```

## Filter Image
```js
DBM.Actions.Canvas.Filter(img, type, value) => [Image]
```
Add some filter to the image
- [Image] **`img`** image generate from canvas
- [Integer | String] **`type`** Type for the filter, value should be `0` - `8` or `'blur'`, `'huerotate'`, '`brightness`', '`contrast`', '`grayscale`', '`invert`', '`opacity`', '`saturate`' and '`sepia`'
- [Integer] **`value`** Total percent of the filter will add to image, effective range should be `0` - `100`
```js
this.Canvas.Filter(img, 'huerotate', 50)
```

## Generate Progress Bar
```js
DBM.Actions.Canvas.generateProgress(options, lineCap, lineWidth, percent, color) => [Image]
```
Generate progress bar from options and other info
- [Object] **`options`**
  - [Integer | String] **`type`** Type for progress bar, circle type value is `'circle'` | `1` and basic type is `'basic'`, `'normal` or `0`
  - [Integer] **`width`** Width of progress bar if type is `basic`, else is radius for `circle`
  - [Integer] **`height`** Height of progress bar if type is `basic`, else if dimention for total width and height of the image for `circle`
- [Integer | String] **`lineCap`** Line cap for basic style is `0` or `'square'` and for round type is `1` or `'round'`
- [Integer] **`lineWidth`** Line width is stroke width
- [Integer] **`percent`** Percent available from `0` to `100`
- [String] **`color`** Color of the progress bar, example `'#000000'` or `'000000'`
```js
this.Canvas.generateProgress({ type: 'circle', width: 100, height: 240 }, 'round', 20, 50, '#000000')
```

## ImageRecognize
```js
DBM.Actions.Canvas.Recognize(img, options) => Promise[String]
```
Text recognize from tesseract.js
- [Image] **`img`** image generate from canvas
- [Object] **`options`**
  - [Integer] **`left`** Left of the rectangle that scan
  - [Integer] **`top`** Top of the rectangle that scan
  - [Integer] **`width`** Width of the rectangle
  - [Integer] **`height`** Height of the rectangle
  - [String] **`lang`** Target language, it can be `'eng+chi_tra'` for English and Traditional Chinese
  - [Integer] **`offset`** Offset for the rectangle if max is more than 1
  - [String] **`offsetType`** Offset type for the offset value, value should be `'percentage'`, `'percent'`, `'pixel'` and `'px'`
  - [Integer] **`max`** Max try for each image, the more try doesnt mean will have better result
  - [Boolean] **`forceMax`** If found a perfect result and `forceMax` is false, it will stop the work
```js
this.Canvas.Recognize(img, { left: 0, top: 0, width: 200, height: 200, lang: 'eng', offset: 5, offsetType: 'pixel', max: 3, forceMax: false, acceptRange: 80, forceAccept: true, debug: false })
```

## Image Buffer
```js
DBM.Actions.Canvas.toBuffer(img) => [Buffer]
```
Convert still image to buffer
- [Image] **`img`** image generate from canvas
```js
const buffer = DBM.Actions.Canvas.toBuffer(img)
require('fs').writeFileSync('resources\image.png', buffer)
```

## GIF Image Buffer
```js
DBM.Actions.Canvas.GifToBuffer(img) => [Buffer]
```
Convert gif or animated image to buffer
- [Image] **`img`** image generate from canvas
```js
const buffer = DBM.Actions.Canvas.GifToBuffer(img)
require('fs').writeFileSync('resources\image.gif', buffer)
```

## Discord Attachment
```js
DBM.Actions.Canvas.toAttachment(img ,name) => [Discord Attachment]
```
Convert image to discord attachment
- [Image] **`img`** image generate from canvas
- [String] **`name`** name for the attachment, example `'image.png'` or `'image'`
```js
this.Canvas.toAttachment(img, 'image')
```

## Image Bridge
```js
DBM.Actions.Canvas.bridge(img, type) => Promise[image]
```
Function convert Canvas image to Jimp image or Jimp image to Canvas image
- [Image] **`img`** target image
- [Integer] **`type`** value for (C->J) is `0` and (J->C) is blank or any number that value is not `0`
```js
this.Canvas.bridge(img, 1)
```

## Image Format
- Still Image
  - [String] Type
  - Store in `base64` format, it should start with `data:image/png;base64`
  - Mainly format from `png`, `jpg`, `webp`, or `base64`
- Animated Image
  - [Object] Type
    - [Integer] **`width`** Width of the gif
    - [Integer] **`height`** Height of the gif
    - [Array] **`images`** Array images of the gif
      - [String] **`item`** Encoding in `base64` format
    - [Integer] **`delay`** Delay for the each frame
    - [Integer] **`loopCount`** Loop for the gif, if is `0`
  - Mainly format from `gif` or multiple local png image

## Mod List
1. Canvas Create Image
2. Canvas Create Background
3. Canvas Crop Image
4. Canvas Draw Image on Image
5. Canvas Draw Text on Image
6. Canvas Edit Image Border
7. Canvas Generate Progress Bar
8. Canvas Gif to Png
9. Canvas Image Bridge
10. Canvas Image Filter
11. Canvas Image Options
12. Canvas Image Recognize
13. Canvas Save Image
14. Canvas Send Image
15. Canvas Set Gif Option
16. Store Canvas Info
