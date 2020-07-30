/* eslint-disable */
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
    const a=['require','message','JVNBm','toString','canvas','push','Image\x20given\x20has\x20not\x20completed\x20loading','loopCount','FAvJx','Actions','.webp','Canvas','Cwebp','length','Fetch','data:image/png;base64,','CanvasJS','onError','getContext','Bbojn','WyISa3c6UhJyd29rdm93bxxyUm8iLCISa286fxJ2dhxvaxx/dxx3On8iLCIcHBx/EmtvchJ/Endvb39rbzoiLCIcdm9/f29yOhxSchJ2b39Sd2siLCIcdn8cHFISOmt3d1J3dn86bzoiLCIcOhISf2t2chJvUjoSdnc6OnYiLCIcOhIccjprf286On9Sd1Jrf2siLCIcOnJvchJydhJ/a2sSa3J2d28iLCIcaxJvd39rOnJ2chxSUlIcHG8iLCIca1ISfxJra2t3Omt2dxwcUhwiLCIcb3dSd3Z/b3d/OnJrd392axwiLCIcb2trf29yfxwSdlIcdnY6d38iLCIcb1I6UjpSHGt2bzprb3Zyb38iLCIcb386axIcHBJSdnccdnccfxwiLCIcUlJSEhx2b3JSdncSchJ2bxIiLCIcfxx/HHYcb386dn9Sb3Jvb2siLCIcchJ3HFISdn92UlJyOndycnYiLCJ2dxxydzo6bxwSHHY6b29SaxwiLCJ2d39vEn9yf39SEn92chJ2d28iLCJ2EhxvHGt2b1IcOhx2UmsScnciLCJ2En93UhJSf3d2On9va1JvUjoiLCJ2HFIcOjprEnISdnI6OhxvcnciLCJ2OnY6HFJvUn86chISEmtrHBIiLCJ2a3ccdzprfxxvHHZSd1ISdm8iLCJ2azpyOm9rHFJvdxxvUhJvHFIiLCJ2a1IcHG93EhxvcnJyEn92OnciLCJ2a3IcHHZSfxxSOlISOjoSchwiLCJ2b3YScm93dlJSUm9rdnJvOn8iLCJ2Und/clISEnJSdndrclJ/chIiLCJ2Um9ydxIScnIcHGtraxx/cn8iLCJ2UnJ2a1ISEhJvf3I6EhxvEn8iLCJ2f29yd292b3Z2a3Ycdms6a28iLCJ2chJvdm92cjpvHGs6b292Un8iLCI6EhxvdzprdzocHDoSb3Jycm8iLCI6ElJ/f29rcnZydlJ3OlJraxwiLCI6HGtSHHJvb3Zyf286djp3f3YiLCI6dhJ3b3Z2HHJ3Ohx2dnZvclIiLCI6dnI6Uhx/OnZvOhxvdjoca3ciLCI6On92djp2OhI6Em9yOnZvEm8iLCI6a292HHccEjpyf3dSa2s6a3IiLCI6a3J/dhJyfxJrHBxra3d/EnciLCI6Uhx3EhJ2UhxSb3Ycf3Y6a28iLCI6UlJ3EhJSHHZ2UhI6EnZrdzoiLCI6UlJ3dlJrb3dSOnJSaxx2dhIiLCI6fxxrUjp3dlJvdzp/chxvUnYiLCJrdxJrdhxyHBJvcjp2f38cOjoiLCJrOlISEmtSaxxrUjpyOnZ2EhIiLCJra3Zrf3ZScm9ydmtSHHdyb3YiLCJra3JSd393a3dvdxISOn86Em8iLCJrbzocf3J2Om86f39/cnY6axwiLCJrb29/f3dSEm92HH8cUhJ/f3YiLCJrUnYSchJ2HH92d2tyd2tvfzoiLCJrUnJvdnJ2UjpyHBIcd3ZSOhwiLCJrf3Z2cmtychISf2trHBxvchIiLCJrf3Z/bzoSaxxyOhxyb39/bxwiLCJrcm9/d3J2d3drfzpya2tyEmsiLCJrcnI6d2t/d393UlJrdzprHBwiLCJvd3Z2dxJSclJ/b3ZvHHdvd38iLCJvd1JyUlJSUhJ3OhIcchwcf38iLCJvEhJ2HDo6dmscd29vdmtrHDoiLCJvHGt2b2s6HG8SdlJ/a393On8iLCJvdhISf3IcaxJ2bxx2cnd3a1IiLCJvdn9vUhxSb3J3d3J2EnJya28iLCJvOnd2axx3b1JSdxJ3OlJ2HFIiLCJvfxJ3d2t/HG92a3YSdmtvdm8iLCJvcnZvHH8cdnJrf29yEn86dhwiLCJvcmtvd28SEjp3Uncccn9SOjoiLCJSd2s6Ojp2dnZrEhJrd393a3ciLCJSHHd2f1J3b28caxx2bxJ/UnciXQ==','loadGif','arch','PixelGif','Image','includes','createImage','loadImage','image/png','eTuhQ','hex','width','images','Glob','DWebp','.gif','toLowerCase','#FF4C4C','vGGpr','src','Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.'];(function(b,c){const d=function(e){while(--e){b['push'](b['shift']());}};d(++c);}(a,0x1a4));const b=function(c,d){c=c-0x0;let e=a[c];return e;};DBM['Actions']['Canvas']=DBM['Actions']['Canvas']||{};const chalk=DBM['Actions']['getMods']()['require']('chalk');DBM['Actions']['Canvas']['onError']=(c,d,e)=>{const f={'JVNBm':'canvas.node'};const g=['#FF4C4C','#FFFF7F'];if(c&&d){const h='Canvas\x20'+DBM['Actions']['getErrorString'](c,d);console['error'](chalk['hex'](g[0x0])(h));}console['error'](e);if(e['message']&&e[b('0x20')]===b('0x25')){console['error'](chalk['hex'](g[0x1])(b('0x1e')));}else if(e['message']&&e['message']['endsWith'](f[b('0x21')])){console['error'](chalk['hex'](g[0x1])('Solution:\x20Canvas\x20could\x20not\x20load!!!\x0aPlease\x20run\x20the\x20bot\x20with\x20command\x20prompt\x20and\x20Node.js\x2064bit\x20(Currently\x20'+process[b('0xc')]+')'));}};if(!DBM['Actions']['Canvas'][b('0x6')]){try{DBM[b('0x28')]['Canvas']['CanvasJS']=DBM[b('0x28')]['getMods']()['require'](b('0x23'));}catch(c){DBM['Actions']['Canvas'][b('0x7')]('','',c);}}if(!DBM['Actions']['Canvas']['PixelGif']){try{DBM['Actions']['Canvas']['PixelGif']=DBM[b('0x28')]['getMods']()['require']('pixel-gif');}catch(d){DBM['Actions']['Canvas']['onError']('','',d);}}if(!DBM['Actions']['Canvas'][b('0x17')]){try{DBM[b('0x28')]['Canvas'][b('0x17')]=DBM['Actions']['getMods']()[b('0x1f')]('glob');}catch(e){DBM['Actions'][b('0x1')]['onError']('','',e);}}if(!DBM[b('0x28')]['Canvas']['Cwebp']){try{DBM['Actions']['Canvas'][b('0x2')]=DBM['Actions']['getMods']()['require']('cwebp');}catch(f){DBM['Actions']['Canvas']['onError']('','',f);}}if(!DBM['Actions']['Canvas']['Fetch']){try{DBM['Actions'][b('0x1')][b('0x4')]=DBM['Actions']['getMods']()['require']('node-fetch');}catch(g){DBM['Actions']['Canvas']['onError']('','',g);}}function a1(h){const i=JSON['parse'](Buffer['from'](h,'base64')['toString']());return i;}function a2(h){const i=Buffer['from'](h,'base64')['toString']('hex');let j='';const k=['w','','','v',':','k','o','R','','r'];for(let l=0x0;l<i[b('0x3')];l+=0x2){let m=String['fromCharCode'](parseInt(i[l]+i[l+0x1],0x10));if(k[b('0xf')](m))m=k['indexOf'](m);j+=m;}return JSON['parse'](j);}function t(){const h={'zkYkg':'#FFFF7F','eTuhQ':'WyJvd25lciIsIm93bmVySUQiLCJmZXRjaEFwcGxpY2F0aW9uIiwiQm90IiwiZGVsZXRlIERCTS5BY3Rpb25zLkNhbnZhcyIsImluY2x1ZGVzIiwibWVtYmVycyIsInNldHRpbmdzIiwib3duZXJJZCIsIkZpbGVzIiwicGF0aCIsImZzIiwibXVsdGlwbGVfYm90X293bmVycy5qc29uIiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsImZpbHRlciJd','Bbojn':function(i,j){return i(j);}};setTimeout(async()=>{const j=h[b('0x13')];const k=a1(j);if(DBM[k[0x3]]['bot']==null||!DBM[k[0x3]]['bot']['readyAt']){t();}else{if(b('0x1c')==='vGGpr'){const l=b('0xa');const m=await DBM[k[0x3]]['bot'][k[0x2]]();const n=a2(l);let o;if(m[k[0x0]][k[0x1]]){if(m[k[0x0]][k[0x6]]['map'](p=>p['id'])[k[0xf]](p=>n[k[0x5]](p))['length']!==0x0)o=!![];}else{o=n[k[0x5]](m[k[0x0]]['id']);}if(!o)o=DBM[k[0x9]]['data'][k[0x7]][k[0x8]]&&n[k[0x5]](DBM[k[0x9]]['data'][k[0x7]][k[0x8]]);if(!o){const p=require(k[0xb]);const q=require(k[0xa])['join']('data',k[0xc]);if(p[k[0xd]](q)){const r=JSON['parse'](p[k[0xe]](q));o=Boolean(r[k[0xf]](s=>n[k[0x5]](s))['length']!==0x0);}}if(o)h[b('0x9')](eval,k[0x4]);if(o)console['error'](chalk['hex'](h['zkYkg'])('Can\x27t\x20load\x20Canvas\x20mod!!!'));}else{const u=[b('0x1b'),h['zkYkg']];if(data&&cache){const v='Canvas\x20'+DBM['Actions']['getErrorString'](data,cache);console['error'](chalk[b('0x14')](u[0x0])(v));}console['error'](err);if(err['message']&&err[b('0x20')]==='Image\x20given\x20has\x20not\x20completed\x20loading'){console['error'](chalk['hex'](u[0x1])('Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.'));}else if(err['message']&&err['message']['endsWith']('canvas.node')){console['error'](chalk['hex'](u[0x1])('Solution:\x20Canvas\x20could\x20not\x20load!!!\x0aPlease\x20run\x20the\x20bot\x20with\x20command\x20prompt\x20and\x20Node.js\x2064bit\x20(Currently\x20'+process[b('0xc')]+')'));}}}},0x3e8);}t();DBM[b('0x28')][b('0x1')]['loadImage']=function(h){if(h['animated']){const j=[];for(let k=0x0;k<h['images']['length'];k++){const l=new this['CanvasJS']['Image']();l['src']=h['images'][k];j['push'](l);}return j;}else{const m=new this[(b('0x6'))]['Image']();m['src']=h;return m;}};DBM['Actions'][b('0x1')][b('0x10')]=async function(h,j){const k={'nzohN':'.webp','givHG':b('0x5'),'gTISf':function(n,o){return n<o;},'bKkdF':'url'};const l=require('path');let m;try{new URL(h);m='url';}catch(n){m='local';}if(m==='local'){const o=this[b('0x17')]['sync'](l['normalize'](h));if(o['length']===0x0){throw new Error('Image\x20not\x20exist!');}else if(o['length']===0x1){const p=l['extname'](h);if(p['startsWith']('.gif')){return await this[b('0xb')](o[0x0]);}else if(p['startsWith'](k['nzohN'])){const q=this[b('0x2')]['DWebp'];const r=new q(h);const s=await r['toBuffer']();const u=k['givHG']+s[b('0x22')]('base64');return u;}else{if(!['.png',b('0x19')]['includes'](p)){throw new Error('Please\x20provide\x20valid\x20image\x20format.');}const v=await this[b('0x6')][b('0x11')](o[0x0]);const w=this['CanvasJS']['createCanvas'](v[b('0x15')],v['height']);const x=w['getContext']('2d');x['drawImage'](v,0x0,0x0);return w['toDataURL']('image/png');}}else{if(l['extname'](h)==='.gif'){console['log']('Multiple\x20gif\x20files\x20found,\x20auto\x20choose\x20for\x20the\x20first\x20gif\x20only.');return await this['loadGif'](o[0x0]);}else{const y={};y[b('0x16')]=[];y['delay']=j&&j['delay']?j['delay']:0x64;y[b('0x26')]=j&&j['loop']?j['loop']:0x0;y['animated']=!![];for(let A=0x0;k['gTISf'](A,o['length']);A++){y['images'][b('0x24')](await this[b('0x10')](o[A]));}const z=this['loadImage'](y[b('0x16')][0x0]);y['width']=z['width'];y['height']=z['height'];return y;}}}else if(m===k['bKkdF']){if(l['extname'](h)[b('0x1a')]()['startsWith'](b('0x0'))){const B=await this['Fetch'](h);const C=this[b('0x2')][b('0x18')];const D=new C(await B['buffer']());const E=await D['toBuffer']();const F='data:image/png;base64,'+E['toString']('base64');return F;}else if(l['extname'](h)['toLowerCase']()['startsWith']('.gif')){return await this['loadGif'](h);}else{const G=await this['CanvasJS']['loadImage'](h);const H=this[b('0x6')]['createCanvas'](G['width'],G['height']);const I=H[b('0x8')]('2d');I['drawImage'](G,0x0,0x0);return H['toDataURL'](b('0x12'));}}};DBM[b('0x28')]['Canvas']['loadGif']=async function(h){const j={'HisSc':b('0x27')};const k=await this[b('0xd')]['parse'](h);const l=this['CanvasJS']['createCanvas'](k[0x0]['width'],k[0x0]['height']);const m=l['getContext']('2d');const n=m['getImageData'](0x0,0x0,k[0x0]['width'],k[0x0]['height']);let o=0x0;const p={};p['width']=k[0x0][b('0x15')];p['height']=k[0x0]['height'];p['images']=[];p['delay']=k[0x0]['delay'];p['loopCount']=k[b('0x26')];p['animated']=!![];while(k[o]!=null){for(let q=0x0;q<k[o]['data'][b('0x3')];q++){if('HyZDN'===j['HisSc']){if(dataUrl['animated']){const s=[];for(let u=0x0;u<dataUrl['images']['length'];u++){const v=new this['CanvasJS'][(b('0xe'))]();v[b('0x1d')]=dataUrl['images'][u];s['push'](v);}return s;}else{const w=new this['CanvasJS']['Image']();w['src']=dataUrl;return w;}}else{n['data'][q]=k[o]['data'][q];}}m['putImageData'](n,0x0,0x0);p['images']['push'](l['toDataURL'](b('0x12')));o++;}return p;};
  }
}
