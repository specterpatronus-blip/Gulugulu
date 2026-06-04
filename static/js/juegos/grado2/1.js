(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const dbl=Math.random()>.5;const n=dbl?utils.rnd(2,15):utils.rnd(1,7)*2;const a=dbl?n*2:n/2;g.ans=a;g.num=n;g.label=dbl?`el DOBLE de ${n}`:`la MITAD de ${n}`;const opts=[a,a+1,a+2];if(a-1>=1)opts.push(a-1);else opts.push(a+3);g.opts=utils.shuffle(opts);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();