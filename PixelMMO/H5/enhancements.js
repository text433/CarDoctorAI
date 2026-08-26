// PixelMMO enhancement layer: visible version + automatic skill cooldown casting.
const PIXELMMO_VERSION='0.8.0-alpha';
const AUTO_SKILL_POLL_MS=250;
let autoSkillLabels=[];

function skillCooldownMs(i){return 2600+i*800;}

function autoSkillTick(){
  if(typeof gameStarted==='undefined'||!gameStarted||!S||!S.time||!enemies)return;
  if(!enemies.getChildren().some(e=>e&&e.active))return;
  const now=S.time.now;
  for(let i=0;i<3;i++){
    const cd=skillCooldownMs(i);
    const remain=Math.max(0,cd-(now-lastSkills[i]));
    if(autoSkillLabels[i])autoSkillLabels[i].setText(remain>0?(remain/1000).toFixed(1)+'s':'AUTO');
    if(remain<=0)useSkill(S,i);
  }
}

function installVersionHud(){
  const wait=setInterval(()=>{
    if(typeof gameStarted==='undefined'||!gameStarted||!S)return;
    clearInterval(wait);
    S.add.rectangle(118,92,205,30,0x070a08,.86).setStrokeStyle(1,0x72572c,.9).setDepth(39);
    S.add.text(21,83,'PIXELMMO  v'+PIXELMMO_VERSION,{fontFamily:'monospace',fontSize:'11px',color:'#c9aa66'}).setDepth(40);
    classes[playerClass].skills.forEach((name,i)=>{
      const x=690+i*82,y=512;
      autoSkillLabels[i]=S.add.text(x,y,'AUTO',{fontFamily:'monospace',fontSize:'10px',color:'#e4c777',backgroundColor:'#090b09cc',padding:{x:4,y:2}}).setOrigin(.5).setDepth(44);
    });
  },250);
}

setInterval(autoSkillTick,AUTO_SKILL_POLL_MS);
installVersionHud();
