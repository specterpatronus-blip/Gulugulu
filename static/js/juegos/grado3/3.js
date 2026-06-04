(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const fs=[{n:1,d:2},{n:1,d:3},{n:1,d:4},{n:2,d:3},{n:3,d:4}];const f=fs[utils.rnd(0,fs.length-1)];g.num=f.n;g.den=f.d;const mk=(n,d)=>`${n}/${d}`;const a=mk(f.n*2,f.d*2);g.answer=a;g.opts=utils.shuffle([a,mk(f.n*3,f.d*2),mk(f.n,f.d*3),mk(f.n+1,f.d)]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.answer)win();else lose();
    }
  };
})();