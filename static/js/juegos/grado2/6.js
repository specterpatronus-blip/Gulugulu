(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.words=[{w:'perro',t:'Sustantivo',e:'🐕'},{w:'corre',t:'Verbo',e:'🏃'},{w:'azul',t:'Adjetivo',e:'🔵'},{w:'niña',t:'Sustantivo',e:'👧'},{w:'salta',t:'Verbo',e:'🦘'}];g.idx=0;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.words[g.idx].t){score.value++;if(g.idx===g.words.length-1)win();else g.idx++;}else utils.shake(e.target);
    }
  };
})();