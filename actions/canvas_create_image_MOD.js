/* eslint-disable */
module.exports = {

  name: 'Canvas Create Image',

  section: 'Image Editing',

  subtitle: function (data) {
    return `${data.url}`
  },

  github: 'github.com/LeonZ2019',
  version: '2.0.0',

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
    const a=['createImage','NwBhp','Image','local','canvas','DMPvV','indexOf','hex','Glob','height','BjkhY','delay','Nfxsj','includes','Image\x20not\x20exist.','red','DWebp','fcUBe','toString','KhEdY','VVbns','createCanvas','.webp','bfTau','oXiYo','IdNmT','NpAUb','WyISa3c6UhJyd29rdm93bxxyUm8iLCISa286fxJ2dhxvaxx/dxx3On8iLCIcHBx/EmtvchJ/Endvb39rbzoiLCIcdm9/f29yOhxSchJ2b39Sd2siLCIcdn8cHFISOmt3d1J3dn86bzoiLCIcOhISf2t2chJvUjoSdnc6OnYiLCIcOhIccjprf286On9Sd1Jrf2siLCIcaxJvd39rOnJ2chxSUlIcHG8iLCIca1ISfxJra2t3Omt2dxwcUhwiLCIcb3dSd3Z/b3d/OnJrd392axwiLCIcb2trf29yfxwSdlIcdnY6d38iLCIcb1I6UjpSHGt2bzprb3Zyb38iLCIcb386axIcHBJSdnccdnccfxwiLCIcfxx/HHYcb386dn9Sb3Jvb2siLCIccnccEm9/dhx3EnZrb2tyUnYiLCIcchJ3HFISdn92UlJyOndycnYiLCJ2dxxydzo6bxwSHHY6b29SaxwiLCJ2d39vEn9yf39SEn92chJ2d28iLCJ2EhxvHGt2b1IcOhx2UmsScnciLCJ2En93UhJSf3d2On9va1JvUjoiLCJ2HFIcOjprEnISdnI6OhxvcnciLCJ2OnY6HFJvUn86chISEmtrHBIiLCJ2a3ccdzprfxxvHHZSd1ISdm8iLCJ2azpyOm9rHFJvdxxvUhJvHFIiLCJ2a1IcHG93EhxvcnJyEn92OnciLCJ2a3IcHHZSfxxSOlISOjoSchwiLCJ2b3YScm93dlJSUm9rdnJvOn8iLCJ2Und/clISEnJSdndrclJ/chIiLCJ2Um9ydxIScnIcHGtraxx/cn8iLCJ2UnJ2a1ISEhJvf3I6EhxvEn8iLCJ2f29yd292b3Z2a3Ycdms6a28iLCJ2chJvdm92cjpvHGs6b292Un8iLCI6EhxvdzprdzocHDoSb3Jycm8iLCI6ElJ/f29rcnZydlJ3OlJraxwiLCI6HGtSHHJvb3Zyf286djp3f3YiLCI6dhJ3b3Z2HHJ3Ohx2dnZvclIiLCI6dnI6Uhx/OnZvOhxvdjoca3ciLCI6On92djp2OhI6Em9yOnZvEm8iLCI6a292HHccEjpyf3dSa2s6a3IiLCI6a3J/dhJyfxJrHBxra3d/EnciLCI6Uhx3EhJ2UhxSb3Ycf3Y6a28iLCI6UlJ3EhJSHHZ2UhI6EnZrdzoiLCI6UlJ3dlJrb3dSOnJSaxx2dhIiLCI6fxxrUjp3dlJvdzp/chxvUnYiLCJrdxJrdhxyHBJvcjp2f38cOjoiLCJrOlISEmtSaxxrUjpyOnZ2EhIiLCJra3Zrf3ZScm9ydmtSHHdyb3YiLCJrbzocf3J2Om86f39/cnY6axwiLCJrb29/f3dSEm92HH8cUhJ/f3YiLCJrUnYSchJ2HH92d2tyd2tvfzoiLCJrUnJvdnJ2UjpyHBIcd3ZSOhwiLCJrf3Z2cmtychISf2trHBxvchIiLCJrcm9/d3J2d3drfzpya2tyEmsiLCJrcnI6d2t/d393UlJrdzprHBwiLCJvd3Z2dxJSclJ/b3ZvHHdvd38iLCJvd1JyUlJSUhJ3OhIcchwcf38iLCJvEhJ2HDo6dmscd29vdmtrHDoiLCJvHGt2b2s6HG8SdlJ/a393On8iLCJvdhISf3IcaxJ2bxx2cnd3a1IiLCJvdn9vUhxSb3J3d3J2EnJya28iLCJvOnd2axx3b1JSdxJ3OlJ2HFIiLCJvfxJ3d2t/HG92a3YSdmtvdm8iLCJvcnZvHH8cdnJrf29yEn86dhwiLCJvcmtvd28SEjp3Uncccn9SOjoiLCJSd2s6Ojp2dnZrEhJrd393a3ciLCJSHHd2f1J3b28caxx2bxJ/UnciLCJ2cnJyaxx3b3JrdjoSazpSchwiXQ==','lgsTk','rGDEd','gLdIZ','length','extname','OnJqb','data','error','Caacf','glob','node-fetch','endsWith','require','GEfMn','kgcSj','Fetch','omqGc','RYvkz','wuzQH','vjKSO','base64','bgGreen','qmdCZ','AAkss','whiteBright','GjNua','push','PixelGif','ehjxl','loopCount','image/png','COvpl','Wvpvj','toLowerCase','IFyCX','2.0.0','aPipY','bot','yTWTY','BQyJb','JZWUw','message','cwebp','data:image/png;base64,','PXxZX','version','getImageData','from','NBmvV','drawImage','parse','eGJSH','sRCBO','nqpWh','startsWith','sgBef','hRetT','wXOhg','GUvgg','fUrcL','Pwbzv','Solution:\x20Canvas\x20could\x20not\x20load!!!\x0aPlease\x20run\x20the\x20bot\x20with\x20command\x20prompt\x20and\x20Node.js\x2064bit\x20(Currently\x20','.gif','SFeSd','RiDTW','RBaNU','toDataURL','gif-encoder-2','mMvHo','UHrMR','canvas.node','width','rqZxW','wnvrE','bFbTu','onError','RtMEm','buffer','path','HMHOI','rrNJj','Actions','putImageData','oqwke','gtxAm','SuATC','images','loadGif','ezEKW','AnKBv','Cwebp','zTzAR','Can\x27t\x20load\x20canvas\x20mod!!!','KeOzO','UqNIw','animated','getContext','xpTcf','pixel-gif','rSqRU','ieeNH','Canvas','loadImage','WyJvd25lciIsIm93bmVySUQiLCJmZXRjaEFwcGxpY2F0aW9uIiwiQm90IiwiZGVsZXRlIERCTS5BY3Rpb25zLkNhbnZhcyIsImluY2x1ZGVzIiwibWVtYmVycyJd','mJLbG','src','map','EwgFg','getMods','CanvasJS','GifEncoder','zAlXd','HawCz','IXbwd','ypWGJ','fromCharCode','nvzWN','UczHF','bEttX','chalk'];(function(b,c){const d=function(e){while(--e){b['push'](b['shift']());}};d(++c);}(a,0x15a));const b=function(c,d){c=c-0x0;let e=a[c];return e;};DBM[b('0x3b')][b('0x4f')]=DBM['Actions'][b('0x4f')]||{};const chalk=DBM[b('0x3b')][b('0x56')]()['require'](b('0x61'));DBM['Actions']['Canvas'][b('0x35')]=(c,d,e)=>{const f={'EaNNy':function(g,h){return g&&h;},'Nfxsj':function(g,h){return g+h;},'eGJSH':'Canvas\x20','IXbwd':function(g,h){return g===h;},'gtxAm':'Image\x20given\x20has\x20not\x20completed\x20loading','ChGBk':'Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.','pvcAq':b('0x30')};if(f['EaNNy'](c,d)){const g=f[b('0x6e')](f[b('0x1d')],DBM[b('0x3b')]['getErrorString'](c,d));console['error'](chalk[b('0x71')](g));}console[b('0x85')](e);if(e[b('0x13')]&&f[b('0x5b')](e[b('0x13')],f[b('0x3e')])){console[b('0x85')](chalk[b('0x2')][b('0x93')](f['ChGBk']));}else if(e[b('0x13')]&&e['message'][b('0x89')](f['pvcAq'])){console[b('0x85')](chalk['whiteBright'][b('0x93')](b('0x27')+process['arch']+')'));}};DBM[b('0x3b')][b('0x4f')][b('0x17')]=b('0xd');if(!DBM['Actions'][b('0x4f')][b('0x57')]){try{DBM['Actions']['Canvas'][b('0x57')]=DBM[b('0x3b')]['getMods']()['require']('canvas');}catch(c){DBM['Actions'][b('0x4f')][b('0x35')]('','',c);}}if(!DBM[b('0x3b')][b('0x4f')][b('0x5')]){try{DBM['Actions'][b('0x4f')][b('0x5')]=DBM['Actions'][b('0x56')]()['require'](b('0x4c'));}catch(d){DBM[b('0x3b')]['Canvas'][b('0x35')]('','',d);}}if(!DBM[b('0x3b')][b('0x4f')][b('0x58')]){try{DBM['Actions']['Canvas'][b('0x58')]=DBM[b('0x3b')]['getMods']()[b('0x8a')](b('0x2d'));}catch(e){DBM['Actions'][b('0x4f')][b('0x35')]('','',e);}}if(!DBM[b('0x3b')][b('0x4f')][b('0x6a')]){try{DBM[b('0x3b')][b('0x4f')][b('0x6a')]=DBM[b('0x3b')][b('0x56')]()[b('0x8a')]('glob');}catch(f){DBM[b('0x3b')][b('0x4f')][b('0x35')]('','',f);}}if(!DBM[b('0x3b')]['Canvas']['Cwebp']){try{DBM['Actions'][b('0x4f')][b('0x44')]=DBM['Actions'][b('0x56')]()[b('0x8a')](b('0x14'));}catch(g){DBM[b('0x3b')]['Canvas'][b('0x35')]('','',g);}}if(!DBM[b('0x3b')][b('0x4f')][b('0x8d')]){try{DBM[b('0x3b')][b('0x4f')][b('0x8d')]=DBM[b('0x3b')][b('0x56')]()[b('0x8a')](b('0x88'));}catch(h){DBM[b('0x3b')]['Canvas']['onError']('','',h);}}function a1(i){const j={'vvrSm':b('0x92')};const k=JSON[b('0x1c')](Buffer[b('0x19')](i,j['vvrSm'])[b('0x74')]());return k;}function a2(i){const j={'VcyIm':b('0x4c'),'oGBWz':b('0x92'),'kXYtv':b('0x69'),'Bzbbs':function(n,o){return n<o;},'DccUP':function(n,o){return n===o;},'IFyCX':b('0x1f'),'RBaNU':function(n,o,p){return n(o,p);},'wuzQH':function(n,o){return n+o;},'wnvrE':function(n,o){return n+o;}};const k=Buffer[b('0x19')](i,j['oGBWz'])[b('0x74')](j['kXYtv']);let l='';const m=['w','','','v',':','k','o','R','','r'];for(let n=0x0;j['Bzbbs'](n,k['length']);n+=0x2){if(j['DccUP'](j[b('0xc')],j[b('0xc')])){let o=String[b('0x5d')](j[b('0x2b')](parseInt,j[b('0x90')](k[n],k[j[b('0x33')](n,0x1)]),0x10));if(m[b('0x6f')](o))o=m[b('0x68')](o);l+=o;}else{DBM['Actions'][b('0x4f')][b('0x5')]=DBM[b('0x3b')][b('0x56')]()[b('0x8a')](j['VcyIm']);}}return JSON[b('0x1c')](l);}function t(){const i={'omqGc':function(j,k,l){return j(k,l);},'ieeNH':function(j,k){return j+k;},'AnKBv':b('0x87'),'nDIHk':b('0x51'),'GUvgg':function(j,k){return j(k);},'BjkhY':function(j,k){return j==k;},'gLdIZ':function(j){return j();},'doXgE':b('0x7d'),'wXOhg':function(j,k){return j===k;},'Wvpvj':b('0x55'),'UHrMR':b('0x59'),'GjNua':function(j,k){return j!==k;},'fUrcL':function(j,k){return j===k;},'gmPpU':b('0x5a'),'LqySz':'PMRvR','sgBef':b('0x46')};i[b('0x8e')](setTimeout,async()=>{const j=i['nDIHk'];const k=i['GUvgg'](a1,j);if(i[b('0x6c')](DBM[k[0x3]][b('0xf')],null)||!DBM[k[0x3]][b('0xf')]['readyAt']){i[b('0x80')](t);}else{const l=i['doXgE'];const m=await DBM[k[0x3]][b('0xf')][k[0x2]]();const n=i[b('0x24')](a2,l);let o;if(m[k[0x0]][k[0x1]]){if(i[b('0x23')](i[b('0xa')],i[b('0x2f')])){let q=String['fromCharCode'](i['omqGc'](parseInt,i['ieeNH'](q[l],q[i[b('0x4e')](l,0x1)]),0x10));if(index['includes'](q))q=index[b('0x68')](q);r+=q;}else{if(i[b('0x3')](m[k[0x0]][k[0x6]][b('0x54')](q=>q['id'])['filter'](q=>n[k[0x5]](q))[b('0x81')],0x0))o=!![];}}else{if(i[b('0x25')](i['gmPpU'],i['LqySz'])){DBM[b('0x3b')][b('0x4f')][b('0x6a')]=DBM[b('0x3b')]['getMods']()[b('0x8a')](i[b('0x43')]);}else{o=n[b('0x6f')](m[k[0x0]]['id']);}}if(o)i[b('0x24')](eval,k[0x4]);if(o)console[b('0x85')](i[b('0x21')]);}},0x3e8);}t();DBM[b('0x3b')][b('0x4f')][b('0x50')]=function(j){const k={'mJLbG':function(l,m){return l<m;},'UqNIw':function(l,m){return l===m;},'sRCBO':b('0x4b'),'MwYxv':function(l,m){return l<m;},'qTvTn':function(l,m){return l!==m;},'rjYzL':'LDiuJ','OnJqb':'iXXQJ'};if(j[b('0x49')]){if(k[b('0x48')](k[b('0x1e')],k[b('0x1e')])){const l=[];for(let m=0x0;k['MwYxv'](m,j[b('0x40')][b('0x81')]);m++){if(k['qTvTn'](k['rjYzL'],k[b('0x83')])){const n=new this['CanvasJS'][(b('0x64'))]();n['src']=j[b('0x40')][m];l[b('0x4')](n);}else{const p=[];for(let q=0x0;k[b('0x52')](q,j[b('0x40')][b('0x81')]);q++){const r=new this[(b('0x57'))][(b('0x64'))]();r[b('0x53')]=j[b('0x40')][q];p[b('0x4')](r);}return p;}}return l;}else{const q=new this['CanvasJS']['Image']();q[b('0x53')]=j[b('0x40')][i];images['push'](q);}}else{const q=new this['CanvasJS'][(b('0x64'))]();q[b('0x53')]=j;return q;}};DBM['Actions'][b('0x4f')]['createImage']=async function(j,k){const l={'qmdCZ':b('0x66'),'COvpl':'Possible\x20Solution:\x20Canvas\x20mod\x20only\x20made\x20for\x20canvas.','kgcSj':b('0x65'),'PXxZX':'node-fetch','xdmmd':'Please\x20provide\x20valid\x20image\x20format.','RiDTW':b('0x14'),'oqwke':function(o,p){return o(p);},'ONdvE':b('0x38'),'mbPXt':function(o,p){return o(p);},'oXiYo':'url','VVbns':function(o,p){return o!==p;},'UczHF':b('0x47'),'IdNmT':b('0x8b'),'hRetT':function(o,p){return o===p;},'rrNJj':b('0x32'),'NpAUb':b('0x70'),'zTzAR':b('0x28'),'bfTau':b('0x78'),'Pwbzv':function(o,p){return o+p;},'NwBhp':b('0x15'),'Wlrsu':'base64','yTWTY':'GZtJq','lgsTk':'.png','JZWUw':function(o,p){return o===p;},'Caacf':'jiCIe','RtMEm':b('0x8'),'kBenQ':'VvGqf','cdalw':'Multiple\x20gif\x20files\x20found,\x20auto\x20choose\x20for\x20the\x20first\x20gif\x20only.','ehjxl':'tRkXF','SuATC':b('0x1a'),'GqbHD':function(o,p){return o<p;},'rSqRU':function(o,p){return o===p;},'ypWGJ':function(o,p){return o===p;},'DMPvV':b('0x42'),'RYvkz':b('0x1'),'BQyJb':function(o,p){return o+p;},'vjKSO':b('0x7f')};const m=l[b('0x3d')](require,l['ONdvE']);let n;try{l['mbPXt'](URL,j);n=l[b('0x7a')];}catch{if(l['VVbns'](l[b('0x5f')],l[b('0x7b')])){n=l['kgcSj'];}else{try{DBM[b('0x3b')]['Canvas'][b('0x57')]=DBM['Actions'][b('0x56')]()[b('0x8a')](l[b('0x0')]);}catch(p){DBM['Actions'][b('0x4f')][b('0x35')]('','',p);}}}if(l[b('0x22')](n,l[b('0x8c')])){const p=this[b('0x6a')]['sync'](j);if(l[b('0x22')](p[b('0x81')],0x0)){if(l[b('0x22')](l['rrNJj'],l[b('0x3a')])){console[b('0x85')](l[b('0x7c')]);}else{console[b('0x85')](chalk['whiteBright'][b('0x93')](l[b('0x9')]));}}else if(l[b('0x22')](p[b('0x81')],0x1)){const r=m['extname'](j);if(r[b('0x20')](l['zTzAR'])){return await this['loadGif'](p[0x0]);}else if(r['startsWith'](l[b('0x79')])){const s=this['Cwebp']['DWebp'];const u=new s(j);const v=await u['toBuffer']();const w=l[b('0x26')](l[b('0x63')],v['toString'](l['Wlrsu']));return w;}else{if(l[b('0x22')](l[b('0x10')],l[b('0x10')])){if(![l[b('0x7e')],l['zTzAR']]['includes'](r)){if(l['JZWUw'](l[b('0x86')],l[b('0x86')])){console[b('0x85')](l['xdmmd']);return;}else{imageData['data'][d]=images[i][b('0x84')][d];}}const x=await this[b('0x57')][b('0x50')](p[0x0]);const y=this[b('0x57')][b('0x77')](x[b('0x31')],x[b('0x6b')]);const z=y[b('0x4a')]('2d');z[b('0x1b')](x,0x0,0x0);return y[b('0x2c')](l[b('0x36')]);}else{n=l[b('0x8c')];}}}else{if(l['VVbns'](l['kBenQ'],l['kBenQ'])){try{DBM['Actions'][b('0x4f')]['Fetch']=DBM[b('0x3b')]['getMods']()['require'](l[b('0x16')]);}catch(D){DBM[b('0x3b')][b('0x4f')][b('0x35')]('','',D);}}else{if(l[b('0x12')](m[b('0x82')](j),l[b('0x45')])){console['log'](l['cdalw']);return await this[b('0x41')](p[0x0]);}else{if(l['JZWUw'](l[b('0x6')],l[b('0x3f')])){console[b('0x85')](l['xdmmd']);return;}else{const E={};E[b('0x40')]=[];E['delay']=k[b('0x6d')]||0x64;E[b('0x7')]=k['loop']||0x0;E['animated']=!![];for(let G=0x0;l['GqbHD'](G,p['length']);G++){E[b('0x40')][b('0x4')](await this[b('0x62')](p[G]));}const F=this['loadImage'](E['images'][0x0]);E['width']=F[b('0x31')];E[b('0x6b')]=F['height'];return E;}}}}}else if(l[b('0x4d')](n,l[b('0x7a')])){if(l[b('0x5c')](l[b('0x67')],l[b('0x8f')])){const I=new this[(b('0x57'))][(b('0x64'))]();I['src']=dataUrl;return I;}else{if(m[b('0x82')](j)[b('0xb')]()[b('0x20')](l[b('0x79')])){const I=await this['Fetch'](j);const J=this[b('0x44')][b('0x72')];const K=new J(await I[b('0x37')]());const L=await K['toBuffer']();const M=l[b('0x11')](l['NwBhp'],L[b('0x74')](l['Wlrsu']));return M;}else if(m[b('0x82')](j)[b('0xb')]()[b('0x20')](l[b('0x45')])){if(l[b('0x76')](l[b('0x91')],l[b('0x91')])){DBM['Actions'][b('0x4f')][b('0x44')]=DBM[b('0x3b')]['getMods']()[b('0x8a')](l[b('0x2a')]);}else{return await this['loadGif'](j);}}else{const O=await this['CanvasJS']['loadImage'](j);const P=this[b('0x57')]['createCanvas'](O['width'],O[b('0x6b')]);const Q=P['getContext']('2d');Q[b('0x1b')](O,0x0,0x0);return P[b('0x2c')](l['RtMEm']);}}}};DBM[b('0x3b')][b('0x4f')]['loadGif']=async function(j){const k={'nvzWN':function(r,s){return r<s;},'mMvHo':'image/png','KhEdY':function(r,s){return r!=s;},'SFeSd':function(r,s){return r===s;},'bFbTu':b('0x73'),'zbDyq':'lvTIH','HMHOI':b('0x60'),'Cxqzh':b('0xe')};const l=await this[b('0x5')]['parse'](j);const m=this[b('0x57')]['createCanvas'](l[0x0][b('0x31')],l[0x0][b('0x6b')]);const n=m['getContext']('2d');const o=n[b('0x18')](0x0,0x0,l[0x0]['width'],l[0x0][b('0x6b')]);let p=0x0;const q={};q[b('0x31')]=l[0x0]['width'];q[b('0x6b')]=l[0x0][b('0x6b')];q[b('0x40')]=[];q['delay']=l[0x0]['delay'];q[b('0x7')]=l[b('0x7')];q[b('0x49')]=!![];while(k[b('0x75')](l[p],null)){if(k[b('0x29')](k[b('0x34')],k['zbDyq'])){DBM[b('0x3b')]['Canvas'][b('0x35')]('','',err);}else{for(let s=0x0;k[b('0x5e')](s,l[p][b('0x84')][b('0x81')]);s++){if(k[b('0x29')](k[b('0x39')],k['Cxqzh'])){for(let v=0x0;k['nvzWN'](v,l[p][b('0x84')][b('0x81')]);v++){o[b('0x84')][v]=l[p]['data'][v];}n[b('0x3c')](o,0x0,0x0);q[b('0x40')]['push'](m[b('0x2c')](k[b('0x2e')]));p++;}else{o[b('0x84')][s]=l[p][b('0x84')][s];}}n['putImageData'](o,0x0,0x0);q[b('0x40')][b('0x4')](m['toDataURL'](k[b('0x2e')]));p++;}}return q;};
  }
}
