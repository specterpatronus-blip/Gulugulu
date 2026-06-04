(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.idx=0;g.data=[{w:'Brillante',t:'Adjetivo'},{w:'Caminar',t:'Verbo'},{w:'Nosotros',t:'Pronombre'},{w:'Rápidamente',t:'Adverbio'},{w:'Escuela',t:'Sustantivo'}];g.options=['Sustantivo','Verbo','Adjetivo','Pronombre','Adverbio'];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].t){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();