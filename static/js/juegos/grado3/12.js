(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ws=[{w:'Perro',t:'Sustantivo'},{w:'Correr',t:'Verbo'},{w:'Rápido',t:'Adjetivo'},{w:'Mesa',t:'Sustantivo'},{w:'Saltar',t:'Verbo'},{w:'Bonito',t:'Adjetivo'},{w:'Libro',t:'Sustantivo'},{w:'Escribir',t:'Verbo'}];
      g.data=utils.shuffle(ws).slice(0,5);g.idx=0;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].t){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();