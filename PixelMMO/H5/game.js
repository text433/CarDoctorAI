const config={type:Phaser.AUTO,width:960,height:540,backgroundColor:'#11151d',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:{create,update}};
new Phaser.Game(config);

let player,weapon,cursors,enemies,hp=100,xp=0,level=1,hud,lastAttack=0,lastSkill=0;
let joyBase,joyKnob,joyDir=new Phaser.Math.Vector2(),joyPointer=null,attackBtn,skillBtn;
let facing=new Phaser.Math.Vector2(1,0),isSwinging=false;

function create(){
  const g=this.add.graphics();
  g.fillStyle(0x182019).fillRect(0,0,960,540);
  g.lineStyle(1,0x263328,.35);
  for(let x=0;x<960;x+=32)g.lineBetween(x,0,x,540);
  for(let y=0;y<540;y+=32)g.lineBetween(0,y,960,y);

  // .io style: top-down round player body
  player=this.add.circle(480,270,18,0xcda85b).setStrokeStyle(4,0x5d4522,1);
  this.physics.add.existing(player);
  player.body.setCircle(18).setCollideWorldBounds(true);

  // simple sword/weapon attached to the player's edge
  weapon=this.add.rectangle(510,270,34,8,0xd7dbe0).setStrokeStyle(2,0x4b5563,1).setOrigin(.15,.5).setDepth(4);
  this.add.circle(502,270,5,0x8b5a2b).setDepth(3).setName('guard');

  cursors=this.input.keyboard.createCursorKeys();
  enemies=this.physics.add.group();
  for(let i=0;i<12;i++)spawnEnemy(this);

  hud=this.add.text(14,12,'',{fontFamily:'monospace',fontSize:'18px',color:'#f3d27a'}).setDepth(20).setScrollFactor(0);
  this.keys=this.input.keyboard.addKeys('W,A,S,D,SPACE,Q');
  setupTouchControls(this);
}

function setupTouchControls(s){
  joyBase=s.add.circle(105,435,62,0x000000,.35).setStrokeStyle(3,0x8e7947,.8).setDepth(30).setScrollFactor(0);
  joyKnob=s.add.circle(105,435,28,0xc2a55b,.65).setDepth(31).setScrollFactor(0);
  joyBase.setInteractive(new Phaser.Geom.Circle(62,62,62),Phaser.Geom.Circle.Contains);
  joyBase.on('pointerdown',p=>{joyPointer=p.id;updateJoy(p);});
  s.input.on('pointermove',p=>{if(p.id===joyPointer&&p.isDown)updateJoy(p);});
  s.input.on('pointerup',p=>{if(p.id===joyPointer){joyPointer=null;joyDir.set(0,0);joyKnob.setPosition(105,435);}});

  attackBtn=s.add.circle(850,430,52,0x7c2d2d,.8).setStrokeStyle(3,0xe07a5f,1).setDepth(30).setScrollFactor(0).setInteractive();
  s.add.text(850,430,'ATK',{fontFamily:'monospace',fontSize:'18px',color:'#fff'}).setOrigin(.5).setDepth(31).setScrollFactor(0);
  attackBtn.on('pointerdown',()=>attack(s));

  skillBtn=s.add.circle(755,455,38,0x2f5d78,.85).setStrokeStyle(3,0x76c7c0,1).setDepth(30).setScrollFactor(0).setInteractive();
  s.add.text(755,455,'SKILL',{fontFamily:'monospace',fontSize:'12px',color:'#fff'}).setOrigin(.5).setDepth(31).setScrollFactor(0);
  skillBtn.on('pointerdown',()=>skill(s));
}

function updateJoy(p){
  const base=new Phaser.Math.Vector2(105,435),pos=new Phaser.Math.Vector2(p.x,p.y),delta=pos.subtract(base);
  if(delta.length()>55)delta.setLength(55);
  joyKnob.setPosition(105+delta.x,435+delta.y);
  joyDir=delta.clone().scale(1/55);
}

function spawnEnemy(s){
  const e=s.add.circle(Phaser.Math.Between(40,920),Phaser.Math.Between(50,490),14,0x8f2d38).setStrokeStyle(3,0x3f1017,1);
  s.physics.add.existing(e);
  e.body.setCircle(14);
  e.hp=50;
  enemies.add(e);
}

function update(time){
  let dx=(cursors.left.isDown||this.keys.A.isDown?-1:0)+(cursors.right.isDown||this.keys.D.isDown?1:0);
  let dy=(cursors.up.isDown||this.keys.W.isDown?-1:0)+(cursors.down.isDown||this.keys.S.isDown?1:0);
  let v=new Phaser.Math.Vector2(dx,dy);
  if(joyDir.lengthSq()>.01)v.copy(joyDir);

  if(v.lengthSq()>0){
    v.normalize();
    facing.copy(v);
    player.body.setVelocity(v.x*190,v.y*190);
  } else player.body.setVelocity(0,0);

  if(!isSwinging)placeWeapon();

  if(Phaser.Input.Keyboard.JustDown(this.keys.SPACE))attack(this,time);
  if(Phaser.Input.Keyboard.JustDown(this.keys.Q))skill(this,time);

  enemies.children.iterate(e=>{
    if(!e)return;
    const d=Phaser.Math.Distance.Between(e.x,e.y,player.x,player.y);
    if(d<220){
      this.physics.moveToObject(e,player,55);
      if(d<33&&time>(e.hitAt||0)){
        e.hitAt=time+800;
        hp=Math.max(0,hp-8);
        player.setFillStyle(0xf2c879);
        this.time.delayedCall(100,()=>player.setFillStyle(0xcda85b));
        if(hp===0){hp=100;player.setPosition(480,270);}
      }
    } else e.body.setVelocity(0);
  });

  hud.setText(`PIXELMMO  LV ${level}  HP ${hp}/100  XP ${xp}/${level*100}`);
}

function placeWeapon(){
  const angle=facing.angle();
  weapon.setPosition(player.x+facing.x*17,player.y+facing.y*17);
  weapon.rotation=angle;
}

function attack(s,time=performance.now()){
  if(time-lastAttack<350)return;
  lastAttack=time;
  isSwinging=true;

  const base=facing.angle();
  weapon.setPosition(player.x+facing.x*17,player.y+facing.y*17);
  weapon.rotation=base-0.8;

  s.tweens.add({
    targets:weapon,
    rotation:base+0.9,
    duration:150,
    yoyo:true,
    ease:'Quad.easeOut',
    onComplete:()=>{isSwinging=false;placeWeapon();}
  });

  enemies.children.iterate(e=>{
    if(e&&Phaser.Math.Distance.Between(e.x,e.y,player.x,player.y)<72){
      const toEnemy=new Phaser.Math.Vector2(e.x-player.x,e.y-player.y).normalize();
      if(facing.dot(toEnemy)>-0.1){
        e.hp-=25;
        e.setFillStyle(0xd94b5a);
        s.time.delayedCall(80,()=>{if(e.active)e.setFillStyle(0x8f2d38);});
        if(e.hp<=0)killEnemy(s,e);
      }
    }
  });
}

function skill(s,time=performance.now()){
  if(time-lastSkill<2200)return;
  lastSkill=time;
  const ring=s.add.circle(player.x,player.y,20,0x56cfe1,.18).setStrokeStyle(4,0x56cfe1,1).setDepth(2);
  s.tweens.add({targets:ring,scaleX:5,scaleY:5,alpha:0,duration:320,onComplete:()=>ring.destroy()});
  enemies.children.iterate(e=>{
    if(e&&Phaser.Math.Distance.Between(e.x,e.y,player.x,player.y)<105){
      e.hp-=40;
      if(e.hp<=0)killEnemy(s,e);
    }
  });
}

function killEnemy(s,e){
  e.destroy();
  xp+=25;
  if(xp>=level*100){xp-=level*100;level++;hp=100;}
  s.time.delayedCall(900,()=>spawnEnemy(s));
}
