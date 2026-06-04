(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ws=[{w:'Gigante',s:'Enorme'},{w:'Feliz',s:'Alegre'},{w:'Rápido',s:'Veloz'},{w:'Bonito',s:'Hermoso'},{w:'Saltar',s:'Brincar'}];
      const w=ws[utils.rnd(0,ws.length-1)];g.word=w.w;g.ans=w.s;g.opts=utils.shuffle([w.s,'Pequeño','Lento','Feo','Gritar']);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();