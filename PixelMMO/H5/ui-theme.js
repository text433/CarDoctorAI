const PIXELMMO_VERSION='v0.8.1-alpha';
let uiThemeBuilt=false,uiLayer=[],armLayer=null,uiVersion=null,uiName=null,uiHpFill=null,uiXpFill=null,uiStatsText=null,uiZoneText=null;
const oldStartGame=startGame;
startGame=function(s,c){oldStartGame(s,c);buildFantasyUI(s);};

function panel(s,x,y,w,h,fill=0x0a0d0a,stroke=0x8b6b32,depth=37){
  const bg=s.add.rectangle(x,y,w,h,fill,.92).setStrokeStyle(2,stroke,.95).setDepth(depth);
  const inner=s.add.rectangle(x,y,w-8,h-8,0x151b13,.45).setStrokeStyle(1,0x3b2d18,.9).setDepth(depth+.1);
  uiLayer.push(bg,inner);return bg;
}
function buildFantasyUI(s){
  if(uiThemeBuilt)return;uiThemeBuilt=true;
  if(hud)hud.setVisible(false);if(statsBtn)statsBtn.setVisible(false);if(invBtn)invBtn.setVisible(false);
  panel(s,155,56,286,82,0x080b08,0x9e7a3c,37);
  const portrait=s.add.circle(50,56,28,classes[playerClass].color).setStrokeStyle(4,0x9e7a3c).setDepth(39);
  const crest=s.add.text(50,56,playerClass==='Warrior'?'⚔':playerClass==='Wizard'?'✦':'➶',{fontFamily:'serif',fontSize:'24px',color:'#f2d48b'}).setOrigin(.5).setDepth(40);
  uiName=s.add.text(88,27,`${playerClass.toUpperCase()}  •  LV ${level}`,{fontFamily:'monospace',fontSize:'15px',color:'#f0d28a'}).setDepth(40);
  s.add.rectangle(178,51,166,13,0x25090a,.95).setStrokeStyle(1,0x5c381e).setDepth(39);
  uiHpFill=s.add.rectangle(95,51,166,11,0xb43635).setOrigin(0,.5).setDepth(40);
  s.add.rectangle(178,69,166,9,0x0b1830,.95).setStrokeStyle(1,0x5c381e).setDepth(39);
  uiXpFill=s.add.rectangle(95,69,166,7,0x3d6fbe).setOrigin(0,.5).setDepth(40);
  uiStatsText=s.add.text(272,43,'',{fontFamily:'monospace',fontSize:'10px',color:'#c9b98c',align:'right'}).setOrigin(1,0).setDepth(40);
  uiLayer.push(portrait,crest,uiName,uiHpFill,uiXpFill,uiStatsText);

  panel(s,868,91,154,154,0x070a08,0x9e7a3c,34);
  const radarTitle=s.add.text(868,20,'WORLD RADAR',{fontFamily:'monospace',fontSize:'10px',color:'#d5bc79'}).setOrigin(.5).setDepth(38);
  const legend=s.add.text(868,154,'● enemy   ◆ boss   ✦ loot',{fontFamily:'monospace',fontSize:'8px',color:'#a99870'}).setOrigin(.5).setDepth(38);
  uiLayer.push(radarTitle,legend);

  panel(s,480,506,390,58,0x080b08,0x9e7a3c,37);
  const barLabel=s.add.text(480,478,'AUTO SKILLS',{fontFamily:'monospace',fontSize:'9px',color:'#d8c28a'}).setOrigin(.5).setDepth(39);
  uiLayer.push(barLabel);

  const statsButton=s.add.text(765,205,'CHARACTER',{fontFamily:'monospace',fontSize:'12px',color:'#f0d28a',backgroundColor:'#2a2115',padding:{x:10,y:7}}).setStroke('#80602f',1).setDepth(44).setInteractive();
  const invButton=s.add.text(765,244,'INVENTORY',{fontFamily:'monospace',fontSize:'12px',color:'#dce5c7',backgroundColor:'#172018',padding:{x:10,y:7}}).setStroke('#52623e',1).setDepth(44).setInteractive();
  statsButton.on('pointerdown',()=>toggleStats(s));invButton.on('pointerdown',()=>toggleInventory(s));uiLayer.push(statsButton,invButton);

  uiVersion=s.add.text(16,514,PIXELMMO_VERSION,{fontFamily:'monospace',fontSize:'10px',color:'#806f4f'}).setDepth(44);
  uiZoneText=s.add.text(480,18,'',{fontFamily:'monospace',fontSize:'11px',color:'#d4bd7b',backgroundColor:'#0a0d09cc',padding:{x:8,y:4}}).setOrigin(.5).setDepth(44);
  uiLayer.push(uiVersion,uiZoneText);

  drawCharacterArms(s);
  s.events.on('update',updateFantasyUI);
}

function drawCharacterArms(s){
  armLayer=s.add.graphics().setDepth(10.5);uiLayer.push(armLayer);
}
function updateFantasyUI(){
  if(!uiThemeBuilt||!gameStarted)return;
  const hpPct=Math.max(0,Math.min(1,hp/maxHp));
  const xpPct=Math.max(0,Math.min(1,xp/(level*100)));
  if(uiHpFill)uiHpFill.displayWidth=166*hpPct;
  if(uiXpFill)uiXpFill.displayWidth=166*xpPct;
  if(uiName)uiName.setText(`${playerClass.toUpperCase()}  •  LV ${level}`);
  if(uiStatsText)uiStatsText.setText(`HP ${Math.ceil(hp)}/${maxHp}\nPWR ${totalPower()}  PTS ${points}`);
  if(uiZoneText)uiZoneText.setText(`ZONE ${currentZone()}   •   DIST ${Math.floor(totalDistance)}`);
  updateArms();
}
function updateArms(){
  if(!armLayer)return;armLayer.clear();
  const a=facing.angle(),fx=Math.cos(a),fy=Math.sin(a),px=-fy,py=fx;
  const shoulder=13,handForward=18,handSide=8;
  const skin=0xc69262,glove=playerClass==='Warrior'?0x5b4732:playerClass==='Wizard'?0x42516c:0x4b5d38;
  const sx1=480+px*shoulder,sy1=270+py*shoulder,sx2=480-px*shoulder,sy2=270-py*shoulder;
  const hx1=480+fx*handForward+px*handSide,hy1=270+fy*handForward+py*handSide;
  const hx2=480+fx*(handForward+2)-px*handSide,hy2=270+fy*(handForward+2)-py*handSide;
  armLayer.lineStyle(8,glove,1);armLayer.lineBetween(sx1,sy1,hx1,hy1);armLayer.lineBetween(sx2,sy2,hx2,hy2);
  armLayer.fillStyle(skin,1);armLayer.fillCircle(hx1,hy1,5);armLayer.fillCircle(hx2,hy2,5);
  armLayer.lineStyle(2,0x24180f,.9);armLayer.strokeCircle(hx1,hy1,5);armLayer.strokeCircle(hx2,hy2,5);
  if(playerClass==='Archer'){
    armLayer.lineStyle(2,0xe6d3a6,.85);armLayer.lineBetween(hx1,hy1,hx2,hy2);
  }
}
