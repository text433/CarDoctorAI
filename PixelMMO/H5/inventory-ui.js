const PIXEL_INV_VERSION='v0.9.3-alpha';
let invOpen=false,selectedInvItem=null;
const oldClearPanels=clearPanels;
clearPanels=function(){oldClearPanels();invOpen=false;selectedInvItem=null};
function ensureInvTextures(s){const files={invAsset:'assets/ui/inventory-frame.svg',slotAsset:'assets/ui/item-slot.svg'};for(const [k,p] of Object.entries(files))if(!s.textures.exists(k))s.load.svg(k,p)}
function destroyInv(){invPanel.forEach(o=>o&&o.destroy());invPanel=[];invOpen=false}
function itemGlyph(item){if(item.slot==='head')return '⛑';if(item.slot==='body')return '♜';if(item.slot==='legs')return '♟';return playerClass==='Warrior'?'⚔':playerClass==='Wizard'?'✦':'➶'}
function equipFromBag(index){const item=inventory[index];if(!item)return;const old=equipment[item.slot];equipment[item.slot]=item;inventory.splice(index,1);if(old)inventory.push(old)}
function unequipSlot(slot){const old=equipment[slot];if(!old)return;if(inventory.length>=18)return;equipment[slot]=null;inventory.push(old)}
function refreshInv(s){destroyInv();toggleInventory(s)}
function tierText(it){return `${tierNames[it.tier]||'Unknown'} • +${it.power} Power${it.set?' • '+it.set+' Set':''}`}
toggleInventory=function(s){if(invOpen){destroyInv();return}clearPanels();invOpen=true;ensureInvTextures(s);const build=()=>{
 const bg=s.add.image(720,275,'invAsset').setDisplaySize(500,500).setDepth(50).setInteractive();invPanel.push(bg);
 const title=s.add.text(720,43,'INVENTORY  •  EQUIPMENT',{fontFamily:'Georgia',fontSize:'18px',fontStyle:'bold',color:'#ebc976'}).setOrigin(.5).setDepth(53);invPanel.push(title);
 const close=s.add.text(924,47,'✕',{fontFamily:'Georgia',fontSize:'20px',color:'#f1d28a',backgroundColor:'#28180f',padding:{x:8,y:4}}).setOrigin(.5).setDepth(55).setInteractive();close.on('pointerdown',destroyInv);invPanel.push(close);
 const labels=[['head','HEAD',594,112],['body','BODY',594,190],['legs','LEGS',594,268],['weapon','WEAPON',594,346]];
 labels.forEach(([slot,label,x,y])=>{const im=s.add.image(x,y,'slotAsset').setDisplaySize(66,66).setDepth(52).setInteractive();invPanel.push(im);const it=equipment[slot];const glyph=s.add.text(x,y-3,it?itemGlyph(it):'·',{fontFamily:'Georgia',fontSize:'27px',color:it?colorHex(it.tier):'#5b554d'}).setOrigin(.5).setDepth(54);invPanel.push(glyph);const tx=s.add.text(x+46,y-20,`${label}\n${it?it.name:'Empty'}\n${it?tierText(it):'Tap bag item to equip'}`,{fontFamily:'monospace',fontSize:'9px',color:it?colorHex(it.tier):'#8c8374',wordWrap:{width:125}}).setDepth(54);invPanel.push(tx);if(it){im.on('pointerdown',()=>{unequipSlot(slot);refreshInv(s)})}});
 const divider=s.add.rectangle(718,382,245,1,0x76552b,.7).setDepth(53);invPanel.push(divider);
 const stat=s.add.text(575,395,`POWER ${totalPower()}   •   SET ${setBonus()?'ACTIVE +12':'none'}\nTap equipped item = UNEQUIP`,{fontFamily:'monospace',fontSize:'10px',color:'#cdbb91'}).setDepth(54);invPanel.push(stat);
 inventory.slice(0,18).forEach((it,i)=>{const col=i%4,row=Math.floor(i/4),x=757+col*48,y=105+row*58;const sl=s.add.image(x,y,'slotAsset').setDisplaySize(44,44).setDepth(52).setInteractive();const gl=s.add.text(x,y-5,itemGlyph(it),{fontFamily:'Georgia',fontSize:'18px',color:colorHex(it.tier)}).setOrigin(.5).setDepth(54);const pw=s.add.text(x,y+14,'+'+it.power,{fontFamily:'monospace',fontSize:'8px',color:'#f2d586'}).setOrigin(.5).setDepth(54);sl.on('pointerdown',()=>{selectedInvItem=i;showItemDetail(s,it,i)});invPanel.push(sl,gl,pw)});
 const itemInfo=s.add.text(747,391,`BAG ${inventory.length}/18\nBronze → Iron → Steel → Shadow → Obsidian\nDarker = stronger`,{fontFamily:'monospace',fontSize:'9px',color:'#aeb9a1'}).setDepth(54);invPanel.push(itemInfo);
 const ver=s.add.text(922,477,PIXEL_INV_VERSION,{fontFamily:'monospace',fontSize:'9px',color:'#826a43'}).setOrigin(1,0).setDepth(54);invPanel.push(ver)
 };
 if(!s.textures.exists('invAsset')||!s.textures.exists('slotAsset')){s.load.once('complete',build);s.load.start()}else build()
};
function showItemDetail(s,it,index){invPanel.filter(o=>o&&o.__detail).forEach(o=>o.destroy());const box=s.add.rectangle(820,421,190,88,0x080b09,.96).setStrokeStyle(2,0x8d6732).setDepth(56);box.__detail=true;const txt=s.add.text(735,389,`${it.name}\n${tierText(it)}\nSlot: ${it.slot.toUpperCase()}`,{fontFamily:'monospace',fontSize:'10px',color:colorHex(it.tier)}).setDepth(57);txt.__detail=true;const eq=s.add.text(885,438,'EQUIP',{fontFamily:'Georgia',fontSize:'11px',fontStyle:'bold',color:'#f3d17b',backgroundColor:'#392713',padding:{x:10,y:6}}).setOrigin(.5).setDepth(58).setInteractive();eq.__detail=true;eq.on('pointerdown',()=>{equipFromBag(index);refreshInv(s)});invPanel.push(box,txt,eq)}