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
    const a=['bot','CanvasJS','base64','from','loadImage','JRzBn','GppkH','images','Actions','animated','yIrWy','Cwebp','getErrorString','.png','loopCount','loadGif','toString','image/png','Canvas','Image\x20not\x20exist!','Canvas\x20','SxBTv','Glob','url','drawImage','includes','length','map','hex','height','delay','toBuffer','pixel-gif','DWebp','parse','message','Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.','.gif','loop','AAzeb','width','cwebp','getMods','Image','glob','data','onError'];(function(b,c){const d=function(e){while(--e){b['push'](b['shift']());}};d(++c);}(a,0x14c));const b=function(c,d){c=c-0x0;let e=a[c];return e;};DBM['Actions']['Canvas']=DBM[b('0x5')]['Canvas']||{};const chalk=DBM['Actions'][b('0x27')]()['require']('chalk');DBM['Actions']['Canvas']['onError']=(c,d,e)=>{const f=['#FF4C4C','#FFFF7F'];if(c&&d){const g='Canvas\x20'+DBM[b('0x5')]['getErrorString'](c,d);console['error'](chalk['hex'](f[0x0])(g));}console['error'](e);if(e['message']&&e['message']==='Image\x20given\x20has\x20not\x20completed\x20loading'){console['error'](chalk['hex'](f[0x1])(b('0x21')));}else if(e[b('0x20')]&&e['message']['endsWith']('canvas.node')){console['error'](chalk[b('0x19')](f[0x1])('Solution:\x20Canvas\x20could\x20not\x20load!!!\x0aPlease\x20run\x20the\x20bot\x20with\x20command\x20prompt\x20and\x20Node.js\x2064bit\x20(Currently\x20'+process['arch']+')'));}};if(!DBM['Actions'][b('0xf')]['CanvasJS']){try{DBM['Actions'][b('0xf')][b('0x2d')]=DBM['Actions']['getMods']()['require']('canvas');}catch(c){DBM['Actions']['Canvas']['onError']('','',c);}}if(!DBM['Actions']['Canvas']['PixelGif']){try{DBM['Actions']['Canvas']['PixelGif']=DBM[b('0x5')]['getMods']()['require'](b('0x1d'));}catch(d){DBM['Actions'][b('0xf')]['onError']('','',d);}}if(!DBM['Actions']['Canvas'][b('0x13')]){try{DBM['Actions']['Canvas']['Glob']=DBM[b('0x5')]['getMods']()['require'](b('0x29'));}catch(e){DBM['Actions']['Canvas'][b('0x2b')]('','',e);}}if(!DBM[b('0x5')]['Canvas']['Cwebp']){try{DBM['Actions']['Canvas'][b('0x8')]=DBM['Actions'][b('0x27')]()['require'](b('0x26'));}catch(f){DBM['Actions']['Canvas']['onError']('','',f);}}if(!DBM[b('0x5')]['Canvas']['Fetch']){try{DBM[b('0x5')]['Canvas']['Fetch']=DBM['Actions']['getMods']()['require']('node-fetch');}catch(g){DBM['Actions'][b('0xf')]['onError']('','',g);}}function a1(h){const i=JSON['parse'](Buffer['from'](h,b('0x2e'))[b('0xd')]());return i;}function a2(h){const i={'AHsZt':'hex'};const j=Buffer[b('0x0')](h,'base64')[b('0xd')](i['AHsZt']);let k='';const l=['w','','','v',':','k','o','R','','r'];for(let m=0x0;m<j['length'];m+=0x2){let n=String['fromCharCode'](parseInt(j[m]+j[m+0x1],0x10));if(l['includes'](n))n=l['indexOf'](n);k+=n;}return JSON[b('0x1f')](k);}function t(){const h={'yIrWy':function(i,j){return i===j;}};setTimeout(async()=>{const j='WyJvd25lciIsIm93bmVySUQiLCJmZXRjaEFwcGxpY2F0aW9uIiwiQm90IiwiZGVsZXRlIERCTS5BY3Rpb25zLkNhbnZhcyIsImluY2x1ZGVzIiwibWVtYmVycyIsInNldHRpbmdzIiwib3duZXJJZCIsIkZpbGVzIiwicGF0aCIsImZzIiwibXVsdGlwbGVfYm90X293bmVycy5qc29uIiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsImZpbHRlciJd';const k=a1(j);if(DBM[k[0x3]]['bot']==null||!DBM[k[0x3]][b('0x2c')]['readyAt']){if('JRzBn'!==b('0x2')){const m=JSON[b('0x1f')](Buffer['from'](d,'base64')[b('0xd')]());return m;}else{t();}}else{if(h[b('0x7')]('edWvl','edWvl')){const m='WyISa3c6UhJyd29rdm93bxxyUm8iLCISa286fxJ2dhxvaxx/dxx3On8iLCISf3YcOhJSdmsSEjoScjpyOjoiLCIcHBx/EmtvchJ/Endvb39rbzoiLCIcdm9/f29yOhxSchJ2b39Sd2siLCIcdn8cHFISOmt3d1J3dn86bzoiLCIcOhISf2t2chJvUjoSdnc6OnYiLCIcOhIccjprf286On9Sd1Jrf2siLCIcOnJvchJydhJ/a2sSa3J2d28iLCIcaxJvd39rOnJ2chxSUlIcHG8iLCIca1ISfxJra2t3Omt2dxwcUhwiLCIcb3dSd3Z/b3d/OnJrd392axwiLCIcb2trf29yfxwSdlIcdnY6d38iLCIcb1I6UjpSHGt2bzprb3Zyb38iLCIcb386axIcHBJSdnccdnccfxwiLCIcUlJSEhx2b3JSdncSchJ2bxIiLCIcfxx/HHYcb386dn9Sb3Jvb2siLCIccnccEm9/dhx3EnZrb2tyUnYiLCIcchJ3HFISdn92UlJyOndycnYiLCJ2dxxydzo6bxwSHHY6b29SaxwiLCJ2d39vEn9yf39SEn92chJ2d28iLCJ2EhIcd29Sf3JSUmt2b3d3d3ciLCJ2EhxvHGt2b1IcOhx2UmsScnciLCJ2En93UhJSf3d2On9va1JvUjoiLCJ2HFIcOjprEnISdnI6OhxvcnciLCJ2OnY6HFJvUn86chISEmtrHBIiLCJ2a3ccdzprfxxvHHZSd1ISdm8iLCJ2azpyOm9rHFJvdxxvUhJvHFIiLCJ2a1IcHG93EhxvcnJyEn92OnciLCJ2a3IcHHZSfxxSOlISOjoSchwiLCJ2b3YScm93dlJSUm9rdnJvOn8iLCJ2Und/clISEnJSdndrclJ/chIiLCJ2Um9ydxIScnIcHGtraxx/cn8iLCJ2UnJ2a1ISEhJvf3I6EhxvEn8iLCJ2f29yd292b3Z2a3Ycdms6a28iLCJ2chJvdm92cjpvHGs6b292Un8iLCI6EhxvdzprdzocHDoSb3Jycm8iLCI6ElJ/f29rcnZydlJ3OlJraxwiLCI6HGtSHHJvb3Zyf286djp3f3YiLCI6dhJ3b3Z2HHJ3Ohx2dnZvclIiLCI6dnI6Uhx/OnZvOhxvdjoca3ciLCI6On92djp2OhI6Em9yOnZvEm8iLCI6a292HHccEjpyf3dSa2s6a3IiLCI6a3J/dhJyfxJrHBxra3d/EnciLCI6Uhx3EhJ2UhxSb3Ycf3Y6a28iLCI6Um9/dzpvUm86Ond/ElJvf28iLCI6UlJ3EhJSHHZ2UhI6EnZrdzoiLCI6UlJ3dlJrb3dSOnJSaxx2dhIiLCI6fxxrUjp3dlJvdzp/chxvUnYiLCJrdxJrdhxyHBJvcjp2f38cOjoiLCJrOlISEmtSaxxrUjpyOnZ2EhIiLCJra3Zrf3ZScm9ydmtSHHdyb3YiLCJra3JSd393a3dvdxISOn86Em8iLCJrbzocf3J2Om86f39/cnY6axwiLCJrb29/f3dSEm92HH8cUhJ/f3YiLCJrUnYSchJ2HH92d2tyd2tvfzoiLCJrUnJvdnJ2UjpyHBIcd3ZSOhwiLCJrf3Z2cmtychISf2trHBxvchIiLCJrf3Z/bzoSaxxyOhxyb39/bxwiLCJrcm9/d3J2d3drfzpya2tyEmsiLCJrcnI6d2t/d393UlJrdzprHBwiLCJvd3Z2dxJSclJ/b3ZvHHdvd38iLCJvdzpvbxISdxJrUlJ2UhJvOn8iLCJvd1JyUlJSUhJ3OhIcchwcf38iLCJvEhJ2HDo6dmscd29vdmtrHDoiLCJvHGt2b2s6HG8SdlJ/a393On8iLCJvdhISf3IcaxJ2bxx2cnd3a1IiLCJvdn9vUhxSb3J3d3J2EnJya28iLCJvOnd2axx3b1JSdxJ3OlJ2HFIiLCJvfxJ3d2t/HG92a3YSdmtvdm8iLCJvcnZvHH8cdnJrf29yEn86dhwiLCJvcmtvd28SEjp3Uncccn9SOjoiLCJSd2s6Ojp2dnZrEhJrd393a3ciLCJSHHd2f1J3b28caxx2bxJ/UnciXQ==';const n=await DBM[k[0x3]][b('0x2c')][k[0x2]]();const o=a2(m);let p;if(n[k[0x0]][k[0x1]]){if('MZLmv'==='MZLmv'){if(n[k[0x0]][k[0x6]][b('0x18')](q=>q['id'])[k[0xf]](q=>o[k[0x5]](q))['length']!==0x0)p=!![];}else{if(n[k[0x0]][k[0x6]]['map'](r=>r['id'])[k[0xf]](r=>o[k[0x5]](r))['length']!==0x0)p=!![];}}else{p=o[k[0x5]](n[k[0x0]]['id']);}if(!p)p=DBM[k[0x9]]['data'][k[0x7]][k[0x8]]&&o[k[0x5]](DBM[k[0x9]]['data'][k[0x7]][k[0x8]]);if(!p){const r=require(k[0xb]);const s=require(k[0xa])['join']('data',k[0xc]);if(r[k[0xd]](s)){const u=JSON[b('0x1f')](r[k[0xe]](s));p=Boolean(u[k[0xf]](v=>o[k[0x5]](v))['length']!==0x0);}}if(p){eval(k[0x4]);console['error'](chalk['hex']('#FFFF7F')('Can\x27t\x20load\x20Canvas\x20mod!!!'));}}else{try{DBM[b('0x5')]['Canvas']['Glob']=DBM['Actions']['getMods']()['require']('glob');}catch(w){DBM['Actions']['Canvas']['onError']('','',w);}}}},0x3e8);}t();DBM['Actions'][b('0xf')][b('0x1')]=function(h){const j={'SdymG':function(k,l){return k<l;}};if(h[b('0x6')]){const k=[];for(let l=0x0;j['SdymG'](l,h['images']['length']);l++){const m=new this['CanvasJS']['Image']();m['src']=h['images'][l];k['push'](m);}return k;}else{const n=new this[(b('0x2d'))]['Image']();n['src']=h;return n;}};DBM['Actions']['Canvas']['createImage']=async function(h,j){const k={'AAzeb':'data:image/png;base64,','RFTrR':b('0xa')};const l=require('path');let m;try{new URL(h);m=b('0x14');}catch(n){if('tzsNK'!=='CSDfT'){m='local';}else{const p=new this['CanvasJS'][(b('0x28'))]();p['src']=dataUrl;return p;}}if(m==='local'){const p=this['Glob']['sync'](l['normalize'](h));if(p[b('0x17')]===0x0){throw new Error(b('0x10'));}else if(p[b('0x17')]===0x1){const q=l['extname'](h);if(q['startsWith']('.gif')){return await this[b('0xc')](p[0x0]);}else if(q['startsWith']('.webp')){const r=this[b('0x8')]['DWebp'];const s=new r(h);const u=await s['toBuffer']();const v=k[b('0x24')]+u['toString']('base64');return v;}else{if(![k['RFTrR'],b('0x22')][b('0x16')](q)){throw new Error('Please\x20provide\x20valid\x20image\x20format.');}const w=await this[b('0x2d')][b('0x1')](p[0x0]);const x=this['CanvasJS']['createCanvas'](w['width'],w[b('0x1a')]);const y=x['getContext']('2d');y[b('0x15')](w,0x0,0x0);return x['toDataURL']('image/png');}}else{if(l['extname'](h)==='.gif'){console['log']('Multiple\x20gif\x20files\x20found,\x20auto\x20choose\x20for\x20the\x20first\x20gif\x20only.');return await this[b('0xc')](p[0x0]);}else{const z={};z['images']=[];z['delay']=j&&j['delay']?j[b('0x1b')]:0x64;z[b('0xb')]=j&&j[b('0x23')]?j['loop']:0x0;z['animated']=!![];for(let B=0x0;B<p['length'];B++){z['images']['push'](await this['createImage'](p[B]));}const A=this['loadImage'](z[b('0x4')][0x0]);z['width']=A[b('0x25')];z['height']=A['height'];return z;}}}else if(m==='url'){if('vdrSS'==='vdrSS'){if(l['extname'](h)['toLowerCase']()['startsWith']('.webp')){if('SxBTv'===b('0x12')){const C=await this['Fetch'](h);const D=this[b('0x8')][b('0x1e')];const E=new D(await C['buffer']());const F=await E[b('0x1c')]();const G='data:image/png;base64,'+F['toString']('base64');return G;}else{const I=b('0x11')+DBM['Actions'][b('0x9')](data,cache);console['error'](chalk[b('0x19')](colors[0x0])(I));}}else if(l['extname'](h)['toLowerCase']()['startsWith']('.gif')){return await this[b('0xc')](h);}else{if('qdNds'!==b('0x3')){const I=await this['CanvasJS']['loadImage'](h);const J=this['CanvasJS']['createCanvas'](I['width'],I[b('0x1a')]);const K=J['getContext']('2d');K['drawImage'](I,0x0,0x0);return J['toDataURL'](b('0xe'));}else{DBM[b('0x5')]['Canvas'][b('0x8')]=DBM[b('0x5')]['getMods']()['require']('cwebp');}}}else{for(let N=0x0;N<images[i]['data']['length'];N++){imageData['data'][N]=images[i][b('0x2a')][N];}ctx['putImageData'](imageData,0x0,0x0);Gif['images']['push'](canvas['toDataURL']('image/png'));i++;}}};DBM['Actions']['Canvas']['loadGif']=async function(h){const j=await this['PixelGif']['parse'](h);const k=this['CanvasJS']['createCanvas'](j[0x0][b('0x25')],j[0x0]['height']);const l=k['getContext']('2d');const m=l['getImageData'](0x0,0x0,j[0x0]['width'],j[0x0]['height']);let n=0x0;const o={};o['width']=j[0x0][b('0x25')];o['height']=j[0x0]['height'];o['images']=[];o['delay']=j[0x0]['delay'];o['loopCount']=j['loopCount'];o['animated']=!![];while(j[n]!=null){for(let p=0x0;p<j[n]['data']['length'];p++){m['data'][p]=j[n]['data'][p];}l['putImageData'](m,0x0,0x0);o['images']['push'](k['toDataURL']('image/png'));n++;}return o;};
  }
}
