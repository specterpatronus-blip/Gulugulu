(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.idx=0;g.data=[{n:'Hielo',e:'🧊',state:'sólido'},{n:'Agua',e:'💧',state:'líquido'},{n:'Vapor',e:'💨',state:'gaseoso'},{n:'Piedra',e:'🪨',state:'sólido'},{n:'Leche',e:'🥛',state:'líquido'}];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].state){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();