(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.figs=[{e:'🧊',n:'Cubo'},{e:'🌍',n:'Esfera'},{e:'⛺',n:'Pirámide'},{e:'🥤',n:'Cilindro'}];const f=g.figs[utils.rnd(0,3)];g.emoji=f.e;g.ans=f.n;g.opts=utils.shuffle(g.figs.map(x=>x.n));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();