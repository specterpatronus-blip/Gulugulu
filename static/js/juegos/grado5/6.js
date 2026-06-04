(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.idx=0;g.data=[{w:'Ayer',t:'Tiempo'},{w:'Aquí',t:'Lugar'},{w:'Mucho',t:'Cantidad'},{w:'Bien',t:'Modo'},{w:'No',t:'Negación'}];g.options=['Lugar','Tiempo','Modo','Cantidad','Negación'];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].t){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();