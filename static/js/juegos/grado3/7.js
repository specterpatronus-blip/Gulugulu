(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const shapes=[{n:'Triángulo',s:[5,5,5]},{n:'Cuadrado',s:[4,4,4,4]},{n:'Rectángulo',s:[6,3,6,3]}];
      const sh=shapes[utils.rnd(0,shapes.length-1)];g.shape=sh.n;g.sides=sh.s;
      g.ans=sh.s.reduce((a,b)=>a+b,0);
      g.opts=utils.shuffle([g.ans,g.ans+2,g.ans-1>0?g.ans-1:g.ans+5,g.ans*2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();