(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ts=[{w:'Día',a:'Noche'},{w:'Entrada',a:'Salida'},{w:'Lleno',a:'Vacío'},{w:'Alegre',a:'Triste'},{w:'Nuevo',a:'Viejo'}];
      g.data=utils.shuffle(ts);g.idx=0;g.opts=utils.shuffle(ts.map(x=>x.a));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].a){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();