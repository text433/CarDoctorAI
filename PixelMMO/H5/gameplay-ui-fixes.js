const PIXEL_GAMEPLAY_PATCH='v0.9.3-alpha';
const _spawnLoot=spawnLoot;
spawnLoot=function(s,starter=false){
  const before=new Set(loots?loots.getChildren():[]);
  _spawnLoot(s,starter);
  if(!loots)return;
  const created=loots.getChildren().find(x=>!before.has(x));
  if(created&&created.item&&created.label){
    created.label.setText(created.item.name+'  +'+created.item.power);
    created.label.setColor(colorHex(created.item.tier));
    created.label.setFontSize('9px');
  }
};