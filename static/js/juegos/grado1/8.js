(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{name:'ROJO',hex:'#EF4444'},{name:'AZUL',hex:'#3B82F6'},{name:'VERDE',hex:'#10B981'},{name:'AMARILLO',hex:'#F59E0B'}];const t=d[utils.rnd(0,3)];g.targetName=t.name;g.targetHex=t.hex;g.colors=utils.shuffle([...d]);
    },
    play: (v, e, g, utils, win, score) => {
      if(v.hex===g.targetHex)win();else utils.shake(e.target);
    }
  };
})();