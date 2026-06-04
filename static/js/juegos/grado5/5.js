(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.idx=0;g.data=[{w:'_ielo',a:'H',ans:'Hielo'},{w:'_uevo',a:'H',ans:'Huevo'},{w:'_ora',a:'H',ans:'Hora'},{w:'_ermoso',a:'H',ans:'Hermoso'},{w:'_ueso',a:'H',ans:'Hueso'}];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].a){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();