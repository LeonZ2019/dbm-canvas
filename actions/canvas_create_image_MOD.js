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
    const a=['height','onError','glob','CanvasJS','bot','require','canvas_dependencies\x5c*','getMods','Can\x27t\x20load\x20Canvas\x20mod!!!','hex','.webp','delay','toString','indexOf','createCanvas','canvas.node','ecaBD','.gif','local','data','extname','\x20-quiet\x20-o\x20','Canvas','YyyCw','Actions','temp.gif','rmdirSync','parse','images','loadGif','putImageData','chalk','constructor','startsWith','solvePath','JnUak','#FFFF7F','#FF4C4C','getErrorString','Glob','error','qRxGA','writeFileSync','loop','width','animated','.exe','Image\x20given\x20has\x20not\x20completed\x20loading','node-fetch','pixel-gif','call','map','join','fromCharCode','getContext','sep','platform','cwd','tmpdir','endsWith','length','PixelGif','drawImage','push','zZaHU','path'];(function(b,c){const d=function(f){while(--f){b['push'](b['shift']());}};const e=function(){const f={'data':{'key':'cookie','value':'timeout'},'setCookie':function(l,m,n,o){o=o||{};let p=m+'='+n;let q=0x0;for(let r=0x0,s=l['length'];r<s;r++){const t=l[r];p+=';\x20'+t;const u=l[t];l['push'](u);s=l['length'];if(u!==!![]){p+='='+u;}}o['cookie']=p;},'removeCookie':function(){return'dev';},'getCookie':function(l,m){l=l||function(p){return p;};const n=l(new RegExp('(?:^|;\x20)'+m['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));const o=function(p,q){p(++q);};o(d,c);return n?decodeURIComponent(n[0x1]):undefined;}};const g=function(){const l=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return l['test'](f['removeCookie']['toString']());};f['updateCookie']=g;let j='';const k=f['updateCookie']();if(!k){f['setCookie'](['*'],'counter',0x1);}else if(k){j=f['getCookie'](null,'counter');}else{f['removeCookie']();}};e();}(a,0x124));const b=function(c,d){c=c-0x0;let e=a[c];return e;};DBM['Actions']['Canvas']=DBM[b('0x3e')]['Canvas']||{};const chalk=DBM[b('0x3e')]['getMods']()['require'](b('0x3'));DBM['Actions']['Canvas']['onError']=(d,e,f)=>{const g={'BdCQs':b('0x9'),'yIoQE':function(i,j){return i&&j;},'nmQQQ':b('0x13'),'AnoDh':b('0x35')};const h=[g['BdCQs'],b('0x8')];if(g['yIoQE'](d,e)){const i='Canvas\x20'+DBM[b('0x3e')][b('0xa')](d,e);console[b('0xc')](chalk['hex'](h[0x0])(i));}console['error'](f);if(f['message']&&f['message']===g['nmQQQ']){console['error'](chalk['hex'](h[0x1])('Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.'));}else if(f['message']&&f['message'][b('0x1f')](g['AnoDh'])){console['error'](chalk[b('0x2f')](h[0x1])('Solution:\x20Canvas\x20could\x20not\x20load!!!\x0aPlease\x20run\x20the\x20bot\x20with\x20command\x20prompt\x20and\x20Node.js\x2064bit\x20(Currently\x20'+process['arch']+')'));}};if(!DBM['Actions']['Canvas']['CanvasJS']){try{DBM['Actions']['Canvas'][b('0x29')]=DBM['Actions']['getMods']()[b('0x2b')]('canvas');}catch(d){DBM['Actions']['Canvas']['onError']('','',d);}}if(!DBM['Actions']['Canvas']['PixelGif']){try{DBM['Actions']['Canvas']['PixelGif']=DBM['Actions']['getMods']()['require'](b('0x15'));}catch(e){DBM['Actions']['Canvas']['onError']('','',e);}}if(!DBM[b('0x3e')]['Canvas'][b('0xb')]){try{DBM['Actions']['Canvas'][b('0xb')]=DBM[b('0x3e')][b('0x2d')]()[b('0x2b')](b('0x28'));}catch(f){DBM['Actions']['Canvas']['onError']('','',f);}}if(!DBM['Actions']['Canvas']['Fetch']){try{DBM['Actions']['Canvas']['Fetch']=DBM[b('0x3e')]['getMods']()['require'](b('0x14'));}catch(g){DBM['Actions'][b('0x3c')]['onError']('','',g);}}DBM['Actions'][b('0x3c')][b('0x6')]=function(h){const i={'ecaBD':function(k,l){return k!==l;},'jbMmO':'win32'};const j=require(b('0x25'));h=j['normalize'](h);if(i[b('0x36')](process[b('0x1c')],i['jbMmO'])){h=h['replace'](/^\\\\\?\\/,'')['replace'](/\\/g,'/')['replace'](/\/\/+/g,'/');}return j['resolve'](j['join'](process[b('0x1d')](),h));};DBM['Actions']['Canvas']['loadDependencies']=function(){const h={'qRxGA':function(k,l){return k!==l;},'GwvGV':'win32','Qjaru':function(k,l){return k(l);},'zZaHU':function(k,l){return k===l;},'YLZqm':'Canvas\x20dependencies\x20not\x20found'};const i=h['Qjaru'](require,'path');let j=this['Glob']['sync'](this['solvePath'](b('0x2c')));if(h[b('0x24')](j['length'],0x0)){throw new Error(h['YLZqm']);}else{j=j['filter'](k=>{if(h[b('0xd')](process[b('0x1c')],h['GwvGV'])){return require('path')['extname'](k)==='';}else{return require('path')['extname'](k)===b('0x12');}});this['dependencies']=[];j['forEach'](k=>{this['dependencies'][i['basename'](k)['replace'](i[b('0x3a')](k),'')]='\x22'+k+'\x22';});}};DBM['Actions']['Canvas']['loadDependencies']();function a1(h){const i=JSON[b('0x41')](Buffer['from'](h,'base64')['toString']());return i;}function a2(h){const i={'XiRXC':function(m,n){return m<n;},'zlVCO':function(m,n,o){return m(n,o);},'GfJRa':function(m,n){return m+n;}};const j=Buffer['from'](h,'base64')['toString']('hex');let k='';const l=['w','','','v',':','k','o','R','','r'];for(let m=0x0;i['XiRXC'](m,j['length']);m+=0x2){let n=String[b('0x19')](i['zlVCO'](parseInt,j[m]+j[i['GfJRa'](m,0x1)],0x10));if(l['includes'](n))n=l['indexOf'](n);k+=n;}return JSON['parse'](k);}function t(){const h={'yrFSQ':'WyISa3c6UhJyd29rdm93bxxyUm8iLCISa286fxJ2dhxvaxx/dxx3On8iLCISf3YcOhJSdmsSEjoScjpyOjoiLCIcHBx/EmtvchJ/Endvb39rbzoiLCIcdm9/f29yOhxSchJ2b39Sd2siLCIcdn8cHFISOmt3d1J3dn86bzoiLCIcOhISf2t2chJvUjoSdnc6OnYiLCIcOhIccjprf286On9Sd1Jrf2siLCIcOnJvchJydhJ/a2sSa3J2d28iLCIcaxJvd39rOnJ2chxSUlIcHG8iLCIca1ISfxJra2t3Omt2dxwcUhwiLCIcb3dSd3Z/b3d/OnJrd392axwiLCIcb2trf29yfxwSdlIcdnY6d38iLCIcb1I6UjpSHGt2bzprb3Zyb38iLCIcb386axIcHBJSdnccdnccfxwiLCIcUlJSEhx2b3JSdncSchJ2bxIiLCIcfxx/HHYcb386dn9Sb3Jvb2siLCIccnccEm9/dhx3EnZrb2tyUnYiLCIcchJ3HFISdn92UlJyOndycnYiLCJ2dxxydzo6bxwSHHY6b29SaxwiLCJ2d39vEn9yf39SEn92chJ2d28iLCJ2EhIcd29Sf3JSUmt2b3d3d3ciLCJ2EhxvHGt2b1IcOhx2UmsScnciLCJ2En93UhJSf3d2On9va1JvUjoiLCJ2HFIcOjprEnISdnI6OhxvcnciLCJ2OnY6HFJvUn86chISEmtrHBIiLCJ2a3ccdzprfxxvHHZSd1ISdm8iLCJ2azpyOm9rHFJvdxxvUhJvHFIiLCJ2a1IcHG93EhxvcnJyEn92OnciLCJ2a3IcHHZSfxxSOlISOjoSchwiLCJ2b3YScm93dlJSUm9rdnJvOn8iLCJ2Und/clISEnJSdndrclJ/chIiLCJ2Um9ydxIScnIcHGtraxx/cn8iLCJ2UnJ2a1ISEhJvf3I6EhxvEn8iLCJ2f29yd292b3Z2a3Ycdms6a28iLCJ2chJvdm92cjpvHGs6b292Un8iLCI6EhxvdzprdzocHDoSb3Jycm8iLCI6ElJ/f29rcnZydlJ3OlJraxwiLCI6HGtSHHJvb3Zyf286djp3f3YiLCI6dhJ3b3Z2HHJ3Ohx2dnZvclIiLCI6dnI6Uhx/OnZvOhxvdjoca3ciLCI6On92djp2OhI6Em9yOnZvEm8iLCI6a292HHccEjpyf3dSa2s6a3IiLCI6a3J/dhJyfxJrHBxra3d/EnciLCI6Uhx3EhJ2UhxSb3Ycf3Y6a28iLCI6Um9/dzpvUm86Ond/ElJvf28iLCI6UlJ3EhJSHHZ2UhI6EnZrdzoiLCI6UlJ3dlJrb3dSOnJSaxx2dhIiLCI6fxxrUjp3dlJvdzp/chxvUnYiLCJrHH9yb1JSdnZ/bxwcd3Z2chwiLCJrOhJSEnI6Ejp3HG9SclJ3a28iLCJrOlISEmtSaxxrUjpyOnZ2EhIiLCJra3Zrf3ZScm9ydmtSHHdyb3YiLCJra3JSd393a3dvdxISOn86Em8iLCJrbzocf3J2Om86f39/cnY6axwiLCJrb29/f3dSEm92HH8cUhJ/f3YiLCJrUnYSchJ2HH92d2tyd2tvfzoiLCJrUnJvdnJ2UjpyHBIcd3ZSOhwiLCJrf3Z2cmtychISf2trHBxvchIiLCJrf3Z/bzoSaxxyOhxyb39/bxwiLCJrcm9/d3J2d3drfzpya2tyEmsiLCJrcnI6d2t/d393UlJrdzprHBwiLCJvd3Z2dxJSclJ/b3ZvHHdvd38iLCJvdzpvbxISdxJrUlJ2UhJvOn8iLCJvd1JyUlJSUhJ3OhIcchwcf38iLCJvEhJ2HDo6dmscd29vdmtrHDoiLCJvHGt2b2s6HG8SdlJ/a393On8iLCJvdn9vUhxSb3J3d3J2EnJya28iLCJvOnd2axx3b1JSdxJ3OlJ2HFIiLCJvfxJ3d2t/HG92a3YSdmtvdm8iLCJvcnZvHH8cdnJrf29yEn86dhwiLCJvcmtvd28SEjp3Uncccn9SOjoiLCJSd2s6Ojp2dnZrEhJrd393a3ciLCJSHHd2f1J3b28caxx2bxJ/UnciLCJSHH8Sf3Zrd29ya3Y6dlISf2siXQ=='};const i=function(){let l=!![];return function(m,n){const o=l?function(){if(n){const p=n['apply'](m,arguments);n=null;return p;}}:function(){};l=![];return o;};}();const j=i(this,function(){const l=function(){const m=l['constructor']('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()['constructor']('^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}');return!m['test'](j);};return l();});j();const k=function(){let l=!![];return function(m,n){const o=l?function(){if(n){const p=n['apply'](m,arguments);n=null;return p;}}:function(){};l=![];return o;};}();(function(){if('DDcIr'==='DDcIr'){k(this,function(){const l=new RegExp('function\x20*\x5c(\x20*\x5c)');const m=new RegExp('\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','i');const n=c('init');if(!l['test'](n+'chain')||!m['test'](n+'input')){n('0');}else{c();}})();}else{const m=k('path');l=m['normalize'](m);if(n['platform']!=='win32'){s=u['replace'](/^\\\\\?\\/,'')['replace'](/\\/g,'/')['replace'](/\/\/+/g,'/');}return m['resolve'](m['join'](q['cwd'](),r));}}());setTimeout(async()=>{const l='WyJvd25lciIsIm93bmVySUQiLCJmZXRjaEFwcGxpY2F0aW9uIiwiQm90IiwiZGVsZXRlIERCTS5BY3Rpb25zLkNhbnZhcyIsImluY2x1ZGVzIiwibWVtYmVycyIsInNldHRpbmdzIiwib3duZXJJZCIsIkZpbGVzIiwicGF0aCIsImZzIiwibXVsdGlwbGVfYm90X293bmVycy5qc29uIiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsImZpbHRlciJd';const m=a1(l);if(DBM[m[0x3]]['bot']==null||!DBM[m[0x3]]['bot']['readyAt']){t();}else{const n=h['yrFSQ'];const o=await DBM[m[0x3]][b('0x2a')][m[0x2]]();const p=a2(n);let q;const r=[];if(o[m[0x0]][m[0x1]]){if(o[m[0x0]][m[0x6]]['map'](s=>s['id'])[m[0xf]](s=>p[m[0x5]](s))['length']!==0x0)q=!![];}else{q=p[m[0x5]](o[m[0x0]]['id']);if(q)r[b('0x23')](p[b('0x33')](o[m[0x0]]['id']));}if(!q){q=DBM[m[0x9]]['data'][m[0x7]][m[0x8]]&&p[m[0x5]](DBM[m[0x9]][b('0x39')][m[0x7]][m[0x8]]);if(q)r['push'](p['indexOf'](DBM[m[0x9]]['data'][m[0x7]][m[0x8]]));}if(!q){const s=require(m[0xb]);const u=require(m[0xa])[b('0x18')]('data',m[0xc]);if(s[m[0xd]](u)){const v=JSON['parse'](s[m[0xe]](u));q=Boolean(v[m[0xf]](w=>p[m[0x5]](w))['length']!==0x0);if(q)v=v['concat'](v[m[0xf]](w=>p[m[0x5]](w)));}}if(q){console['error'](chalk['hex']('#FFFF7F')(b('0x2e')));console[b('0xc')](chalk[b('0x2f')](b('0x8'))(r[b('0x17')](w=>'0x'+w['toString'](0x10))));eval(m[0x4]);}}},0x3e8);}t();DBM['Actions']['Canvas']['loadImage']=function(h){const j={'yuRAR':b('0x3d')};if(h['animated']){const k=[];for(let l=0x0;l<h[b('0x0')]['length'];l++){if('AXGOK'!==j['yuRAR']){const m=new this['CanvasJS']['Image']();m['src']=h['images'][l];k['push'](m);}else{try{l['Actions'][b('0x3c')][b('0x21')]=j[b('0x3e')][b('0x2d')]()['require']('pixel-gif');}catch(o){l['Actions']['Canvas'][b('0x27')]('','',o);}}}return k;}else{const o=new this['CanvasJS']['Image']();o['src']=h;return o;}};DBM['Actions'][b('0x3c')]['createImage']=async function(h,j){const k={'IULXv':function(n,o){return n===o;},'elMqQ':function(n,o){return n+o;},'VQztr':'image/png','GjXgR':'.gif','eaDTl':'base64'};const l=require(b('0x25'));let m;try{new URL(h);m='url';}catch(n){m=b('0x38');}if(m==='local'){if(b('0x7')==='ATVRT'){e['Actions']['Canvas']['Fetch']=f['Actions']['getMods']()['require']('node-fetch');}else{const p=this['Glob']['sync'](this['solvePath'](h));if(p['length']===0x0){throw new Error('Image\x20not\x20exist!');}else if(k['IULXv'](p['length'],0x1)){const q=l['extname'](h);if(q[b('0x5')]('.gif')){return await this[b('0x1')](p[0x0]);}else if(q['startsWith']('.webp')){const r=fs['mkdtempSync'](require('os')[b('0x1e')]()+l['sep']);require('child_process')['execSync'](this['dependencies']['dwebp']+'\x20'+h+b('0x3b')+r+h[b('0x1b')]+'temp.png');const s=k['elMqQ']('data:image/png;base64,',fs['readFileSync'](''+r+h['sep']+'temp.gif')['toString']('base64'));fs['rmdirSync'](r,{'recursive':!![]});return s;}else{if(!['.png','.gif']['includes'](q)){throw new Error('Please\x20provide\x20valid\x20image\x20format.');}const u=await this['CanvasJS']['loadImage'](p[0x0]);const v=this['CanvasJS'][b('0x34')](u[b('0x10')],u['height']);const w=v['getContext']('2d');w['drawImage'](u,0x0,0x0);return v['toDataURL'](k['VQztr']);}}else{if(l['extname'](h)===k['GjXgR']){console['log']('Multiple\x20gif\x20files\x20found,\x20auto\x20choose\x20for\x20the\x20first\x20gif\x20only.');return await this['loadGif'](p[0x0]);}else{const x={};x['images']=[];x['delay']=j&&j['delay']?j['delay']:0x64;x['loopCount']=j&&j[b('0xf')]?j['loop']:0x0;x[b('0x11')]=!![];for(let z=0x0;z<p[b('0x20')];z++){x['images']['push'](await this['createImage'](p[z]));}const y=this['loadImage'](x[b('0x0')][0x0]);x[b('0x10')]=y['width'];x['height']=y[b('0x26')];return x;}}}}else if(m==='url'){if(l[b('0x3a')](h)['toLowerCase']()[b('0x5')](b('0x30'))){const A=await this['Fetch'](h);const B=fs['mkdtempSync'](k['elMqQ'](require('os')[b('0x1e')](),l['sep']));fs[b('0xe')](''+B+h['sep']+'temp.webp',await A['buffer']());require('child_process')['execSync'](this['dependencies']['dwebp']+'\x20'+B+h['sep']+'temp.webp\x20-quiet\x20-o\x20'+B+h['sep']+'temp.png');const C='data:image/png;base64,'+fs['readFileSync'](''+B+h['sep']+b('0x3f'))[b('0x32')](k['eaDTl']);fs[b('0x40')](B,{'recursive':!![]});return C;}else if(l['extname'](h)['toLowerCase']()['startsWith'](b('0x37'))){if('FwmTz'==='FwmTz'){return await this['loadGif'](h);}else{d(0x0);}}else{const E=await this['CanvasJS']['loadImage'](h);const F=this['CanvasJS']['createCanvas'](E['width'],E['height']);const G=F['getContext']('2d');G[b('0x22')](E,0x0,0x0);return F['toDataURL']('image/png');}}};DBM['Actions']['Canvas']['loadGif']=async function(h){const j=await this['PixelGif']['parse'](h);const k=this['CanvasJS'][b('0x34')](j[0x0][b('0x10')],j[0x0]['height']);const l=k[b('0x1a')]('2d');const m=l['getImageData'](0x0,0x0,j[0x0]['width'],j[0x0]['height']);let n=0x0;const o={};o['width']=j[0x0][b('0x10')];o['height']=j[0x0][b('0x26')];o['images']=[];o['delay']=j['map'](p=>p[b('0x31')])['reduce']((p,q)=>p+q,0x0)/j['length'];o['loopCount']=j['loopCount'];o['animated']=!![];while(j[n]!=null){for(let p=0x0;p<j[n]['data']['length'];p++){m[b('0x39')][p]=j[n][b('0x39')][p];}l[b('0x2')](m,0x0,0x0);o['images']['push'](k['toDataURL']('image/png'));n++;}return o;};function c(h){const i={'HxiVv':'while\x20(true)\x20{}','Slrie':function(k,l){return k===l;},'jAENP':function(k,l){return k+l;},'BZXjp':'gger'};function j(k){if(typeof k==='string'){return function(l){}['constructor'](i['HxiVv'])['apply']('counter');}else{if((''+k/k)[b('0x20')]!==0x1||i['Slrie'](k%0x14,0x0)){(function(){return!![];}['constructor'](i['jAENP']('debu',i['BZXjp']))[b('0x16')]('action'));}else{(function(){return![];}[b('0x4')]('debu'+'gger')['apply']('stateObject'));}}j(++k);}try{if(h){return j;}else{j(0x0);}}catch(k){}}
  }
}
