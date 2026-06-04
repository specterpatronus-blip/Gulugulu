(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.animals=[{n:'Tiburón',e:'🦈',h:'Mar'},{n:'Búho',e:'🦉',h:'Bosque'},{n:'Camello',e:'🐪',h:'Desierto'},{n:'Oso Polar',e:'🐻‍❄️',h:'Ártico'}];g.idx=0;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.animals[g.idx].h){score.value++;if(g.idx===g.animals.length-1)win();else g.idx++;}else utils.shake(e.target);
    }
  };
})();