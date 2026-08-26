const PIXEL_INV_VERSION='v0.9.2-alpha';
let invOpen=false;
const oldClearPanels=clearPanels;
clearPanels=function(){oldClearPanels();invOpen=false};
function ensureInvTextures(s){const files={invAsset:'assets/ui/inventory-frame.svg',slotAsset:'assets/ui/item-slot.svg'};for(const [k,p] of Object.entries(files))if(!s.textures.exists(k))s.load.svg(k,p)}
function destroyInv(){invPanel.forEach(o=>o&&o.destroy());invPanel=[];invOpen=false}
function itemGlyph(item){if(item.slot==='head')return '⛑';if(item.slot==='body')return '♜';if(item.slot==='legs')return '♟';return playerClass==='Warrior'?'⚔':playerClass==='Wizard'?'✦':'➶'}
function refreshInv(s){destroyInv();toggleInventory(s)}
toggleInventory=function(s){if(invOpen){destroyInv();return}clearPanels();invOpen=true;ensureInvTextures(s);const build=()=>{
 const bg=s.add.image(720,275,'invAsset').setDisplaySize(470,490).setDepth(50).setInteractive();invPanel.push(bg);
 const title=s.add.text(720,47,'INVENTORY  •  EQUIPMENT',{fontFamily:'Georgia',fontSize:'18px',fontStyle:'bold',color:'#ebc976'}).setOrigin(.5).setDepth(53);invPanel.push(title);
 const close=s.add.text(912,48,'✕',{fontFamily:'Georgia',fontSize:'20px',color:'#f1d28a',backgroundColor:'#28180f',padding:{x:8,y:4}}).setOrigin(.5).setDepth(55).setInteractive();close.on('pointerdown',destroyInv);invPanel.push(close);
 const labels=[['head','HEAD',602,115],['body','BODY',602,190],['legs','LEGS',602,265],['weapon','WEAPON',602,340]];
 labels.forEach(([slot,label,x,y])=>{const im=s.add.image(x,y,'slotAsset').setDisplaySize(64,64).setDepth(52).setInteractive();invPanel.push(im);const it=equipment[slot];const glyph=s.add.text(x,y,it?itemGlyph(it):'·',{fontFamily:'Georgia',fontSize:'26px',color:it?colorHex(it.tier):'#5b554d'}).setOrigin(.5).setDepth(54);invPanel.push(glyph);const tx=s.add.text(x+47,y-17,`${label}\n${it?it.name:'Empty'}`,{fontFamily:'monospace',fontSize:'11px',color:it?colorHex(it.tier):'#8c8374'}).setDepth(54);invPanel.push(tx);if(it){im.on('pointerdown',()=>{equipment[slot]=null;refreshInv(s)})}});
 const stat=s.add.text(590,393,`POWER ${totalPower()}   •   SET ${setBonus()?'ACTIVE +12':'none'}\nTap equipped item to UNEQUIP • tap bag item to EQUIP`,{fontFamily:'monospace',fontSize:'10px',color:'#cdbb91'}).setDepth(54);invPanel.push(stat);
 inventory.slice(0,12).forEach((it,i)=>{const col=i%3,row=Math.floor(i/3),x=758+col*58,y=116+row*67;const sl=s.add.image(x,y,'slotAsset').setDisplaySize(51,51).setDepth(52).setInteractive();const gl=s.add.text(x,y-4,itemGlyph(it),{fontFamily:'Georgia',fontSize:'20px',color:colorHex(it.tier)}).setOrigin(.5).setDepth(54);const pw=s.add.text(x,y+19,'+'+it.power,{fontFamily:'monospace',fontSize:'8px',color:'#f2d586'}).setOrigin(.5).setDepth(54);sl.on('pointerdown',()=>{equipment[it.slot]=it;refreshInv(s)});invPanel.push(sl,gl,pw)});
 const itemInfo=s.add.text(758,400,`BAG ${inventory.length}/12\nBronze → Iron → Steel → Shadow → Obsidian\nDarker items = higher tier`,{fontFamily:'monospace',fontSize:'10px',color:'#aeb9a1'}).setDepth(54);invPanel.push(itemInfo);
 const ver=s.add.text(905,471,PIXEL_INV_VERSION,{fontFamily:'monospace',fontSize:'9px',color:'#826a43'}).setOrigin(1,0).setDepth(54);invPanel.push(ver)
 };
 if(!s.textures.exists('invAsset')||!s.textures.exists('slotAsset')){s.load.once('complete',build);s.load.start()}else build()
};