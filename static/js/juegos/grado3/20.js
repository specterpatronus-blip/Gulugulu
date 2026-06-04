(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ps=[{q:'Si tengo 3 cajas con 5 manzanas cada una, ¿cuántas hay?',a:15},{q:'Había 20 dulces y se repartieron entre 4 niños, ¿cuántos para cada uno?',a:5},{q:'Compré 2 lápices de $500 cada uno, ¿cuánto gasté?',a:1000}];
      const p=ps[utils.rnd(0,ps.length-1)];g.clue=p.q;g.ans=p.a;g.opts=utils.shuffle([g.ans,g.ans+5,g.ans*2,g.ans-2>0?g.ans-2:g.ans+10]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();