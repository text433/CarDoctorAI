const config={type:Phaser.AUTO,width:960,height:540,backgroundColor:'#11151d',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:{create,update}};
new Phaser.Game(config);
let player,cursors,enemies,hp=100,xp=0,level=1,hud,lastAttack=0;
function create(){
 const g=this.add.graphics();g.fillStyle(0x182019).fillRect(0,0,960,540);g.lineStyle(1,0x263328,.35);for(let x=0;x<960;x+=32)g.lineBetween(x,0,x,540);for(let y=0;y<540;y+=32)g.lineBetween(0,y,960,y);
 player=this.add.rectangle(480,270,24,24,0xd6a84b);this.physics.add.existing(player);player.body.setCollideWorldBounds(true);
 cursors=this.input.keyboard.createCursorKeys();enemies=this.physics.add.group();for(let i=0;i<12;i++)spawnEnemy(this);
 hud=this.add.text(14,12,'',{fontFamily:'monospace',fontSize:'18px',color:'#f3d27a'}).setDepth(10);
 this.input.on('pointerdown',()=>attack(this));
 this.add.text(14,510,'MOVE: arrows/WASD   ATTACK: tap/click/SPACE',{fontFamily:'monospace',fontSize:'14px',color:'#b7b7b7'});
 this.keys=this.input.keyboard.addKeys('W,A,S,D,SPACE');
}
function spawnEnemy(s){const e=s.add.rectangle(Phaser.Math.Between(40,920),Phaser.Math.Between(50,490),20,20,0x8f2d38);s.physics.add.existing(e);e.hp=50;enemies.add(e);}
function update(time){
 let dx=(cursors.left.isDown||this.keys.A.isDown?-1:0)+(cursors.right.isDown||this.keys.D.isDown?1:0),dy=(cursors.up.isDown||this.keys.W.isDown?-1:0)+(cursors.down.isDown||this.keys.S.isDown?1:0);let v=new Phaser.Math.Vector2(dx,dy).normalize().scale(190);player.body.setVelocity(v.x,v.y);
 if(Phaser.Input.Keyboard.JustDown(this.keys.SPACE))attack(this,time);
 enemies.children.iterate(e=>{if(!e)return;let d=Phaser.Math.Distance.Between(e.x,e.y,player.x,player.y);if(d<220){this.physics.moveToObject(e,player,55);if(d<25&&time>(e.hitAt||0)){e.hitAt=time+800;hp=Math.max(0,hp-8);if(hp===0){hp=100;player.setPosition(480,270);}}}else e.body.setVelocity(0);});
 hud.setText(`PIXELMMO  LV ${level}  HP ${hp}/100  XP ${xp}/${level*100}`);
}
function attack(s,time=performance.now()){if(time-lastAttack<350)return;lastAttack=time;enemies.children.iterate(e=>{if(e&&Phaser.Math.Distance.Between(e.x,e.y,player.x,player.y)<65){e.hp-=25;if(e.hp<=0){e.destroy();xp+=25;if(xp>=level*100){xp-=level*100;level++;}s.time.delayedCall(900,()=>spawnEnemy(s));}}});}
